import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkAll } from './i18n-check.mjs';

function makeProject() {
	return mkdtempSync(join(tmpdir(), 'escuela-ia-i18n-'));
}

function writeDoc(baseDir, relPath, frontmatter) {
	const full = join(baseDir, 'src', 'content', 'docs', relPath);
	mkdirSync(join(full, '..'), { recursive: true });
	const fm = Object.entries(frontmatter)
		.map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
		.join('\n');
	writeFileSync(full, `---\n${fm}\n---\ncontenido\n`);
}

test('par ES/EN completo y sincronizado no da errores', () => {
	const dir = makeProject();
	try {
		writeDoc(dir, 'a.md', { translationKey: 'a', sourceUpdated: '2026-07-01' });
		writeDoc(dir, 'en/a.md', { translationKey: 'a', sourceUpdated: '2026-07-01' });
		assert.deepEqual(checkAll(dir), []);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('huérfana ES sin EN falla', () => {
	const dir = makeProject();
	try {
		writeDoc(dir, 'a.md', { translationKey: 'a', sourceUpdated: '2026-07-01' });
		const errors = checkAll(dir);
		assert.equal(errors.length, 1);
		assert.match(errors[0], /huérfana ES sin EN/);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('huérfana EN sin ES falla', () => {
	const dir = makeProject();
	try {
		writeDoc(dir, 'en/a.md', { translationKey: 'a', sourceUpdated: '2026-07-01' });
		const errors = checkAll(dir);
		assert.equal(errors.length, 1);
		assert.match(errors[0], /huérfana EN sin ES/);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('clave duplicada falla', () => {
	const dir = makeProject();
	try {
		writeDoc(dir, 'a.md', { translationKey: 'dup', sourceUpdated: '2026-07-01' });
		writeDoc(dir, 'b.md', { translationKey: 'dup', sourceUpdated: '2026-07-01' });
		writeDoc(dir, 'en/a.md', { translationKey: 'dup', sourceUpdated: '2026-07-01' });
		const errors = checkAll(dir);
		assert.ok(errors.some((e) => /clave duplicada/.test(e)));
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('EN desactualizada sin ack falla', () => {
	const dir = makeProject();
	try {
		writeDoc(dir, 'a.md', { translationKey: 'a', sourceUpdated: '2026-07-02' });
		writeDoc(dir, 'en/a.md', { translationKey: 'a', sourceUpdated: '2026-06-01' });
		const errors = checkAll(dir);
		assert.equal(errors.length, 1);
		assert.match(errors[0], /desactualizada/);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('EN desactualizada CON translationOutdated:true pasa', () => {
	const dir = makeProject();
	try {
		writeDoc(dir, 'a.md', { translationKey: 'a', sourceUpdated: '2026-07-02' });
		writeDoc(dir, 'en/a.md', {
			translationKey: 'a',
			sourceUpdated: '2026-06-01',
			translationOutdated: true,
		});
		assert.deepEqual(checkAll(dir), []);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

// Dirección inversa (habitual en `news`: la fuente suele ser un feed en inglés, ES es la
// traducción). Sin este chequeo bidireccional, un ES desactualizado pasaba desapercibido en
// silencio — encontrado al generar la primera noticia real en E5.

test('ES desactualizada sin ack falla', () => {
	const dir = makeProject();
	try {
		writeDoc(dir, 'en/a.md', { translationKey: 'a', sourceUpdated: '2026-07-02' });
		writeDoc(dir, 'a.md', { translationKey: 'a', sourceUpdated: '2026-06-01' });
		const errors = checkAll(dir);
		assert.equal(errors.length, 1);
		assert.match(errors[0], /desactualizada/);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('ES desactualizada CON translationOutdated:true pasa', () => {
	const dir = makeProject();
	try {
		writeDoc(dir, 'en/a.md', { translationKey: 'a', sourceUpdated: '2026-07-02' });
		writeDoc(dir, 'a.md', {
			translationKey: 'a',
			sourceUpdated: '2026-06-01',
			translationOutdated: true,
		});
		assert.deepEqual(checkAll(dir), []);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('frontmatter sin translationKey falla', () => {
	const dir = makeProject();
	try {
		writeDoc(dir, 'a.md', { sourceUpdated: '2026-07-01' });
		const errors = checkAll(dir);
		assert.match(errors[0], /falta translationKey/);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});
