// Endpoint del núcleo conversacional de Easy AI. Bajo demanda (no prerenderizado) — el resto del
// sitio sigue estático. Sin IA en tiempo real en el resto de páginas; solo aquí y en
// /api/wiki/ask, con reevaluación del AI Act hecha (ver _privado/LEGAL.md §1.8) y aviso de
// transparencia visible en el frontend antes de activar en producción.
export const prerender = false;

import type { APIContext } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { env } from 'cloudflare:workers';
import { buildSystemPrompt } from '../../../data/nucleo/system-prompt.js';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit.js';
import { incrementNucleoRecs } from '../../../lib/ranking-db.js';
import platforms from '../../../data/setup/platforms.json';

const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 1536;
const DAILY_LIMIT = 30;

const TurnSchema = z.object({
	reply: z.string(),
	planItem: z.string().nullable(),
	conceptCallout: z.object({ tag: z.string(), text: z.string() }).nullable(),
	done: z.boolean(),
	masterPrompt: z.string().nullable(),
	platformIds: z.array(z.string()),
});

const MessageSchema = z.object({
	role: z.enum(['user', 'assistant']),
	content: z.string(),
});

const RequestSchema = z.object({
	messages: z.array(MessageSchema).min(1).max(40),
	locale: z.enum(['es', 'en']).default('es'),
});

const ERRORS = {
	es: {
		badRequest: 'Petición inválida.',
		rateLimited: 'Límite diario de mensajes alcanzado. Vuelve mañana.',
		serverError: 'No se pudo generar la respuesta. Inténtalo de nuevo en un momento.',
	},
	en: {
		badRequest: 'Invalid request.',
		rateLimited: 'Daily message limit reached. Come back tomorrow.',
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
		const rateLimit = await checkRateLimit(env.RATE_LIMIT, 'nucleo-chat', ip, DAILY_LIMIT);
		if (!rateLimit.allowed) {
			return new Response(JSON.stringify({ error: t.rateLimited }), {
				status: 429,
				headers: { 'content-type': 'application/json' },
			});
		}

		if (!env.ANTHROPIC_API_KEY) {
			throw new Error('ANTHROPIC_API_KEY no está configurada (ver .env.local / wrangler secret).');
		}

		const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
		const system = buildSystemPrompt(platforms, locale);

		const response = await client.messages.parse({
			model: MODEL,
			max_tokens: MAX_TOKENS,
			system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
			messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
			output_config: { format: zodOutputFormat(TurnSchema) },
		});

		const parsed = response.parsed_output;
		if (!parsed) {
			throw new Error('El modelo no devolvió una salida estructurada válida.');
		}

		// Nunca confiar ciegamente en los ids que devuelve el modelo: se resuelven contra el
		// catálogo real y se descartan los que no existan — garantía de neutralidad en código,
		// no solo en el prompt.
		const byId = new Map(platforms.map((p) => [p.id, p]));
		const resolvedPlatforms = parsed.platformIds
			.map((id) => byId.get(id))
			.filter((p): p is NonNullable<typeof p> => p !== undefined);

		// Señal del ranking (RANKING-WIKI R2 mínimo): cada plan cerrado cuenta como una recomendación
		// real por herramienta, agregada sin ningún dato del usuario. Fire-and-forget vía waitUntil —
		// nunca debe retrasar ni poder romper la respuesta al usuario.
		if (parsed.done && resolvedPlatforms.length > 0) {
			context.locals.cfContext.waitUntil(
				incrementNucleoRecs(
					env.RANKING_DB,
					resolvedPlatforms.map((p) => p.id),
				).catch((error) => console.error('[api/nucleo/chat] incrementNucleoRecs', error)),
			);
		}

		return new Response(
			JSON.stringify({
				reply: parsed.reply,
				planItem: parsed.planItem,
				conceptCallout: parsed.conceptCallout,
				done: parsed.done,
				masterPrompt: parsed.masterPrompt,
				platforms: resolvedPlatforms,
			}),
			{ status: 200, headers: { 'content-type': 'application/json' } },
		);
	} catch (error) {
		const t = ERRORS[locale];
		const isBadRequest = error instanceof z.ZodError;
		console.error('[api/nucleo/chat]', error);
		return new Response(JSON.stringify({ error: isBadRequest ? t.badRequest : t.serverError }), {
			status: isBadRequest ? 400 : 500,
			headers: { 'content-type': 'application/json' },
		});
	}
}
