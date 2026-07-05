// Fórmula del ranking de herramientas (RANKING-WIKI, ver
// _conocimiento/investigacion/04_futurepedia-y-ranking-herramientas.md §4). Módulo puro para que
// la fórmula viva en un único sitio (GET /api/wiki/ranking la usa, no la duplica) y sea testeable
// sin D1. Los pesos y esta versión se publican tal cual en la página "Cómo funciona el ranking".

export const FORMULA_VERSION = 'r1-2026-07-05';

export const WEIGHTS = {
	nucleoRecs: 0.5,
	editorialScore: 2,
};

/**
 * @param {{ votes: number, nucleoRecs: number, editorialScore: number }} stats
 */
export function computeScore({ votes, nucleoRecs, editorialScore }) {
	return votes + WEIGHTS.nucleoRecs * nucleoRecs + WEIGHTS.editorialScore * editorialScore;
}
