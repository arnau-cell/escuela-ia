// Voto anónimo "¿te resulta útil?" de una herramienta de la Wiki (RANKING-WIKI R1). Bajo demanda
// (no prerenderizado) — mismo patrón de los otros endpoints /api/**. Sin sistema de identidad:
// dedup por HMAC(IP, salt secreto) + TTL 30 días en KV (reutiliza el namespace RATE_LIMIT ya
// existente, con un prefijo de clave distinto al del límite diario — no hace falta un KV nuevo).
export const prerender = false;

import type { APIContext } from 'astro';
import { z } from 'zod';
import { env } from 'cloudflare:workers';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit.js';
import { hashIp } from '../../../lib/vote-hash.js';
import { hasVoted, markVoted, isValidToolId } from '../../../lib/vote-dedup.js';
import platforms from '../../../data/setup/platforms.json';

const DAILY_LIMIT = 20;

const RequestSchema = z.object({
	toolId: z.string().min(1),
	locale: z.enum(['es', 'en']).default('es'),
});

const ERRORS = {
	es: {
		badRequest: 'Petición inválida.',
		invalidTool: 'Herramienta desconocida.',
		alreadyVoted: 'Ya has votado por esta herramienta en los últimos 30 días.',
		rateLimited: 'Límite diario de votos alcanzado. Vuelve mañana.',
		serverError: 'No se pudo registrar el voto. Inténtalo de nuevo en un momento.',
	},
	en: {
		badRequest: 'Invalid request.',
		invalidTool: 'Unknown tool.',
		alreadyVoted: "You've already voted for this tool in the last 30 days.",
		rateLimited: 'Daily vote limit reached. Come back tomorrow.',
		serverError: 'Could not register the vote. Try again in a moment.',
	},
};

function jsonError(message: string, status: number) {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { 'content-type': 'application/json' },
	});
}

export async function POST(context: APIContext) {
	const { request } = context;
	let locale: 'es' | 'en' = 'es';

	try {
		const body = RequestSchema.parse(await request.json());
		locale = body.locale;
		const t = ERRORS[locale];

		if (!isValidToolId(platforms, body.toolId)) {
			return jsonError(t.invalidTool, 400);
		}

		const ip = getClientIp(request);
		const ipHash = await hashIp(env.VOTE_SALT, ip);

		if (await hasVoted(env.RATE_LIMIT, ipHash, body.toolId)) {
			return jsonError(t.alreadyVoted, 409);
		}

		const rateLimit = await checkRateLimit(env.RATE_LIMIT, 'wiki-vote', ip, DAILY_LIMIT);
		if (!rateLimit.allowed) {
			return jsonError(t.rateLimited, 429);
		}

		const row = await env.RANKING_DB.prepare(
			`INSERT INTO tool_stats (tool_id, votes, updated_at) VALUES (?1, 1, datetime('now'))
			 ON CONFLICT(tool_id) DO UPDATE SET votes = votes + 1, updated_at = datetime('now')
			 RETURNING votes`,
		)
			.bind(body.toolId)
			.first<{ votes: number }>();

		if (!row) {
			throw new Error('D1 no devolvió el contador de votos actualizado.');
		}

		// Solo se marca el dedup si el voto se registró con éxito — un fallo de D1 no debe dejar al
		// visitante bloqueado 30 días sin haber votado de verdad.
		await markVoted(env.RATE_LIMIT, ipHash, body.toolId);

		return new Response(JSON.stringify({ votes: row.votes }), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		const t = ERRORS[locale];
		const isBadRequest = error instanceof z.ZodError;
		console.error('[api/wiki/vote]', error);
		return jsonError(isBadRequest ? t.badRequest : t.serverError, isBadRequest ? 400 : 500);
	}
}
