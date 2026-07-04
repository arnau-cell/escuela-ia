import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWikiContext } from './context.js';

function fakeDoc(id, translationKey, title, body) {
	return { id, data: { translationKey, title }, body };
}

const DOCS = [
	fakeDoc('wiki-ia/conceptos/que-es-un-sandbox', 'wiki-ia/conceptos/que-es-un-sandbox', '¿Qué es un sandbox?', 'Un sandbox es un espacio aislado.'),
	fakeDoc('en/wiki/concepts/what-is-a-sandbox', 'wiki-ia/conceptos/que-es-un-sandbox', 'What is a sandbox?', 'A sandbox is an isolated space.'),
	fakeDoc('aprende/conceptos/que-es-un-modelo', 'aprende/conceptos/que-es-un-modelo', '¿Qué es un modelo?', 'No debería aparecer en el contexto de la Wiki.'),
];

test('incluye solo entradas de wiki-ia en el idioma pedido', () => {
	const context = buildWikiContext(DOCS, 'es');
	assert.match(context, /sandbox es un espacio aislado/);
	assert.doesNotMatch(context, /isolated space/);
	assert.doesNotMatch(context, /No debería aparecer/);
});

test('cambia de idioma correctamente', () => {
	const context = buildWikiContext(DOCS, 'en');
	assert.match(context, /isolated space/);
	assert.doesNotMatch(context, /espacio aislado/);
});

test('instruye a no inventar si la pregunta no está cubierta', () => {
	const context = buildWikiContext(DOCS, 'es');
	assert.match(context, /dilo honestamente/i);
});

test('instruye a explicar de lo más básico a lo más técnico', () => {
	const context = buildWikiContext(DOCS, 'es');
	assert.match(context, /más básico a lo más técnico/i);
});

test('con lista de docs vacía, sigue devolviendo las instrucciones sin romper', () => {
	const context = buildWikiContext([], 'es');
	assert.match(context, /asistente de preguntas/i);
});
