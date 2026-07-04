import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit, rateLimitKey, getClientIp } from './rate-limit.js';

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

test('primera petición del día: permitida, contador queda en 1', async () => {
	const kv = fakeKv();
	const result = await checkRateLimit(kv, 'nucleo-chat', '1.2.3.4', 20);
	assert.equal(result.allowed, true);
	assert.equal(result.remaining, 19);
	assert.equal(kv.store.get(rateLimitKey('nucleo-chat', '1.2.3.4')), '1');
});

test('bloquea al superar el tope diario', async () => {
	const key = rateLimitKey('nucleo-chat', '1.2.3.4');
	const kv = fakeKv({ [key]: '20' });
	const result = await checkRateLimit(kv, 'nucleo-chat', '1.2.3.4', 20);
	assert.equal(result.allowed, false);
	assert.equal(result.remaining, 0);
});

test('IPs distintas tienen contadores independientes', async () => {
	const kv = fakeKv();
	await checkRateLimit(kv, 'nucleo-chat', '1.1.1.1', 5);
	await checkRateLimit(kv, 'nucleo-chat', '1.1.1.1', 5);
	const otherIp = await checkRateLimit(kv, 'nucleo-chat', '2.2.2.2', 5);
	assert.equal(otherIp.allowed, true);
	assert.equal(otherIp.remaining, 4);
});

test('scopes distintos (núcleo vs. wiki) no comparten contador', async () => {
	const kv = fakeKv();
	await checkRateLimit(kv, 'nucleo-chat', '1.1.1.1', 5);
	const wikiResult = await checkRateLimit(kv, 'wiki-ask', '1.1.1.1', 5);
	assert.equal(wikiResult.allowed, true);
	assert.equal(wikiResult.remaining, 4);
});

test('getClientIp lee la cabecera CF-Connecting-IP', () => {
	const request = new Request('https://example.com', { headers: { 'CF-Connecting-IP': '9.9.9.9' } });
	assert.equal(getClientIp(request), '9.9.9.9');
});

test('getClientIp devuelve "unknown" sin la cabecera (ej. en local sin Cloudflare)', () => {
	const request = new Request('https://example.com');
	assert.equal(getClientIp(request), 'unknown');
});
