import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/** Campos i18n comunes a todo el contenido (docs, news, blog). */
const i18nFields = z.object({
	translationKey: z.string().min(1),
	sourceUpdated: z.coerce.date(),
	translationOutdated: z.boolean().default(false),
	lastVerified: z.coerce.date().optional(),
});

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		// `draft` es solo de docs (no de i18nFields compartido): oculta del sidebar los stubs
		// "🚧 en construcción" generados por scripts/new-content.mjs para secciones fuera del
		// alcance de v1 (ver routeData.ts) sin dejar de compilarlos si alguien tiene el enlace directo.
		schema: docsSchema({ extend: i18nFields.extend({ draft: z.boolean().default(false) }) }),
	}),
	news: defineCollection({
		loader: glob({ base: './src/content/news', pattern: '**/*.md' }),
		schema: i18nFields.extend({
			title: z.string(),
			description: z.string(),
			publishedAt: z.coerce.date(),
			sourceUrl: z.string().url(),
			lab: z.enum(['openai', 'anthropic', 'google', 'meta', 'mistral', 'huggingface', 'otros']),
			trending: z.boolean().default(false),
			reviewed: z.boolean().default(false),
			lang: z.enum(['es', 'en']),
		}),
	}),
	blog: defineCollection({
		loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
		schema: i18nFields.extend({
			title: z.string(),
			description: z.string(),
			publishedAt: z.coerce.date(),
			category: z.enum(['reviews', 'como-lo-hice', 'aprendizajes']),
			author: z.string().default('Arnau'),
			lang: z.enum(['es', 'en']),
			draft: z.boolean().default(false),
		}),
	}),
};
