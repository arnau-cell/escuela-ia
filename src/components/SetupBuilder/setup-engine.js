// Motor puro del configurador "Monta tu setup". Sin efectos secundarios, sin llamadas de
// red, sin IA en runtime — determinista por diseño (ver _privado/LEGAL.md §1.8 y
// _conocimiento/PLAN_MAESTRO.md). Añadir una ruta nueva = añadir un objeto a rules.es.json
// y rules.en.json, nunca tocar este archivo.

export const GOALS = ['chat_asistente', 'programar', 'imagenes', 'documentos', 'automatizar'];
export const PREFERENCES = ['local', 'nube', 'mixto'];
export const LEVELS = ['principiante', 'usuario', 'constructor', 'tecnico'];

/**
 * @typedef {Object} SetupInputs
 * @property {string} goal - uno de GOALS
 * @property {string} preference - uno de PREFERENCES
 * @property {boolean} hasGpu
 * @property {number} vramGb - 0 si hasGpu es false o se desconoce
 * @property {number} budgetMonthly - en USD/mes, 0 = solo gratis
 * @property {string} level - uno de LEVELS
 */

/** Valida que los inputs tengan valores dentro de los enums esperados. Lanza si no. */
export function validateInputs(inputs) {
	const errors = [];
	if (!GOALS.includes(inputs.goal)) errors.push(`goal inválido: ${inputs.goal}`);
	if (!PREFERENCES.includes(inputs.preference)) errors.push(`preference inválida: ${inputs.preference}`);
	if (!LEVELS.includes(inputs.level)) errors.push(`level inválido: ${inputs.level}`);
	if (typeof inputs.hasGpu !== 'boolean') errors.push('hasGpu debe ser boolean');
	if (typeof inputs.vramGb !== 'number' || inputs.vramGb < 0) errors.push('vramGb debe ser un número >= 0');
	if (typeof inputs.budgetMonthly !== 'number' || inputs.budgetMonthly < 0) errors.push('budgetMonthly debe ser un número >= 0');
	if (errors.length) throw new Error(`Inputs inválidos: ${errors.join('; ')}`);
}

function matchesRule(inputs, match) {
	if (!match.goals.includes(inputs.goal)) return false;
	if (!match.preferences.includes(inputs.preference)) return false;
	if (!match.levels.includes(inputs.level)) return false;
	if (match.requiresGpu && !inputs.hasGpu) return false;
	if (match.minVramGb != null && inputs.vramGb < match.minVramGb) return false;
	if (inputs.budgetMonthly < match.minBudgetMonthly) return false;
	if (match.maxBudgetMonthly != null && inputs.budgetMonthly > match.maxBudgetMonthly) return false;
	return true;
}

/** Devuelve todas las reglas cuyo `match` satisfacen los inputs, sin ordenar. */
export function findMatchingRules(inputs, rules) {
	return rules.filter((rule) => matchesRule(inputs, rule.match));
}

/**
 * Función pura principal: inputs + reglas → la mejor regla (menor `order` entre las que
 * matchean). Devuelve `null` solo si ninguna regla matchea (no debería pasar si `rules`
 * incluye la regla de fallback con match universal).
 */
export function recommend(inputs, rules) {
	validateInputs(inputs);
	const candidates = findMatchingRules(inputs, rules).sort((a, b) => a.order - b.order);
	return candidates[0] ?? null;
}

/** Adjunta los datos completos de plataforma (nombre, url, coste...) a los pasos y alternativas de una regla. */
export function resolveRoute(rule, platforms) {
	if (!rule) return null;
	const byId = new Map(platforms.map((p) => [p.id, p]));
	return {
		...rule,
		steps: rule.steps.map((step) => ({ ...step, platform: byId.get(step.platformId) ?? null })),
		alternatives: rule.alternativeIds.map((id) => byId.get(id)).filter(Boolean),
	};
}
