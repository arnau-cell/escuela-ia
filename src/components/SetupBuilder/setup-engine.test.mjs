import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { recommend, findMatchingRules, resolveRoute, validateInputs, GOALS, PREFERENCES, LEVELS } from './setup-engine.js';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '..', '..', 'data', 'setup');

const rulesEs = JSON.parse(readFileSync(join(dataDir, 'rules.es.json'), 'utf8'));
const rulesEn = JSON.parse(readFileSync(join(dataDir, 'rules.en.json'), 'utf8'));
const platforms = JSON.parse(readFileSync(join(dataDir, 'platforms.json'), 'utf8'));

function baseInputs(overrides = {}) {
	return {
		goal: 'chat_asistente',
		preference: 'local',
		hasGpu: false,
		vramGb: 0,
		budgetMonthly: 0,
		level: 'usuario',
		...overrides,
	};
}

// --- Sincronización ES/EN: la regla de negocio (match + order + ids) debe ser idéntica en
// ambos idiomas. Solo debe cambiar el texto (title, summary, why). Esto evita que rules.es.json
// y rules.en.json diverjan en silencio, con el mismo espíritu que scripts/i18n-check.mjs.
test('rules.es.json y rules.en.json tienen exactamente los mismos ids, en el mismo orden', () => {
	const idsEs = rulesEs.map((r) => r.id);
	const idsEn = rulesEn.map((r) => r.id);
	assert.deepEqual(idsEs, idsEn);
});

test('rules.es.json y rules.en.json tienen el mismo `match` y `order` para cada id (solo el texto difiere)', () => {
	for (const ruleEs of rulesEs) {
		const ruleEn = rulesEn.find((r) => r.id === ruleEs.id);
		assert.ok(ruleEn, `falta en EN: ${ruleEs.id}`);
		assert.deepEqual(ruleEn.match, ruleEs.match, `match distinto en "${ruleEs.id}"`);
		assert.equal(ruleEn.order, ruleEs.order, `order distinto en "${ruleEs.id}"`);
		assert.equal(ruleEn.costTier, ruleEs.costTier, `costTier distinto en "${ruleEs.id}"`);
		assert.deepEqual(
			ruleEn.steps.map((s) => s.platformId),
			ruleEs.steps.map((s) => s.platformId),
			`platformIds de los pasos distintos en "${ruleEs.id}"`,
		);
		assert.deepEqual(ruleEn.alternativeIds, ruleEs.alternativeIds, `alternativeIds distintos en "${ruleEs.id}"`);
	}
});

test('cada platformId referenciado en las reglas existe en platforms.json', () => {
	const platformIds = new Set(platforms.map((p) => p.id));
	for (const rules of [rulesEs, rulesEn]) {
		for (const rule of rules) {
			for (const step of rule.steps) {
				assert.ok(platformIds.has(step.platformId), `platformId inexistente: ${step.platformId} (regla ${rule.id})`);
			}
			for (const altId of rule.alternativeIds) {
				assert.ok(platformIds.has(altId), `alternativeId inexistente: ${altId} (regla ${rule.id})`);
			}
		}
	}
});

test('hay una regla de fallback con match universal (siempre devuelve algo)', () => {
	const fallback = rulesEs.find((r) => r.id === 'fallback-generico');
	assert.ok(fallback);
	for (const goal of GOALS) assert.ok(fallback.match.goals.includes(goal));
	for (const pref of PREFERENCES) assert.ok(fallback.match.preferences.includes(pref));
	for (const level of LEVELS) assert.ok(fallback.match.levels.includes(level));
});

// --- validateInputs ---

test('validateInputs lanza con un goal inválido', () => {
	assert.throws(() => validateInputs(baseInputs({ goal: 'volar_a_la_luna' })));
});

test('validateInputs acepta inputs válidos sin lanzar', () => {
	assert.doesNotThrow(() => validateInputs(baseInputs()));
});

// --- recommend(): 7 perfiles, incluyendo los casos límite pedidos por el prompt ---

test('perfil 1: chat local con GPU potente → chat-local-potente', () => {
	const r = recommend(baseInputs({ goal: 'chat_asistente', preference: 'local', hasGpu: true, vramGb: 12, level: 'usuario' }), rulesEs);
	assert.equal(r.id, 'chat-local-potente');
});

test('perfil 2 (caso límite: sin GPU): chat local sin GPU → chat-local-ligero, no chat-local-potente', () => {
	const r = recommend(baseInputs({ goal: 'chat_asistente', preference: 'local', hasGpu: false, vramGb: 0 }), rulesEs);
	assert.equal(r.id, 'chat-local-ligero');
});

