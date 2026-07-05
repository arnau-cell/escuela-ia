// Escritura en D1 de las señales del ranking que no vienen del voto directo (RANKING-WIKI R2
// mínimo): recomendaciones del núcleo. Aislado de chat.ts para que la query UPSERT viva en un
// solo sitio, igual que ranking-score.js aísla la fórmula.

/**
 * Incrementa `nucleo_recs` para cada id (una vez por id, aunque se repita en la lista) en un solo
 * batch atómico de D1.
 * @param {import('@cloudflare/workers-types').D1Database} db
 * @param {string[]} toolIds
 */
export async function incrementNucleoRecs(db, toolIds) {
	const uniqueIds = [...new Set(toolIds)];
	if (uniqueIds.length === 0) return;

	const stmt = db.prepare(
		`INSERT INTO tool_stats (tool_id, nucleo_recs, updated_at) VALUES (?1, 1, datetime('now'))
		 ON CONFLICT(tool_id) DO UPDATE SET nucleo_recs = nucleo_recs + 1, updated_at = datetime('now')`,
	);
	await db.batch(uniqueIds.map((id) => stmt.bind(id)));
}
