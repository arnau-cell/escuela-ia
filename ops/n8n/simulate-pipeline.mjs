#!/usr/bin/env node
// Simulación local de la lógica del pipeline de noticias (mismo diseño que
// pipeline-noticias.workflow.json), para poder probarla de verdad sin acceso al VPS/n8n.
// Uso: node ops/n8n/simulate-pipeline.mjs --lab huggingface --url https://huggingface.co/blog/feed.xml --dry-run
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TRENDING_KEYWORDS = ['GPT-', 'Claude ', 'Gemini ', 'Llama '];

function parseArgs(argv) {
	const args = {};
	for (let i = 0; i < argv.length; i++) {
		if (argv[i].startsWith('--')) {
			const key = argv[i].slice(2);
			const next = argv[i + 1];
			args[key] = next && !next.startsWith('--') ? next : true;
		}
	}
	return args;
}

function stripCdataAndTags(html) {
	return html
		.replace(/^<!\[CDATA\[/, '')
		.replace(/\]\]>$/, '')
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#39;/g, "'")
		.replace(/&quot;/g, '"')
		.trim();
}

/** Parser mínimo de items RSS 2.0 (sin dependencia externa; el formato de <item> es muy regular). */
export function parseRssItems(xml) {
	const items = [];
	const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
	for (const block of itemBlocks) {
		const get = (tag) => {
			const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
			return m ? stripCdataAndTags(m[1]) : '';
		};
		items.push({
			title: get('title'),
			link: get('link'),
			description: get('description') || get('content:encoded'),
			pubDate: get('pubDate'),
		});
	}
	return items;
}

/** Trunca a ~280 caracteres respetando fin de frase. Resumen extractivo, sin IA. */
export function extractiveSummary(text, max = 280) {
	if (text.length <= max) return text;
	const cut = text.slice(0, max);
	const lastPeriod = cut.lastIndexOf('. ');
	return (lastPeriod > 100 ? cut.slice(0, lastPeriod + 1) : cut) + '…';
}

export function classifyTrending(title) {
	return TRENDING_KEYWORDS.some((kw) => title.includes(kw));
}

export function slugFor(link, pubDate) {
	const date = pubDate ? new Date(pubDate) : new Date();
	const dateStr = Number.isNaN(date.valueOf()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
	const hash = createHash('sha256').update(link).digest('hex').slice(0, 8);
	return `${dateStr}-${hash}`;
}

function yamlEscape(value) {
	return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function buildFrontmatter({ title, description, translationKey, sourceUpdated, publishedAt, sourceUrl, lab, trending, lang, translationOutdated }) {
	const lines = [
		'---',
		`title: "${yamlEscape(title)}"`,
		`description: "${yamlEscape(description)}"`,
		`translationKey: ${translationKey}`,
		`sourceUpdated: ${sourceUpdated}`,
		`publishedAt: ${publishedAt}`,
		`sourceUrl: "${yamlEscape(sourceUrl)}"`,
		`lab: ${lab}`,
		`trending: ${trending}`,
		'reviewed: false',
		`lang: ${lang}`,
	];
	if (translationOutdated) lines.push('translationOutdated: true');
	lines.push('---', '');
	return lines.join('\n');
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (!args.lab || !args.url) {
		console.error('Uso: node ops/n8n/simulate-pipeline.mjs --lab <lab> --url <rss-url> [--dry-run] [--base-dir <dir>]');
		process.exit(1);
	}

	const res = await fetch(args.url);
	if (!res.ok) throw new Error(`No se pudo leer el feed: ${res.status} ${res.statusText}`);
	const xml = await res.text();
	const items = parseRssItems(xml);
	if (items.length === 0) throw new Error('El feed no devolvió items (¿cambió el formato?)');

	const item = items[0]; // "probar con un solo feed" -> tomamos el más reciente de ese feed
	const slug = slugFor(item.link, item.pubDate);
	const trending = classifyTrending(item.title);
	const descriptionEn = extractiveSummary(item.description || item.title);
	const today = new Date().toISOString().slice(0, 10);

	console.log(`Feed: ${args.lab} (${args.url})`);
	console.log(`Item más reciente: "${item.title}"`);
	console.log(`Link: ${item.link}`);
	console.log(`Slug generado: ${slug}`);
	console.log(`Destacada (trending): ${trending}`);
	console.log(`Resumen extractivo: ${descriptionEn}`);

	const baseDir = args['base-dir'] ?? process.cwd();
	const enPath = join(baseDir, 'src', 'content', 'news', 'en', `${slug}.md`);
	const esPath = join(baseDir, 'src', 'content', 'news', 'es', `${slug}.md`);

	const enContent = buildFrontmatter({
		title: item.title,
		description: descriptionEn,
		translationKey: slug,
		sourceUpdated: today,
		publishedAt: today,
		sourceUrl: item.link,
		lab: args.lab,
		trending,
		lang: 'en',
	});
	// Sin servicio de traducción configurado en esta simulación: ES cae al fallback documentado
	// (mismo texto + translationOutdated: true) -- la revisión humana del PR lo pule.
	const esContent = buildFrontmatter({
		title: item.title,
		description: descriptionEn,
		translationKey: slug,
		sourceUpdated: today,
		publishedAt: today,
		sourceUrl: item.link,
		lab: args.lab,
		trending,
		lang: 'es',
		translationOutdated: true,
	});

	if (args['dry-run']) {
		console.log('\n--- [dry-run] EN ---\n' + enContent);
		console.log('\n--- [dry-run] ES ---\n' + esContent);
		return;
	}

	if (existsSync(enPath) || existsSync(esPath)) {
		console.log(`Ya existe un archivo para "${slug}" — dedup funcionando, no se sobrescribe.`);
		return;
	}
	mkdirSync(join(baseDir, 'src', 'content', 'news', 'en'), { recursive: true });
	mkdirSync(join(baseDir, 'src', 'content', 'news', 'es'), { recursive: true });
	writeFileSync(enPath, enContent, 'utf8');
	writeFileSync(esPath, esContent, 'utf8');
	console.log(`\nCreados:\n  ${enPath}\n  ${esPath}`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('simulate-pipeline.mjs')) {
	main().catch((err) => {
		console.error(err.message);
		process.exit(1);
	});
}
