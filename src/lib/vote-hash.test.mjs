import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashIp } from './vote-hash.js';

test('misma IP y mismo salt: mismo hash', async () => {
	const a = await hashIp('salt-de-prueba', '1.2.3.4');
	const b = await hashIp('salt-de-prueba', '1.2.3.4');
	assert.equal(a, b);
});

test('IPs distintas dan hashes distintos', async () => {
	const a = await hashIp('salt-de-prueba', '1.2.3.4');
	const b = await hashIp('salt-de-prueba', '5.6.7.8');
	assert.notEqual(a, b);
});

test('salts distintos dan hashes distintos para la misma IP', async () => {
	const a = await hashIp('salt-uno', '1.2.3.4');
	const b = await hashIp('salt-dos', '1.2.3.4');
	assert.notEqual(a, b);
});

test('nunca devuelve la IP en claro', async () => {
	const hash = await hashIp('salt-de-prueba', '1.2.3.4');
	assert.ok(!hash.includes('1.2.3.4'));
	assert.match(hash, /^[0-9a-f]{64}$/);
});
