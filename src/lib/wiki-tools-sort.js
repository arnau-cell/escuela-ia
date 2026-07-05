// Orden de las tarjetas de WikiToolsList por score, con desempate alfabético (RANKING-WIKI R1).
// Aislado del componente (que solo hace la mutación del DOM) para poder testear la lógica de
// orden sin un navegador real.

/**
 * @param {{ id: string, name: string }[]} items
 * @param {Map<string, { score: number }>} scoreById
 * @returns {string[]} ids en el orden final
 */
export function sortToolsByScore(items, scoreById) {
	return items
		.slice()
		.sort((a, b) => {
			const scoreA = scoreById.get(a.id)?.score ?? 0;
			const scoreB = scoreById.get(b.id)?.score ?? 0;
			if (scoreB !== scoreA) return scoreB - scoreA;
			return a.name.localeCompare(b.name);
		})
		.map((item) => item.id);
}
