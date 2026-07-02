// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	// Subdominio provisional de Cloudflare Pages; actualizar al dominio definitivo antes de lanzar.
	site: 'https://escuela-ia.pages.dev',
	integrations: [
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
			},
		}),
	],
});
