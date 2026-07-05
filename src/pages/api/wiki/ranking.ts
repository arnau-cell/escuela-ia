// Ranking agregado de herramientas (RANKING-WIKI R1). Bajo demanda, pero cacheado en el borde
// (s-maxage=300) porque los agregados no necesitan frescura al segundo — el frontend de
// WikiToolsList lo pide en cliente y degrada a orden alfabético si esto falla.
export const prerender = false;

import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';
import { FORMULA_VERSION } from '../../../lib/ranking-score.js';
import { getToolStats } from '../../../lib/ranking-db.js';
import platforms from '../../../data/setup/platforms.json';

export async function GET(_context: APIContext) {
	try {
		// Toda herramienta del catálogo aparece, aunque no tenga fila en D1 todavía (0 votos) — el
		// frontend necesita el conjunto completo para reordenar cada categoría.
		const tools = await getToolStats(env.RANKING_DB, platforms);

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
