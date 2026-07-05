import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasVoted, markVoted, voteDedupKey, isValidToolId } from './vote-dedup.js';

/** KV falso en memoria, misma interfaz mínima que el binding real de Cloudflare. */
function fakeKv(initial = {}) {
	const store = new Map(Object.entries(initial));
	return {
		async get(key) {
			return store.has(key) ? store.get(key) : null;
		},
		async put(key, value) {
			store.set(key, value);
		},
		store,
	};
}

test('hasVoted es false antes de marcar', async () => {
	const kv = fakeKv();
	assert.equal(await hasVoted(kv, 'hashA', 'ollama'), false);
});

test('markVoted hace que hasVoted pase a true', async () => {
	const kv = fakeKv();
	await markVoted(kv, 'hashA', 'ollama');
	assert.equal(await hasVoted(kv, 'hashA', 'ollama'), true);
});

test('el dedup es por hash de IP + herramienta, no global', async () => {
	const kv = fakeKv();
	await markVoted(kv, 'hashA', 'ollama');
	assert.equal(await hasVoted(kv, 'hashA', 'jan'), false, 'misma IP, otra herramienta: no votado');
	assert.equal(await hasVoted(kv, 'hashB', 'ollama'), false, 'otra IP, misma herramienta: no votado');
});

test('voteDedupKey es estable y prefijada con "vote:"', () => {
	assert.equal(voteDedupKey('hashA', 'ollama'), 'vote:hashA:ollama');
});

test('isValidToolId acepta solo ids presentes en el catálogo', () => {
	const platforms = [{ id: 'ollama' }, { id: 'jan' }];
	assert.equal(isValidToolId(platforms, 'ollama'), true);
	assert.equal(isValidToolId(platforms, 'herramienta-inventada'), false);
});
