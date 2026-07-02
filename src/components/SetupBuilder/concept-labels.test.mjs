import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveConceptLink } from './concept-labels.js';

const conceptMap = {
	'que-es-un-agente-de-ia': {
		es: { href: '/aprende/conceptos/que-es-un-agente-de-ia/', title: '¿Qué es un agente de IA?' },
		en: { href: '/en/learn/concepts/what-is-an-ai-agent/', title: 'What is an AI agent?' },
	},
	'solo-es': {
		es: { href: '/aprende/conceptos/solo-es/', title: 'Título solo en español' },
	},
};

// --- Regresión del bug real: rules.en.json usa el slug canónico ES (comparte translationKey
// con el par ES), así que el texto visible en la página EN debe ser el título EN real del
// concepto, nunca el slug crudo con guiones cambiados por espacios. ---

test('en locale "en", usando un conceptSlug en español, devuelve el título y href en inglés (no el slug crudo)', () => {
	const link = resolveConceptLink('que-es-un-agente-de-ia', 'en', conceptMap);
	assert.equal(link.label, 'What is an AI agent?');
	assert.equal(link.href, '/en/learn/concepts/what-is-an-ai-agent/');
	assert.doesNotMatch(link.label, /que es un agente/i, 'no debe caer al slug con guiones-a-espacios cuando SÍ hay traducción');
});

test('en locale "es", devuelve el título y href en español', () => {
	const link = resolveConceptLink('que-es-un-agente-de-ia', 'es', conceptMap);
	assert.equal(link.label, '¿Qué es un agente de IA?');
	assert.equal(link.href, '/aprende/conceptos/que-es-un-agente-de-ia/');
});

test('fallback defensivo: si falta la entrada del idioma pedido, usa el href disponible con una etiqueta legible (no rompe)', () => {
	const link = resolveConceptLink('solo-es', 'en', conceptMap);
	assert.ok(link, 'no debe devolver null si existe al menos un idioma');
	assert.equal(link.href, '/aprende/conceptos/solo-es/');
	assert.equal(link.label, 'solo es'); // fallback legible, no crudo con guiones
});

test('devuelve null si el slug no existe en el mapa en absoluto', () => {
	const link = resolveConceptLink('slug-inventado-que-no-existe', 'es', conceptMap);
	assert.equal(link, null);
});

test('sanity: todos los conceptSlugs referenciados en rules.es.json / rules.en.json existen como concepto real en ambos idiomas', async () => {
	const { readFileSync, readdirSync } = await import('node:fs');
	const { fileURLToPath } = await import('node:url');
	const { dirname, join } = await import('node:path');
	const { parse: parseYaml } = await import('yaml');

	const here = dirname(fileURLToPath(import.meta.url));
	const dataDir = join(here, '..', '..', 'data', 'setup');
	const rulesEs = JSON.parse(readFileSync(join(dataDir, 'rules.es.json'), 'utf8'));
	const rulesEn = JSON.parse(readFileSync(join(dataDir, 'rules.en.json'), 'utf8'));

	const usedSlugs = new Set();
	for (const rules of [rulesEs, rulesEn]) {
		for (const rule of rules) {
			for (const step of rule.steps) {
				for (const slug of step.conceptSlugs) usedSlugs.add(slug);
			}
		}
	}

	function frontmatterTranslationKeys(dir) {
		const keys = new Set();
		function walk(d) {
			for (const name of readdirSync(d, { withFileTypes: true })) {
				const p = join(d, name.name);
				if (name.isDirectory()) walk(p);
				else if (/\.mdx?$/.test(name.name)) {
					const text = readFileSync(p, 'utf8');
					const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
					if (match) {
						const fm = parseYaml(match[1]);
						if (fm.translationKey) keys.add(fm.translationKey);
					}
				}
			}
		}
		walk(dir);
		return keys;
	}

	const conceptosDir = join(here, '..', '..', 'content', 'docs', 'aprende', 'conceptos');
	const realKeys = frontmatterTranslationKeys(conceptosDir);

	for (const slug of usedSlugs) {
		const key = `aprende/conceptos/${slug}`;
		assert.ok(realKeys.has(key), `conceptSlug "${slug}" usado en una regla no corresponde a ningún concepto real (translationKey "${key}")`);
	}
});
