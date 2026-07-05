// Ranking agregado de herramientas (RANKING-WIKI R1). Bajo demanda, pero cacheado en el borde
// (s-maxage=300) porque los agregados no necesitan frescura al segundo — el frontend de
// WikiToolsList lo pide en cliente y degrada a orden alfabético si esto falla.
export const prerender = false;

import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';
import { computeScore, FORMULA_VERSION } from '../../../lib/ranking-score.js';
import platforms from '../../../data/setup/platforms.json';

interface ToolStatsRow {
	tool_id: string;
	votes: number;
	nucleo_recs: number;
	editorial_score: number;
}

export async function GET(_context: APIContext) {
	try {
		const { results } = await env.RANKING_DB.prepare(
			'SELECT tool_id, votes, nucleo_recs, editorial_score FROM tool_stats',
		).all<ToolStatsRow>();

		const statsById = new Map(results.map((row) => [row.tool_id, row]));

		// Toda herramienta del catálogo aparece, aunque no tenga fila en D1 todavía (0 votos) — el
		// frontend necesita el conjunto completo para reordenar cada categoría.
		const tools = platforms.map((p) => {
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

		return new Response(JSON.stringify({ tools, formulaVersion: FORMULA_VERSION }), {
			status: 200,
			headers: {
				'content-type': 'application/json',
				'cache-control': 'public, s-maxage=300',
			},
		});
	} catch (error) {
		console.error('[api/wiki/ranking]', error);
		return new Response(JSON.stringify({ error: 'No se pudo obtener el ranking.' }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
}
