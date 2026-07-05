// Dedup del voto anónimo sobre KV (RANKING-WIKI R1): 1 voto por IP seudonimizada y herramienta
// cada 30 días. Separado en check/mark (en vez de un solo incremento como rate-limit.js) porque
// el voto solo debe marcarse como emitido si D1 confirmó el incremento — un fallo de D1 no debe
// dejar a alguien bloqueado 30 días sin haber votado de verdad.
//
// Carrera conocida y aceptada (reserva 2 del veredicto de auditoría de R1, RANKING-CIERRE
// 2026-07-05): hasVoted() y markVoted() no son atómicos entre sí. Dos peticiones simultáneas de
// la misma IP para la misma herramienta pueden pasar ambas el hasVoted() antes de que cualquiera
// llame a markVoted(), contando 2 votos en vez de 1. Es aceptable a propósito: este dedup es un
// tope de abuso/coste, no un sistema de contabilidad exacta. No lo trates como un bug a arreglar
// sin releer esta nota primero.

const VOTE_DEDUP_TTL_SECONDS = 30 * 24 * 60 * 60;

/** @param {string} ipHash @param {string} toolId */
export function voteDedupKey(ipHash, toolId) {
	return `vote:${ipHash}:${toolId}`;
}

/**
 * @param {import('./rate-limit.js').RateLimitKV} kv
 * @param {string} ipHash
 * @param {string} toolId
 */
export async function hasVoted(kv, ipHash, toolId) {
	return (await kv.get(voteDedupKey(ipHash, toolId))) !== null;
}

/**
 * @param {import('./rate-limit.js').RateLimitKV} kv
 * @param {string} ipHash
 * @param {string} toolId
 */
export async function markVoted(kv, ipHash, toolId) {
	await kv.put(voteDedupKey(ipHash, toolId), '1', { expirationTtl: VOTE_DEDUP_TTL_SECONDS });
}

/**
 * @param {{ id: string }[]} platforms
 * @param {string} toolId
 */
export function isValidToolId(platforms, toolId) {
	return platforms.some((p) => p.id === toolId);
}