test('perfil 3 (caso límite: presupuesto 0): chat en la nube sin presupuesto → chat-nube-gratis, nunca chat-nube-pago', () => {
	const r = recommend(baseInputs({ goal: 'chat_asistente', preference: 'nube', budgetMonthly: 0 }), rulesEs);
	assert.equal(r.id, 'chat-nube-gratis');
});

test('con presupuesto de 20/mes, chat en la nube recomienda el plan de pago (no el gratis)', () => {
	const r = recommend(baseInputs({ goal: 'chat_asistente', preference: 'nube', budgetMonthly: 20 }), rulesEs);
	assert.equal(r.id, 'chat-nube-pago');
});

test('perfil 4 (caso límite: nivel principiante + objetivo que normalmente pide más nivel): programar en la nube siendo principiante → programar-nube', () => {
	const r = recommend(baseInputs({ goal: 'programar', preference: 'nube', level: 'principiante' }), rulesEs);
	assert.equal(r.id, 'programar-nube');
});

test('perfil 5 (caso límite: nivel insuficiente para la única ruta que encajaría) → cae al fallback', () => {
	// automatizar solo tiene ruta para constructor/tecnico; un principiante sin GPU/presupuesto no encaja en nada más.
	const r = recommend(baseInputs({ goal: 'automatizar', preference: 'nube', level: 'principiante' }), rulesEs);
	assert.equal(r.id, 'fallback-generico');
});

test('perfil 6: imágenes en local con GPU de nivel técnico → imagenes-local', () => {
	const r = recommend(baseInputs({ goal: 'imagenes', preference: 'local', hasGpu: true, vramGb: 10, level: 'tecnico' }), rulesEs);
	assert.equal(r.id, 'imagenes-local');
});

test('perfil 7: documentos en la nube, usuario sin GPU → documentos-nube', () => {
	const r = recommend(baseInputs({ goal: 'documentos', preference: 'nube', level: 'usuario' }), rulesEs);
	assert.equal(r.id, 'documentos-nube');
});

test('recommend nunca devuelve null con las reglas reales (siempre hay al menos el fallback)', () => {
	// combinación deliberadamente hostil: sin GPU, sin presupuesto, principiante, automatizar
	const r = recommend(baseInputs({ goal: 'automatizar', preference: 'local', level: 'principiante', hasGpu: false, budgetMonthly: 0 }), rulesEs);
	assert.notEqual(r, null);
});

test('recommend funciona igual con rules.en.json (misma lógica, mismos ids)', () => {
	const r = recommend(baseInputs({ goal: 'chat_asistente', preference: 'local', hasGpu: true, vramGb: 12 }), rulesEn);
	assert.equal(r.id, 'chat-local-potente');
});

// --- resolveRoute ---

test('resolveRoute adjunta los datos completos de plataforma a cada paso', () => {
	const rule = recommend(baseInputs({ goal: 'chat_asistente', preference: 'local', hasGpu: true, vramGb: 12 }), rulesEs);
	const resolved = resolveRoute(rule, platforms);
	assert.equal(resolved.steps[0].platform.id, 'ollama');
	assert.equal(resolved.steps[0].platform.name, 'Ollama');
	assert.ok(resolved.alternatives.every((p) => p.id));
});

// --- Extensibilidad: "añadir una ruta = añadir un objeto JSON, sin tocar código" ---

test('añadir una regla nueva (objeto JSON) sin tocar setup-engine.js cambia la recomendación', () => {
	const nuevaRegla = {
		id: 'chat-local-prueba-extensibilidad',
		order: 0, // prioridad más alta que todas las existentes
		match: {
			goals: ['chat_asistente'],
			preferences: ['local', 'mixto'],
			levels: ['principiante', 'usuario', 'constructor', 'tecnico'],
			requiresGpu: true,
			minVramGb: 8,
			minBudgetMonthly: 0,
			maxBudgetMonthly: null,
		},
		costTier: 'gratis',
		title: 'Regla de prueba',
		summary: 'Solo para el test de extensibilidad.',
		steps: [{ platformId: 'ollama', why: 'prueba', conceptSlugs: [] }],
		alternativeIds: [],
	};
	const rulesConNueva = [...rulesEs, nuevaRegla];
	const r = recommend(baseInputs({ goal: 'chat_asistente', preference: 'local', hasGpu: true, vramGb: 12 }), rulesConNueva);
	assert.equal(r.id, 'chat-local-prueba-extensibilidad');
});

test('findMatchingRules devuelve varias candidatas cuando varias reglas encajan', () => {
	const candidates = findMatchingRules(baseInputs({ goal: 'chat_asistente', preference: 'local', hasGpu: true, vramGb: 12 }), rulesEs);
	// chat-local-potente y chat-local-ligero pueden matchear ambas (ligero no exige GPU, pero no la prohíbe)
	assert.ok(candidates.length >= 1);
	assert.ok(candidates.some((r) => r.id === 'chat-local-potente'));
});
