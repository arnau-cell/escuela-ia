// Lectura/escritura en D1 de las señales del ranking (RANKING-WIKI R1/R2). Aislado de los
// endpoints y de chat.ts para que la query viva en un solo sitio, igual que ranking-score.js
// aísla la fórmula.

import { computeScore } from './ranking-score.js';

/**
 * Lee los agregados reales de D1 y devuelve, para cada herramienta del catálogo, sus contadores
 * + el score calculado — toda herramienta aparece aunque no tenga fila en D1 todavía (0 en todo).
 * Usado tanto por GET /api/wiki/ranking (necesita el desglose completo) como por el prompt del
 * núcleo (solo necesita el score, ver getToolScoreMap).
 * @param {import('@cloudflare/workers-types').D1Database} db
 * @param {{ id: string }[]} platforms
 */
export async function getToolStats(db, platforms) {
	const { results } = await db
		.prepare('SELECT tool_id, votes, nucleo_recs, editorial_score FROM tool_stats')
		.all();
	const statsById = new Map(results.map((row) => [row.tool_id, row]));

	return platforms.map((p) => {
		const row = statsById.get(p.id);
		const votes = row?.votes ?? 0;
		const nucleoRecs = row?.nucleo_recs ?? 0;
		const editorialScore = row?.editorial_score ?? 0;
		return {
			id: p.id,
			votes,
			nucleoRecs,
			editorialScore,
			score: computeScore({ votes, nucleoRecs, editorialScore }),
		};
	});
}

/**
 * Mismo dato que getToolStats pero como Map id → score, la única forma que necesita el prompt
 * del núcleo (RANKING-WIKI R2).
 * @param {import('@cloudflare/workers-types').D1Database} db
 * @param {{ id: string }[]} platforms
 */
export async function getToolScoreMap(db, platforms) {
	const stats = await getToolStats(db, platforms);
	return new Map(stats.map((s) => [s.id, s.score]));
}

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
