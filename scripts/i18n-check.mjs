#!/usr/bin/env node
// Empareja ES/EN por translationKey en docs/news/blog. Falla si hay: páginas huérfanas,
// claves duplicadas, frontmatter incompleto, o EN desactualizada sin `translationOutdated: true`.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parse as parseYaml } from 'yaml';

export const ROOTS = [
	{ name: 'docs', localeOf: (rel) => (rel.split(sep)[0] === 'en' ? 'en' : 'es') },
	{ name: 'news', localeOf: (rel) => rel.split(sep)[0] },
	{ name: 'blog', localeOf: (rel) => rel.split(sep)[0] },
];

function* walk(dir) {
	let entries;
	try {
		entries = readdirSync(dir);
	} catch {
		return;
	}
	for (const name of entries) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) yield* walk(p);
		else if (/\.(md|mdx)$/.test(name)) yield p;
	}
}

function frontmatter(file) {
	const text = readFileSync(file, 'utf8');
	const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
	return match ? parseYaml(match[1]) : null;
}

const iso = (d) => d.toISOString().slice(0, 10);

/** Revisa un root de contenido (dir absoluto). Devuelve array de strings de error. */
export function checkRoot(dir, localeOf, label) {
	const errors = [];
	const byKey = new Map();

	for (const file of walk(dir)) {
		const rel = relative(dir, file);
		const fm = frontmatter(file) ?? {};
		const loc = `${label}/${rel}`;

		if (!fm.translationKey) {
			errors.push(`${loc}: falta translationKey`);
			continue;
		}
		if (!fm.sourceUpdated) {
			errors.push(`${loc}: falta sourceUpdated`);
			continue;
		}

		const locale = localeOf(rel);
		const slot = byKey.get(fm.translationKey) ?? {};
		if (slot[locale]) {
			errors.push(
				`clave duplicada "${fm.translationKey}" en ${locale}: ${loc} y ${slot[locale].loc}`,
			);
		}
		slot[locale] = {
			loc,
			updated: new Date(fm.sourceUpdated),
			ack: fm.translationOutdated === true,
		};
		byKey.set(fm.translationKey, slot);
	}

	for (const [key, pair] of byKey) {
		if (!pair.en) {
			errors.push(`huérfana ES sin EN: "${key}" (${pair.es?.loc ?? '?'})`);
		} else if (!pair.es) {
			errors.push(`huérfana EN sin ES: "${key}" (${pair.en.loc})`);
		} else if (pair.en.updated < pair.es.updated && !pair.en.ack) {
			errors.push(
				`desactualizada: "${key}" — EN ${iso(pair.en.updated)} < ES ${iso(pair.es.updated)}. ` +
					`Traduce y actualiza sourceUpdated, o marca translationOutdated: true en la página EN.`,
			);
		}
	}

	return errors;
}

/** Revisa docs/news/blog bajo `<baseDir>/src/content/<root>`. Devuelve array de errores. */
export function checkAll(baseDir) {
	const errors = [];
	for (const { name, localeOf } of ROOTS) {
		const dir = join(baseDir, 'src', 'content', name);
		errors.push(...checkRoot(dir, localeOf, name));
	}
	return errors;
}

// Ejecución directa como CLI (node scripts/i18n-check.mjs)
if (process.argv[1]?.replace(/\\/g, '/').endsWith('i18n-check.mjs')) {
	const errors = checkAll(process.cwd());
	if (errors.length) {
		console.error(`i18n-check ❌ ${errors.length} problema(s):\n- ${errors.join('\n- ')}`);
		process.exit(1);
	}
	console.log('i18n-check ✅ todos los pares ES/EN en orden');
}
