#!/usr/bin/env node
// Genera SIEMPRE un par ES+EN con translationKey compartido. Nunca crear contenido a mano.
//
// Uso:
//   node scripts/new-content.mjs docs --es aprende/x --en learn/x --title-es "X" --title-en "X" [--dry-run]
//   node scripts/new-content.mjs news --es 2026-07-02-x --en 2026-07-02-x --title-es "X" --title-en "X" --lab openai [--dry-run]
//   node scripts/new-content.mjs blog --es reviews/x --en reviews/x --title-es "X" --title-en "X" --category reviews [--dry-run]
//   node scripts/new-content.mjs --batch scripts/tree-f1.json [--dry-run]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

function parseArgs(argv) {
	const args = { _: [] };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a.startsWith('--')) {
			const key = a.slice(2);
			const next = argv[i + 1];
			if (next === undefined || next.startsWith('--')) {
				args[key] = true;
			} else {
				args[key] = next;
				i++;
			}
		} else {
			args._.push(a);
		}
	}
	return args;
}

function todayIso() {
	// Sin Date.now()/new Date() argless por convención de reproducibilidad de scripts;
	// aquí SÍ es apropiado (CLI interactiva, no un workflow determinista) — se permite `new Date()`.
	return new Date().toISOString().slice(0, 10);
}

function docsFrontmatter({ title, translationKey, sourceUpdated, order }) {
	const lines = [
		'---',
		`title: "${title}"`,
		`description: "Página en preparación."`,
		`translationKey: ${translationKey}`,
		`sourceUpdated: ${sourceUpdated}`,
	];
	if (order !== undefined) lines.push('sidebar:', `  order: ${order}`);
	lines.push('---', '', '> 🚧 **Página en construcción.** La estructura ya es definitiva; el contenido llega en la siguiente fase.', '');
	return lines.join('\n');
}

function docsFrontmatterEn({ title, translationKey, sourceUpdated, order }) {
	const lines = [
		'---',
		`title: "${title}"`,
		`description: "Page in preparation."`,
		`translationKey: ${translationKey}`,
		`sourceUpdated: ${sourceUpdated}`,
	];
	if (order !== undefined) lines.push('sidebar:', `  order: ${order}`);
	lines.push('---', '', '> 🚧 **Page under construction.** The structure is final; content lands in the next phase.', '');
	return lines.join('\n');
}

function newsFrontmatter({ title, translationKey, sourceUpdated, lab, lang, sourceUrl }) {
	return [
		'---',
		`title: "${title}"`,
		`description: "Resumen en preparación."`,
		`translationKey: ${translationKey}`,
		`sourceUpdated: ${sourceUpdated}`,
		`publishedAt: ${sourceUpdated}`,
		`sourceUrl: "${sourceUrl ?? 'https://example.com'}"`,
		`lab: ${lab ?? 'otros'}`,
		'trending: false',
		'reviewed: false',
		`lang: ${lang}`,
		'---',
		'',
	].join('\n');
}

function blogFrontmatter({ title, translationKey, sourceUpdated, category, lang }) {
	return [
		'---',
		`title: "${title}"`,
		`description: "Entrada en preparación."`,
		`translationKey: ${translationKey}`,
		`sourceUpdated: ${sourceUpdated}`,
		`publishedAt: ${sourceUpdated}`,
		`category: ${category ?? 'aprendizajes'}`,
		`lang: ${lang}`,
		'draft: true',
		'---',
		'',
	].join('\n');
}

function writeFile(path, content, dryRun) {
	if (existsSync(path)) {
		throw new Error(`ya existe, no se sobrescribe: ${path}`);
	}
	if (dryRun) {
		console.log(`[dry-run] escribiría ${path}:\n${content}\n`);
		return;
	}
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content, 'utf8');
	console.log(`creado: ${path}`);
}

function generateDocs({ es, en, titleEs, titleEn, order, sourceUpdated, dryRun, baseDir }) {
	const translationKey = es;
	const esPath = join(baseDir, 'src', 'content', 'docs', `${es}.md`);
	const enPath = join(baseDir, 'src', 'content', 'docs', 'en', `${en}.md`);
	writeFile(esPath, docsFrontmatter({ title: titleEs, translationKey, sourceUpdated, order }), dryRun);
	writeFile(enPath, docsFrontmatterEn({ title: titleEn, translationKey, sourceUpdated, order }), dryRun);
}

function generateNews({ es, en, titleEs, titleEn, lab, sourceUrl, sourceUpdated, dryRun, baseDir }) {
	const translationKey = es;
	const esPath = join(baseDir, 'src', 'content', 'news', 'es', `${es}.md`);
	const enPath = join(baseDir, 'src', 'content', 'news', 'en', `${en}.md`);
	writeFile(esPath, newsFrontmatter({ title: titleEs, translationKey, sourceUpdated, lab, lang: 'es', sourceUrl }), dryRun);
	writeFile(enPath, newsFrontmatter({ title: titleEn, translationKey, sourceUpdated, lab, lang: 'en', sourceUrl }), dryRun);
}

function generateBlog({ es, en, titleEs, titleEn, category, sourceUpdated, dryRun, baseDir }) {
	const translationKey = es;
	const esPath = join(baseDir, 'src', 'content', 'blog', 'es', `${es}.md`);
	const enPath = join(baseDir, 'src', 'content', 'blog', 'en', `${en}.md`);
	writeFile(esPath, blogFrontmatter({ title: titleEs, translationKey, sourceUpdated, category, lang: 'es' }), dryRun);
	writeFile(enPath, blogFrontmatter({ title: titleEn, translationKey, sourceUpdated, category, lang: 'en' }), dryRun);
}

const GENERATORS = { docs: generateDocs, news: generateNews, blog: generateBlog };

export function generate(type, opts) {
	const fn = GENERATORS[type];
	if (!fn) throw new Error(`tipo desconocido: ${type} (usa docs | news | blog)`);
	if (!opts.es || !opts.en || !opts.titleEs || !opts.titleEn) {
		throw new Error('faltan --es, --en, --title-es o --title-en');
	}
	fn({ ...opts, sourceUpdated: opts.sourceUpdated ?? todayIso() });
}

export function generateBatch(items, { dryRun, baseDir } = {}) {
	for (const item of items) {
		const { type, ...rest } = item;
		generate(type, { ...rest, dryRun, baseDir: baseDir ?? process.cwd() });
	}
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const dryRun = args['dry-run'] === true;
	const baseDir = process.cwd();

	if (args.batch) {
		const items = JSON.parse(readFileSync(args.batch, 'utf8'));
		generateBatch(items, { dryRun, baseDir });
		return;
	}

	const type = args._[0];
	generate(type, {
		es: args.es,
		en: args.en,
		titleEs: args['title-es'],
		titleEn: args['title-en'],
		lab: args.lab,
		category: args.category,
		sourceUrl: args['source-url'],
		order: args.order ? Number(args.order) : undefined,
		dryRun,
		baseDir,
	});
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('new-content.mjs')) {
	main();
}
