// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Secciones cuyo slug en español NO debe aparecer bajo el prefijo /en/ — Starlight genera ahí
// una página de fallback sin traducir para CUALQUIER contenido que no reconoce como "traducido"
// (usa slugs traducidos vía translationKey, no slugs espejo — ver
// node_modules/@astrojs/starlight/utils/routing/index.ts, función getRoutes(), sin config de
// usuario para desactivarlo). Esas páginas fantasma no solo ensucian el sitemap (ya filtrado
// abajo) sino también la paginación Previous/Next (arreglada en src/routeData.ts, que la calcula
// desde el sidebar real en vez de confiar en la de Starlight) y el índice de Pagefind, que indexa
// TODO `dist/` sin exclusión configurable (ver integrations/pagefind.ts: `index.addDirectory`).
// Detalle completo del hallazgo: _privado/auditorias/E7-veredicto.md.
const GHOST_EN_SECTIONS = ['aprende', 'hazlo', 'wiki-ia', 'comparte', 'noticias', 'por-sector', 'recursos'];
/** @param {string} page */
const isGhostRoute = (page) => GHOST_EN_SECTIONS.some((section) => page.includes(`/en/${section}/`) || page.endsWith(`/en/${section}`));

/**
 * Borra físicamente las carpetas fantasma de dist/en/ ANTES de que Pagefind las indexe.
 * Debe ir ANTES de starlight() en el array de integrations: Astro ejecuta los hooks
 * `astro:build:done` en el orden del array, y el propio Starlight documenta que respeta ese
 * orden al insertar sus integraciones internas justo después de sí mismo (ver
 * node_modules/@astrojs/starlight/index.ts, comentario sobre `config.integrations.splice`).
 */
const cleanGhostFallbackRoutes = {
	name: 'clean-ghost-fallback-routes',
	hooks: {
		/** @param {{dir: URL, logger: import('astro').AstroIntegrationLogger}} params */
		'astro:build:done': ({ dir, logger }) => {
			const distPath = fileURLToPath(dir);
			let removed = 0;
			for (const section of GHOST_EN_SECTIONS) {
				const ghostPath = join(distPath, 'en', section);
				if (existsSync(ghostPath)) {
					rmSync(ghostPath, { recursive: true, force: true });
					removed++;
				}
			}
			logger.info(`Eliminadas ${removed} carpeta(s) fantasma de dist/en/ antes de indexar con Pagefind.`);
		},
	},
};

// https://astro.build/config
export default defineConfig({
	// Subdominio provisional de Cloudflare Workers (arnau-cell.workers.dev, registrado 2026-07-03);
	// actualizar al dominio definitivo antes de lanzar.
	site: 'https://escuela-ia.arnau-cell.workers.dev',
	// `output: 'static'` (por defecto, no se declara) + adapter: el sitio sigue prerenderizado por
	// completo salvo las rutas que declaren explícitamente `export const prerender = false`
	// (el núcleo conversacional y las preguntas de la Wiki de la IA, pivote 2026-07-04) — cero
	// riesgo de convertir en SSR las 83 páginas Starlight ya construidas y auditadas.
	adapter: cloudflare(),
	integrations: [
		// PRIMERO en la lista: su astro:build:done debe correr antes que el de starlight() (que hace
		// el indexado de Pagefind), para borrar las carpetas fantasma antes de que se escaneen.
		cleanGhostFallbackRoutes,
		// Declarado explícitamente (en vez de dejar que Starlight añada el suyo) para poder pasarle
		// `filter` y excluir las rutas fantasma de arriba — Starlight solo añade su propio sitemap
		// si detecta que el usuario no declaró ya uno (ver integrations/sitemap.ts en su código fuente).
		sitemap({ filter: (page) => !isGhostRoute(page) }),
		starlight({
			title: { es: 'Escuela de la IA', en: 'AI School' },
			description: 'Entiende la IA de cero a técnico. Gratis, neutral, bilingüe. / Understand AI from zero to technical. Free, neutral, bilingual.',
			defaultLocale: 'root',
			locales: {
				root: { label: 'Español', lang: 'es' },
				en: { label: 'English', lang: 'en' },
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/arnau-cell/escuela-ia' }],
			editLink: { baseUrl: 'https://github.com/arnau-cell/escuela-ia/edit/master/' },
			customCss: ['./src/styles/custom.css'],
			// Sidebar propia por locale (construida desde translationKey, no autogenerate) —
			// evita que las rutas fantasma de fallback de Starlight ensucien el menú. Ver src/routeData.ts.
			routeMiddleware: './src/routeData.ts',
			// Overrides de i18n con slugs traducidos (translationKey propio, ver scripts/i18n-check.mjs).
			components: {
				LanguageSelect: './src/components/LanguageSelect.astro',
				PageTitle: './src/components/PageTitle.astro',
				Footer: './src/components/Footer.astro',
				Head: './src/components/Head.astro',
			},
		}),
	],
});
