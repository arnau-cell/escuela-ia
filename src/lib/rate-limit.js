// Límite de uso simple por IP/día sobre un KV de Cloudflare — evita dejar un endpoint de LLM
// abierto a coste ilimitado en un sitio gratuito y público. Un namespace KV cualquiera funciona
// en cualquier plan de Cloudflare (a diferencia de las reglas de Rate Limiting nativas, que son
// una feature de WAF/Ruleset que puede requerir un plan de pago). Función pura salvo el propio
// KV (inyectado), para poder testear la lógica con un KV falso en memoria.

const ONE_DAY_SECONDS = 24 * 60 * 60;

/**
 * @typedef {Object} RateLimitKV
 * @property {(key: string) => Promise<string | null>} get
 * @property {(key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>} put
 */

/** Clave estable por endpoint + IP + día (UTC), para que el contador se reinicie solo cada día. */
export function rateLimitKey(scope, ip, now = new Date()) {
	const day = now.toISOString().slice(0, 10);
	return `${scope}:${ip}:${day}`;
}

/**
 * Incrementa el contador de `scope` para `ip` y devuelve si la petición está permitida.
 * `limitPerDay` es el tope de peticiones por IP y día para ese scope (p. ej. "nucleo-chat" o "wiki-ask").
 * @param {RateLimitKV} kv
 * @param {string} scope
 * @param {string} ip
 * @param {number} limitPerDay
 */
export async function checkRateLimit(kv, scope, ip, limitPerDay) {
	const key = rateLimitKey(scope, ip);
	const current = Number((await kv.get(key)) ?? '0');
	if (current >= limitPerDay) {
		return { allowed: false, remaining: 0 };
	}
	await kv.put(key, String(current + 1), { expirationTtl: ONE_DAY_SECONDS });
	return { allowed: true, remaining: limitPerDay - current - 1 };
}

/** IP del cliente tal como la expone Cloudflare en cada request. */
export function getClientIp(request) {
	return request.headers.get('CF-Connecting-IP') ?? 'unknown';
}
