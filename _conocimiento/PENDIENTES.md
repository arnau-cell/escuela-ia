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
- [ ] **E6 — precio de Ollama Pro Max incorrecto** en `blog/*/reviews/ollama-*.md` (ES+EN): dice "cerca
  de 200 USD/mes", pero la fuente primaria (`ollama.com/pricing`) confirma que el plan superior se llama
  "Max" (no "Pro Max") y cuesta 100 USD/mes. El plan "Pro" (20 USD/mes) sí está bien. Detalle:
  `_privado/auditorias/E6-veredicto.md`.
- [ ] **E6 — categoría inconsistente con la ruta** en `blog/*/reviews/bienvenida.md` /`welcome.md`
  (ES+EN): viven en la carpeta `reviews/` (URL `/comparte/reviews/bienvenida/`) pero
  `category: aprendizajes` en el frontmatter — el badge visible no coincide con la URL. Decisión
  editorial menor: mover el archivo o cambiar la categoría. Detalle: `_privado/auditorias/E6-veredicto.md`.
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
- [ ] **E5 — PR real #5 generado, pendiente de revisión/aprobación de Arnau**: primera ejecución de punta
  a punta del pipeline completada de verdad en el n8n del VPS tras crear el PAT
  (`github-escuela-ia-news-bot`, vinculado a los 6 nodos que lo necesitan). Se encontraron y corrigieron
  2 bugs reales durante la ejecución (IF de duplicado sin `fullResponse`, pérdida de datos del
  normalizador al pasar por la llamada HTTP intermedia, y descripción vacía cuando el feed no trae
  snippet — los 3 corregidos en `ops/n8n/pipeline-noticias.workflow.json`). Resultado:
  https://github.com/arnau-cell/escuela-ia/pull/5 — rama `noticias/2026-07-01-e4a02290`, 2 archivos
  ES+EN, `reviewed: false`, CI verde. **Pendiente de Arnau**: revisar el contenido/traducción del PR y
  decidir aprobar+mergear (marcando `reviewed: true`) o pedir cambios/cerrar. Detalle completo:
  `_privado/auditorias/E5-handoff-v2.md` y `_privado/auditorias/E5-handoff-v3.md`.
  Decisiones que siguen abiertas, no urgentes: (a) empezar solo con los 4 feeds RSS oficiales confirmados
  (OpenAI, Google AI, Hugging Face, arXiv) o esperar/aceptar mirror no oficial para Anthropic/Mistral;
  (b) servicio de traducción EN→ES (propuesta: LibreTranslate autoalojado en el mismo VPS, nuevo
  contenedor, requiere aprobación); (c) proveedor de LLM barato si se quiere la rama de "destacadas"
  enriquecidas desde el principio.
- [ ] **E5 — anotado para más adelante, no urgente**: el pipeline de noticias correría en el VPS
  **personal** de Arnau (única instancia n8n self-hosted, sin separación por proyecto, hoy sirve
  Contabilidad/Networking/Inversión UY). Aceptable en fase de prototipo, pero antes de que Escuela IA
  reciba financiación externa, tenga colaboradores con acceso, o pase due diligence de una aceleradora,
  migrar a infraestructura propia (mismo criterio ya aplicado a ESE, que tiene prohibido usar este VPS
  por ser una entidad externa). Detalle: `_privado/auditorias/E5-veredicto.md`.

## Resueltas

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
