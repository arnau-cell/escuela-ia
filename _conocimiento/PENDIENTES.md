# Pendientes de auditoría (reservas menores no bloqueantes)

> Reservas que un veredicto de auditoría marcó como "no bloqueante" pero que hay que resolver en algún
> momento para no perder el hilo. Se borran de aquí cuando se resuelven (queda el historial en el
> veredicto original de `_privado/auditorias/`).

## Abiertas

- [ ] **E3 — texto de `ConceptLink` en español dentro del configurador EN**: en
  `src/components/SetupBuilder/SetupBuilder.astro` (script cliente), el texto visible de los enlaces a
  conceptos se genera con `slug.replace(/-/g, ' ')`, y los `conceptSlugs` de `rules.en.json` usan siempre
  el slug canónico en español (por diseño, comparten `translationKey` con ES). Resultado: en
  `/en/build/set-up-your-ai/`, el bloque "To understand this:" muestra el texto en español aunque el
  `href` sí apunta correctamente a la página en inglés. Afecta a 8 de las 13 reglas. Fix sugerido: que
  `conceptHrefMap` (o un mapa nuevo) lleve también la etiqueta en el idioma correcto, resuelta en el mismo
  bucle de `getCollection('docs')` que ya construye los hrefs. Detalle: `_privado/auditorias/E3-veredicto.md`.

## Resueltas

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
