# Pendientes de auditoría (reservas menores no bloqueantes)

> Reservas que un veredicto de auditoría marcó como "no bloqueante" pero que hay que resolver en algún
> momento para no perder el hilo. Se borran de aquí cuando se resuelven (queda el historial en el
> veredicto original de `_privado/auditorias/`).

## Abiertas

- [ ] **E6 — checkpoint humano sin sustituir**: Arnau (responsable legal declarado en el aviso legal)
  debe revisar personalmente los 3 textos legales (aviso legal, privacidad, cookies, ES+EN) antes de dar
  la fase por cerrada del todo. La auditoría confirmó que son coherentes con `_privado/LEGAL.md` y con
  el estado real del sitio, pero eso no sustituye la revisión personal. Detalle:
  `_privado/auditorias/E6-veredicto.md`.
- [ ] **E6 — PR #6 mergeado, dos checkpoints humanos siguen pendientes**: GitHub Discussions
  desactivado (`has_discussions: false`, verificado) — Giscus está preparado en
  `src/components/Giscus.astro` pero no activo, necesita que Arnau active Discussions y pegue
  `REPO_ID`/`CATEGORY_ID` de giscus.app en el componente. Cloudflare Pages sin conectar
  (`escuela-ia.pages.dev` no resuelve, verificado con `nslookup`) — el punto de inyección de
  analítica ya existe en `src/config/analytics.ts` pero necesita el token real del panel de
  Cloudflare Web Analytics una vez conectado. Lighthouse (100/100/100/100 en las páginas
  muestreadas) se corrió contra `npm run preview` local, no contra un deploy real — repetir contra
  el hosting final en cuanto exista. Detalle: `_privado/auditorias/E6-handoff.md`.
- [ ] **E6 — falta un asset de `og:image` por defecto** (no bloqueante, cosmético): no existe
  ninguna imagen de diseño para compartir en redes; Open Graph funciona bien sin ella (título,
  descripción, url) pero sin imagen de portada. Detalle: `_privado/auditorias/E6-handoff.md`.
- [ ] **E5 — decisiones de producto no urgentes, pendientes de Arnau**: (a) empezar solo con los 4 feeds
  RSS oficiales confirmados (OpenAI, Google AI, Hugging Face, arXiv) o esperar/aceptar mirror no oficial
  para Anthropic/Mistral; (b) servicio de traducción EN→ES (propuesta: LibreTranslate autoalojado en el
  mismo VPS, nuevo contenedor, requiere aprobación); (c) proveedor de LLM barato para el paso de
  reescritura de tono (ver entrada siguiente) y para la rama de "destacadas" enriquecidas. Ninguna
  bloquea el pipeline, que ya funciona con el fallback/modo manual actual.
- [ ] **E5 — automatizar el tono editorial de títulos/resúmenes** (decisión de Arnau, 2026-07-03): tono
  serio/profesional con gancho comercial que incite a la conversación, aplicado por primera vez a mano
  en el PR #5 (ver `ops/n8n/README.md`, sección "Tono editorial"). Objetivo declarado: una vez validado
  con varias rondas de revisión manual, entrenar/promptear un paso de reescritura (LLM barato) para que
  el pipeline lo aplique de forma autónoma, sin perder el fact-check contra la fuente en cada titular.
  Pendiente: elegir proveedor de LLM (mismo que el punto (c) de arriba) y diseñar el prompt/paso en
  `pipeline-noticias.workflow.json` — no urgente, se sigue aplicando a mano mientras tanto.
- [ ] **E5 — anotado para más adelante, no urgente**: el pipeline de noticias correría en el VPS
  **personal** de Arnau (única instancia n8n self-hosted, sin separación por proyecto, hoy sirve
  Contabilidad/Networking/Inversión UY). Aceptable en fase de prototipo, pero antes de que Escuela IA
  reciba financiación externa, tenga colaboradores con acceso, o pase due diligence de una aceleradora,
  migrar a infraestructura propia (mismo criterio ya aplicado a ESE, que tiene prohibido usar este VPS
  por ser una entidad externa). Detalle: `_privado/auditorias/E5-veredicto.md`.

## Resueltas

- [x] **E5 — PR #5 (primera noticia real) revisado, reescrito con tono editorial y mergeado**: Arnau
  revisó el contenido, definió el tono (serio/profesional con gancho comercial) y pidió reescribir el
  título/descripción antes de aprobar. Reescrito en ambos idiomas verificando contra la fuente original
  (el primer borrador de titular decía "local" incorrectamente — la fuente habla de infraestructura en
  la nube de Cerebras, no de ejecución local; corregido antes de publicar). `reviewed: true` en ambos
  archivos, PR mergeado 2026-07-03. Detalle: `ops/n8n/README.md` sección "Tono editorial".
- [x] **E6 — precio de Ollama Pro Max incorrecto** en `blog/*/reviews/ollama-*.md` (ES+EN): decía "cerca
  de 200 USD/mes" para un plan "Pro Max" que no existe. Resuelto 2026-07-03: verificado de nuevo
  directamente en `ollama.com/pricing` (WebFetch a la página oficial) — los planes reales son "Pro"
  (20 USD/mes, sin cambios) y "Max" (100 USD/mes, no ~200). Corregido en ambos idiomas. Detalle:
  `_privado/auditorias/E6-veredicto.md`.
- [x] **E6 — categoría inconsistente con la ruta** en `blog/*/reviews/bienvenida.md`/`welcome.md`
  (ES+EN): vivían en `reviews/` con `category: aprendizajes` — badge y URL no coincidían. Resuelto
  2026-07-03: movidos a `blog/es/aprendizajes/bienvenida.md` y `blog/en/lessons-learned/welcome.md`
  (mismo nombre de carpeta EN que usa la otra entrada de esta categoría), `translationKey` actualizado
  a `aprendizajes/bienvenida` para que siga apuntando a la ruta real del archivo. Nuevas URLs:
  `/comparte/aprendizajes/bienvenida/` y `/en/share/lessons-learned/welcome/`. Sin enlaces internos
  rotos (verificado, nadie más referenciaba la ruta antigua). Detalle: `_privado/auditorias/E6-veredicto.md`.
- [x] **E4 — precio de Copy.ai desactualizado** en `por-sector/marketing-ventas.mdx` /
  `en/by-industry/marketing-sales.mdx` (tabla de herramientas): decía "Nivel gratuito (10 000
  palabras/mes); planes desde 20 USD/mes". Resuelto 2026-07-03: verificado directamente en
  `copy.ai/prices` (WebFetch a la página oficial, no un agregador de terceros) — Copy.ai **ya no
  tiene nivel gratuito permanente**; el plan más barato (Chat) es 29 USD/mes, o 24 USD/mes con
  facturación anual. Corregida la fila en ambos idiomas. Refuerza el argumento de neutralidad de la
  página: sin nivel gratuito en la herramienta especializada, la alternativa abierta (asistente
  general gratuito) pasa a ser la opción real de entrada, no solo la "de repuesto". Detalle:
  `_privado/auditorias/E4-veredicto.md`.
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
