#!/usr/bin/env node
// Genera src/data/wiki-ia/content.generated.json a partir del contenido real de wiki-ia/*
// (src/content/docs/wiki-ia/** y src/content/docs/en/wiki/**), leyendo los archivos
// directamente (mismo patrón que scripts/i18n-check.mjs) en vez de `astro:content`.
//
// Por qué existe: llamar a `getCollection('docs')` DENTRO de una ruta bajo demanda
// (`export const prerender = false`) falla en el runtime local de Cloudflare Workers
// (`_Miniflare.dispatchFetch` → "fetch failed", confirmado en desarrollo real con clave de
// Anthropic válida) y, más importante, en producción real de Cloudflare Workers no hay sistema
// de archivos en tiempo de petición — `astro:content` no es una opción dentro de src/pages/api/**.
// Se genera en build/dev (`npm run build` y `npm run dev` lo ejecutan antes) y
// src/pages/api/wiki/ask.ts importa el JSON ya generado, igual que hace con platforms.json.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { parse as parseYaml } from 'yaml';

const here = dirname(fileURLToPath(import.meta.url));
const docsRoot = join(here, '..', 'src', 'content', 'docs');
const outFile = join(here, '..', 'src', 'data', 'wiki-ia', 'content.generated.json');

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

function parseFile(file) {
	const text = readFileSync(file, 'utf8');
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
	if (!match) return null;
	const frontmatter = parseYaml(match[1]);
	const body = match[2]
		.split(/\r?\n/)
		.filter((line) => !/^import\s.+from\s.+;?$/.test(line.trim()))
		.filter((line) => !/^<\/?[A-Za-z][\w.]*(\s[^>]*)?\/?>$/.test(line.trim()))
		.join('\n')
		.trim();
	return { frontmatter, body };
}

const entries = [];
for (const file of walk(docsRoot)) {
	const rel = relative(docsRoot, file);
	// Solo nos interesa wiki-ia/* — filtramos por translationKey real (fuente de verdad), no por
	// carpeta, porque la carpeta EN se llama wiki/ (slug traducido), no wiki-ia/.
	const parsed = parseFile(file);
	if (!parsed || !parsed.frontmatter?.translationKey?.startsWith('wiki-ia/')) continue;

	const id = rel.replace(/\\/g, '/').replace(/\.(md|mdx)$/, '');
	entries.push({
		id,
		data: {
			translationKey: parsed.frontmatter.translationKey,
			title: parsed.frontmatter.title,
		},
		body: parsed.body,
	});
}

entries.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(outFile, JSON.stringify(entries, null, '\t') + '\n');
console.log(`generate-wiki-context: ${entries.length} entradas escritas en ${relative(join(here, '..'), outFile)}`);
