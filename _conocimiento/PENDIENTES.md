# Pendientes de auditoría (reservas menores no bloqueantes)

> Reservas que un veredicto de auditoría marcó como "no bloqueante" pero que hay que resolver en algún
> momento para no perder el hilo. Se borran de aquí cuando se resuelven (queda el historial en el
> veredicto original de `_privado/auditorias/`).

## Abiertas

(ninguna)

## Resueltas

- [x] **E3 — texto de `ConceptLink` en español dentro del configurador EN**: en
  `src/components/SetupBuilder/SetupBuilder.astro` (script cliente), el texto visible de los enlaces a
  conceptos se generaba con `slug.replace(/-/g, ' ')`, y los `conceptSlugs` de `rules.en.json` usan siempre
  el slug canónico en español (por diseño, comparten `translationKey` con ES) — el bloque "To understand
  this:" en `/en/build/set-up-your-ai/` mostraba texto en español aunque el `href` ya apuntaba bien a la
  página en inglés. Afectaba a 8 de las 13 reglas. Resuelto 2026-07-02: extraída la lógica de resolución
  a `src/components/SetupBuilder/concept-labels.js` (función pura `resolveConceptLink`, testeable sin
  navegador — mismo patrón que `setup-engine.js`), y el mapa server-side (`SetupBuilder.astro`, antes
  `conceptHrefMap`) ahora guarda `{ href, title }` por idioma en vez de solo el `href`, usando
  `doc.data.title` real de cada concepto. El script cliente usa el título traducido; si por algún motivo
  faltara la entrada de un idioma, cae a un href disponible con etiqueta legible en vez de romper.
  Añadidos 5 tests nuevos, incluida una comprobación de integridad referencial (todo `conceptSlug` usado
  en las reglas corresponde a un concepto real con `translationKey` existente). 37/37 tests en verde.
  Detalle: `_privado/auditorias/E3-veredicto.md`.
- [x] **E1 — licencia "Other" en GitHub** (cosmético, nota de licencia dual movida de `LICENSE` a
  `README.md`). Resuelto 2026-07-02. Detalle: `_privado/auditorias/E1-veredicto.md`.
- [x] **E2 — `lastVerified` faltante en `local-vs-nube.mdx` / `local-vs-cloud.mdx`**: el texto dice
  "verificado julio 2026" pero el frontmatter (ES y EN) no tenía el campo `lastVerified`. El dato ya
  era correcto, era solo inconsistencia de metadatos. Resuelto 2026-07-02: añadido
  `lastVerified: 2026-07-02` a ambos frontmatters. Detalle: `_privado/auditorias/E2-veredicto.md`.
- [x] **E2 — matiz omitido en `que-es-docker.mdx` / `what-is-docker.mdx`**: "gratis para uso personal"
  era cierto pero incompleto — el límite real de la licencia gratuita de Docker Desktop es empresa con
  <250 empleados y <10M USD de facturación anual. Resuelto 2026-07-02: añadida frase aclaratoria en la
  sección "Para empezar" / "To get started" de ambos idiomas ("y también para empresas pequeñas (menos
  de 250 empleados y menos de 10 millones de dólares de facturación anual; por encima de eso hace falta
  una suscripción de pago)"). Detalle: `_privado/auditorias/E2-veredicto.md`.
