import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeScore, WEIGHTS, FORMULA_VERSION } from './ranking-score.js';

test('score = solo votos cuando no hay recs del núcleo ni puntuación editorial', () => {
	assert.equal(computeScore({ votes: 7, nucleoRecs: 0, editorialScore: 0 }), 7);
});

test('score aplica el peso de las recomendaciones del núcleo', () => {
	assert.equal(computeScore({ votes: 0, nucleoRecs: 4, editorialScore: 0 }), 4 * WEIGHTS.nucleoRecs);
});

test('score aplica el peso de la puntuación editorial', () => {
	assert.equal(computeScore({ votes: 0, nucleoRecs: 0, editorialScore: 3 }), 3 * WEIGHTS.editorialScore);
});

test('score combina las tres señales', () => {
	const score = computeScore({ votes: 10, nucleoRecs: 6, editorialScore: 2 });
	assert.equal(score, 10 + 0.5 * 6 + 2 * 2);
});

test('formulaVersion está declarada y es estable', () => {
	assert.equal(FORMULA_VERSION, 'r1-2026-07-05');
});
