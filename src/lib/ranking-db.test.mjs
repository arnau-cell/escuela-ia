import { test } from 'node:test';
import assert from 'node:assert/strict';
import { incrementNucleoRecs, getToolStats, getToolScoreMap } from './ranking-db.js';

/** D1 falso mínimo: registra qué ids se han "incrementado", vía .batch(). */
function fakeD1() {
	const incremented = [];
	return {
		incremented,
		prepare(_sql) {
			const stmt = {
				_id: undefined,
				bind(id) {
					return { ...stmt, _id: id };
				},
			};
			return stmt;
		},
		async batch(statements) {
			for (const s of statements) incremented.push(s._id);
			return statements.map(() => ({ success: true }));
		},
	};
}

/** D1 falso mínimo para lecturas: `.prepare(sql).all()` devuelve las filas dadas. */
function fakeD1WithRows(rows) {
	return {
		prepare(_sql) {
			return { all: async () => ({ results: rows }) };
		},
	};
}

test('incrementa cada id una vez en un solo batch', async () => {
	const db = fakeD1();
	await incrementNucleoRecs(db, ['ollama', 'chatgpt']);
	assert.deepEqual(db.incremented.sort(), ['chatgpt', 'ollama']);
});

test('deduplica ids repetidos antes de escribir', async () => {
	const db = fakeD1();
	await incrementNucleoRecs(db, ['ollama', 'ollama', 'chatgpt']);
	assert.deepEqual(db.incremented.sort(), ['chatgpt', 'ollama']);
});

test('lista vacía no llama a batch', async () => {
	let batchCalled = false;
	const db = {
		prepare: () => ({ bind: () => ({}) }),
		batch: async () => {
			batchCalled = true;
			return [];
		},
	};
	await incrementNucleoRecs(db, []);
	assert.equal(batchCalled, false);
});

test('getToolStats incluye toda herramienta del catálogo aunque no tenga fila en D1', async () => {
	const db = fakeD1WithRows([{ tool_id: 'ollama', votes: 3, nucleo_recs: 2, editorial_score: 0 }]);
	const platforms = [{ id: 'ollama' }, { id: 'jan' }];
	const stats = await getToolStats(db, platforms);
	assert.deepEqual(
		stats.find((s) => s.id === 'jan'),
		{ id: 'jan', votes: 0, nucleoRecs: 0, editorialScore: 0, score: 0 },
	);
});

test('getToolStats calcula el score con la misma fórmula que ranking-score.js', async () => {
	const db = fakeD1WithRows([{ tool_id: 'ollama', votes: 3, nucleo_recs: 2, editorial_score: 1 }]);
	const stats = await getToolStats(db, [{ id: 'ollama' }]);
	assert.equal(stats[0].score, 3 + 0.5 * 2 + 2 * 1);
});

test('getToolScoreMap devuelve un Map id -> score', async () => {
	const db = fakeD1WithRows([{ tool_id: 'ollama', votes: 5, nucleo_recs: 0, editorial_score: 0 }]);
	const scoresById = await getToolScoreMap(db, [{ id: 'ollama' }, { id: 'jan' }]);
	assert.equal(scoresById.get('ollama'), 5);
	assert.equal(scoresById.get('jan'), 0);
});
