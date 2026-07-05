import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildSystemPrompt } from './system-prompt.js';

const here = dirname(fileURLToPath(import.meta.url));
const platforms = JSON.parse(readFileSync(join(here, '..', 'setup', 'platforms.json'), 'utf8'));

test('el prompt embebe el id de cada plataforma real del catálogo (evita quedarse desactualizado)', () => {
	const prompt = buildSystemPrompt(platforms, 'es');
	for (const platform of platforms) {
		assert.ok(prompt.includes(`"${platform.id}"`), `falta el id "${platform.id}" en el prompt`);
	}
});

test('instruye a no inventar herramientas fuera del catálogo', () => {
	const prompt = buildSystemPrompt(platforms, 'es');
	assert.match(prompt, /nunca inventes/i);
});

test('instruye a mencionar la alternativa gratuita/open-source cuando exista', () => {
	const prompt = buildSystemPrompt(platforms, 'es');
	assert.match(prompt, /alternativa gratuita/i);
});

test('genera el prompt en inglés cuando el locale es "en"', () => {
	const prompt = buildSystemPrompt(platforms, 'en');
	assert.match(prompt, /Easy AI core advisor/);
	assert.doesNotMatch(prompt, /asesor del núcleo/);
});

test('cae a español si el locale no es reconocido', () => {
	const prompt = buildSystemPrompt(platforms, 'fr');
	assert.match(prompt, /asesor del núcleo/);
});
