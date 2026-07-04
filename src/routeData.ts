// Sidebar propia por locale, construida desde la collection `docs` real (nunca desde las
// rutas fantasma de fallback que Starlight sintetiza para slugs traducidos sin par exacto).
// Ver decisión D1 en _privado/protocolo/prompts/E1-constructor.md.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getCollection } from 'astro:content';

const GROUPS = [
	{ key: 'aprende', es: 'Aprende', en: 'Learn' },
	{ key: 'hazlo', es: 'Hazlo', en: 'Build' },
	{ key: 'por-sector', es: 'Por sector', en: 'By industry' },
	{ key: 'noticias', es: 'Noticias', en: 'News' },
	{ key: 'comparte', es: 'Comparte', en: 'Share' },
	{ key: 'recursos', es: 'Recursos', en: 'Resources' },
];

export const onRequest = defineRouteMiddleware(async (context) => {
	const { locale, id: currentId } = context.locals.starlightRoute;
	const lang = locale === 'en' ? 'en' : 'es';

	const allDocs = await getCollection('docs');
	const currentLocaleDocs = allDocs.filter((entry) => {
		const isEn = entry.id.startsWith('en/');
		return lang === 'en' ? isEn : !isEn;
	});

	const sidebar = GROUPS.map(({ key, es, en }) => {
		const entries = currentLocaleDocs
			.filter((entry) => entry.data.translationKey.startsWith(`${key}/`))
			.filter((entry) => !entry.data.draft)
			.sort((a, b) => {
				const orderA = a.data.sidebar?.order ?? 99;
				const orderB = b.data.sidebar?.order ?? 99;
				if (orderA !== orderB) return orderA - orderB;
				return a.data.title.localeCompare(b.data.title);
			})
			.map((entry) => ({
				type: 'link' as const,
				label: entry.data.title,
				href: `/${entry.id}/`.replace(/\/+/g, '/'),
				isCurrent: entry.id === currentId,
				badge: undefined,
				attrs: {},
			}));

		return {
			type: 'group' as const,
			label: lang === 'en' ? en : es,
			entries,
			collapsed: false,
			badge: undefined,
		};
	}).filter((group) => group.entries.length > 0);

	context.locals.starlightRoute.sidebar = sidebar;
});
