// Construye el prompt de sistema para las preguntas de la Wiki de la IA a partir del contenido
// real ya publicado (sin base vectorial: el volumen de contenido actual no la necesita — empezar
// simple). Función pura (docs + idioma → texto), testable sin astro:content real.

const INSTRUCTIONS = {
	es: `Eres el asistente de preguntas de la Wiki de la IA de Easy AI. Respondes solo con la
información del contenido que se te da abajo — si la pregunta no está cubierta por ese contenido,
dilo honestamente en vez de inventar una respuesta.

Explica siempre de la forma más simple posible primero, y solo añade matices técnicos si hacen
falta para responder bien — como el resto del sitio, que va de lo más básico a lo más técnico por
niveles. No des por sabido ningún término sin explicarlo brevemente la primera vez que aparece.

Contenido de la Wiki disponible:`,
	en: `You are the AI Wiki question assistant for Easy AI. You answer only using the content given
below — if the question isn't covered by that content, say so honestly instead of making up an
answer.

Always explain in the simplest possible way first, and only add technical nuance if needed to
answer well — like the rest of the site, which goes from most basic to most technical by levels.
Never assume a term is known without briefly explaining it the first time it appears.

Available Wiki content:`,
};

/**
 * @param {Array<{ id: string, data: { translationKey: string, title: string }, body?: string }>} docs
 * @param {'es' | 'en'} locale
 */
export function buildWikiContext(docs, locale = 'es') {
	const instructions = INSTRUCTIONS[locale] ?? INSTRUCTIONS.es;

	const entries = docs.filter((doc) => {
		const isEn = doc.id.startsWith('en/');
		const docLocale = isEn ? 'en' : 'es';
		return docLocale === locale && doc.data.translationKey.startsWith('wiki-ia/');
	});

	const content = entries
		.map((entry) => `## ${entry.data.title}\n${entry.body ?? ''}`.trim())
		.join('\n\n');

	return `${instructions}\n\n${content}`;
}
