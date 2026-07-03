import { getCollection } from 'astro:content';

/** Basado en translationKey, la página en `docs` o `blog` en el otro idioma (o undefined si no existe). */

const BLOG_BASE: Record<'es' | 'en', string> = { es: '/comparte', en: '/en/share' };

export async function findCounterpartHref(
	translationKey: string,
	targetLang: 'es' | 'en',
): Promise<string | undefined> {
	const docs = await getCollection('docs');
	const docMatch = docs.find((doc) => {
		const lang = doc.id.startsWith('en/') ? 'en' : 'es';
		return lang === targetLang && doc.data.translationKey === translationKey;
	});
	if (docMatch) return `/${docMatch.id}/`.replace(/\/+/g, '/');

	const blog = await getCollection('blog');
	const blogMatch = blog.find(
		(entry) => entry.data.lang === targetLang && entry.data.translationKey === translationKey,
	);
	if (blogMatch) {
		const slug = blogMatch.id.replace(/^(es|en)\//, '');
		return `${BLOG_BASE[targetLang]}/${slug}/`;
	}

	return undefined;
}
