// Seudonimización de la IP para el dedup del voto anónimo (RANKING-WIKI R1): HMAC-SHA256 con un
// salt secreto de Worker (VOTE_SALT), nunca la IP en claro. Usa Web Crypto (SubtleCrypto),
// disponible tanto en el runtime de Workers como en Node >= 20 — sin dependencias nuevas.

/**
 * @param {string} salt
 * @param {string} ip
 * @returns {Promise<string>} hex de 64 caracteres (SHA-256)
 */
export async function hashIp(salt, ip) {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(salt),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);
	const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip));
	return Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
