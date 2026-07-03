// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// Secciones cuyo slug en español NO debe aparecer bajo el prefijo /en/ — Starlight genera ahí
// una página de fallback sin traducir para cada contenido que no reconoce como "traducido" (usa
// slugs traducidos vía translationKey, no slugs espejo, ver src/components/Head.astro). Esas
// páginas fantasma siguen existiendo en dist/ (documentado desde E1) pero no deben indexarse.
const GHOST_EN_SECTIONS = ['aprende', 'hazlo', 'comparte', 'noticias', 'por-sector', 'recursos'];
/** @param {string} page */
const isGhostRoute = (page) => GHOST_EN_SECTIONS.some((section) => page.includes(`/en/${section}/`) || page.endsWith(`/en/${section}`));

// https://astro.build/config
export default defineConfig({
	// Subdominio provisional de Cloudflare Pages; actualizar al dominio definitivo antes de lanzar.
	site: 'https://escuela-ia.pages.dev',
	integrations: [
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
