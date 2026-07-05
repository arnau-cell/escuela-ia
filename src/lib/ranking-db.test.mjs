import { test } from 'node:test';
import assert from 'node:assert/strict';
import { incrementNucleoRecs } from './ranking-db.js';

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
