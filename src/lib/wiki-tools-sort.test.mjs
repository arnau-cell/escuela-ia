import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortToolsByScore } from './wiki-tools-sort.js';

test('ordena por score descendente', () => {
	const items = [
		{ id: 'a', name: 'Alpha' },
		{ id: 'b', name: 'Beta' },
	];
	const scoreById = new Map([
		['a', { score: 1 }],
		['b', { score: 5 }],
	]);
	assert.deepEqual(sortToolsByScore(items, scoreById), ['b', 'a']);
});

test('desempata alfabéticamente por nombre cuando el score empata', () => {
	const items = [
		{ id: 'z', name: 'Zulu' },
		{ id: 'a', name: 'Alpha' },
	];
	const scoreById = new Map([
		['z', { score: 3 }],
		['a', { score: 3 }],
	]);
	assert.deepEqual(sortToolsByScore(items, scoreById), ['a', 'z']);
});

test('herramientas sin entrada en scoreById cuentan como score 0', () => {
	const items = [
		{ id: 'a', name: 'Alpha' },
		{ id: 'b', name: 'Beta' },
	];
	const scoreById = new Map([['b', { score: 2 }]]);
	assert.deepEqual(sortToolsByScore(items, scoreById), ['b', 'a']);
});

test('no muta el array original', () => {
	const items = [
		{ id: 'a', name: 'Alpha' },
		{ id: 'b', name: 'Beta' },
	];
	const original = items.slice();
	sortToolsByScore(items, new Map());
	assert.deepEqual(items, original);
});
