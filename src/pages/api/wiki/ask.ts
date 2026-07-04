// Preguntas sobre la Wiki de la IA. Bajo demanda (no prerenderizado) — mismo backend que
// /api/nucleo/chat (Claude Haiku 4.5 + límite de uso), reutilizando el contenido real de la Wiki
// como contexto en vez de una base vectorial (sobra para el volumen actual de contenido).
export const prerender = false;

import type { APIContext } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { env } from 'cloudflare:workers';
import { getCollection } from 'astro:content';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit.js';
import { buildWikiContext } from '../../../data/wiki-ia/context.js';

const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 1024;
const DAILY_LIMIT = 30;

const RequestSchema = z.object({
	question: z.string().min(1).max(1000),
	locale: z.enum(['es', 'en']).default('es'),
});

const ERRORS = {
	es: {
		badRequest: 'Petición inválida.',
		rateLimited: 'Límite diario de preguntas alcanzado. Vuelve mañana.',
		serverError: 'No se pudo generar la respuesta. Inténtalo de nuevo en un momento.',
	},
	en: {
		badRequest: 'Invalid request.',
		rateLimited: 'Daily question limit reached. Come back tomorrow.',
		serverError: 'Could not generate a response. Try again in a moment.',
	},
};

export async function POST(context: APIContext) {
	const { request } = context;
	let locale: 'es' | 'en' = 'es';

	try {
		const body = RequestSchema.parse(await request.json());
		locale = body.locale;
		const t = ERRORS[locale];

		const ip = getClientIp(request);
		const rateLimit = await checkRateLimit(env.RATE_LIMIT, 'wiki-ask', ip, DAILY_LIMIT);
		if (!rateLimit.allowed) {
			return new Response(JSON.stringify({ error: t.rateLimited }), {
				status: 429,
				headers: { 'content-type': 'application/json' },
			});
		}

		if (!env.ANTHROPIC_API_KEY) {
			throw new Error('ANTHROPIC_API_KEY no está configurada (ver .env.local / wrangler secret).');
		}

		const docs = await getCollection('docs');
		const system = buildWikiContext(docs, locale);

		const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
		const response = await client.messages.create({
			model: MODEL,
			max_tokens: MAX_TOKENS,
			system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
			messages: [{ role: 'user', content: body.question }],
		});

		const textBlock = response.content.find((b) => b.type === 'text');
		if (!textBlock) {
			throw new Error('El modelo no devolvió una respuesta de texto.');
		}

		return new Response(JSON.stringify({ answer: textBlock.text }), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		const t = ERRORS[locale];
		const isBadRequest = error instanceof z.ZodError;
		console.error('[api/wiki/ask]', error);
		return new Response(JSON.stringify({ error: isBadRequest ? t.badRequest : t.serverError }), {
			status: isBadRequest ? 400 : 500,
			headers: { 'content-type': 'application/json' },
		});
	}
}
