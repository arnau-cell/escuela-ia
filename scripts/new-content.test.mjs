import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generate, generateBatch } from './new-content.mjs';
import { checkAll } from './i18n-check.mjs';

function makeProject() {
	return mkdtempSync(join(tmpdir(), 'escuela-ia-newcontent-'));
}

test('genera par docs que pasa i18n-check', () => {
	const dir = makeProject();
	try {
		generate('docs', {
			es: 'aprende/prueba',
			en: 'learn/test',
			titleEs: 'Prueba',
			titleEn: 'Test',
			sourceUpdated: '2026-07-02',
			baseDir: dir,
		});
		assert.ok(existsSync(join(dir, 'src/content/docs/aprende/prueba.md')));
		assert.ok(existsSync(join(dir, 'src/content/docs/en/learn/test.md')));
		assert.deepEqual(checkAll(dir), []);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('no sobrescribe un archivo existente', () => {
	const dir = makeProject();
	try {
		generate('docs', {
			es: 'a',
			en: 'a',
			titleEs: 'A',
			titleEn: 'A',
			sourceUpdated: '2026-07-02',
			baseDir: dir,
		});
		assert.throws(() =>
			generate('docs', {
				es: 'a',
				en: 'a',
				titleEs: 'A2',
				titleEn: 'A2',
				sourceUpdated: '2026-07-02',
				baseDir: dir,
			}),
		);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('dry-run no escribe nada', () => {
	const dir = makeProject();
	try {
		generate('docs', {
			es: 'a',
			en: 'a',
			titleEs: 'A',
			titleEn: 'A',
			sourceUpdated: '2026-07-02',
			baseDir: dir,
			dryRun: true,
		});
		assert.ok(!existsSync(join(dir, 'src/content/docs/a.md')));
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('batch genera varios pares válidos', () => {
	const dir = makeProject();
	try {
		generateBatch(
			[
				{ type: 'docs', es: 'x', en: 'x', titleEs: 'X', titleEn: 'X', sourceUpdated: '2026-07-02' },
				{ type: 'docs', es: 'y', en: 'y', titleEs: 'Y', titleEn: 'Y', sourceUpdated: '2026-07-02' },
			],
			{ baseDir: dir },
		);
		assert.deepEqual(checkAll(dir), []);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('news genera par con lang correcto', () => {
	const dir = makeProject();
	try {
		generate('news', {
			es: '2026-07-02-ejemplo',
			en: '2026-07-02-example',
			titleEs: 'Ejemplo',
			titleEn: 'Example',
			lab: 'openai',
			sourceUpdated: '2026-07-02',
			baseDir: dir,
		});
		assert.ok(existsSync(join(dir, 'src/content/news/es/2026-07-02-ejemplo.md')));
		assert.ok(existsSync(join(dir, 'src/content/news/en/2026-07-02-example.md')));
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});
