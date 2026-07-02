// Resuelve el enlace (href + texto visible) a un concepto transversal desde el configurador,
// en el idioma correcto. Separado de SetupBuilder.astro para poder testear sin navegador
// (mismo patrón que setup-engine.js) y porque es donde vivía el bug real: el texto se generaba
// con slug.replace(/-/g, ' ') a partir del slug canónico en español (conceptSlugs en
// rules.en.json usa siempre el slug ES, por diseño — comparte translationKey con el par ES).

/**
 * @typedef {Object} ConceptMapEntry
 * @property {string} href
 * @property {string} title
 * @typedef {Record<string, { es?: ConceptMapEntry, en?: ConceptMapEntry }>} ConceptMap
 */

/**
 * @param {string} slug - slug ES del concepto (translationKey de aprende/conceptos/<slug>)
 * @param {string} locale - 'es' | 'en'
 * @param {ConceptMap} conceptMap
 * @returns {{ href: string, label: string } | null}
 */
export function resolveConceptLink(slug, locale, conceptMap) {
	const entry = conceptMap[slug]?.[locale];
	if (entry) return { href: entry.href, label: entry.title };

	// Fallback defensivo: no debería ocurrir (i18n-check obliga a que todo concepto tenga
	// par ES/EN), pero si faltara la entrada del idioma actual, usamos el href que exista
	// (el otro idioma) con una etiqueta legible a partir del slug, en vez de romper o dejar
	// el enlace vacío en silencio.
	const fallbackEntry = conceptMap[slug]?.es ?? conceptMap[slug]?.en;
	if (!fallbackEntry) return null;
	return { href: fallbackEntry.href, label: slug.replace(/-/g, ' ') };
}
