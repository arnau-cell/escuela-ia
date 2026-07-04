# Plan · "Escuela de la IA" (nombre provisional) — web educativa bilingüe sobre IA

## Contexto (por qué)

Arnau, estudiando la guía de agentes/modelos que hicimos, detectó que lo que más le ha
costado —y le sigue costando— es **entender cómo encaja todo**: qué es cada cosa, para qué
sirve, cuándo usar una u otra, dónde se descarga, dónde queda, cómo se accede, qué cuesta, qué
ordenador necesita, qué significa "correr en local", qué es una base de datos, cómo poner una
app online… y mantenerse al día de lo que sale cada semana.

La idea: crear **el sitio de referencia, gratuito y neutral, para que cualquiera entienda la IA
de cero a nivel técnico**, bilingüe (ES/EN), con una parte de "móntatelo tú" personalizada,
noticias actualizadas, herramientas por sector y, más adelante, comunidad. No es un negocio:
es un proyecto para **ayudar**, a coste mínimo. La monetización no es el foco ahora.

La investigación confirma que **hay hueco real**: los referentes actuales (Futurepedia, Future
Tools, TLDR AI, Ben's Bites, HF Learn, "AI for Everyone") son o directorios-embudo, o solo
noticias, o muy técnicos, o de pago, y **ninguno es neutral + bilingüe + de cero-a-avanzado +
por sector + con "cómo montártelo tú"**. Ese es el diferenciador.

## Decisiones tomadas (con Arnau)

| Decisión | Elección |
|---|---|
| **Nombre** | Provisional `escuela-ia` (display "Escuela de la IA / AI School"); nombre+dominio definitivos antes de lanzar |
| **Mundo / ubicación** | **Mundo nuevo separado** (4º mundo, decisión explícita de Arnau — rompe a propósito la regla de "solo 3 mundos") |
| **Repositorio** | **Público / open source** (código MIT · contenido CC BY-SA); permite contribución por PR |
| **Arranque** | **Solo dejar el plan documentado por ahora.** No se construye nada todavía |

> Este plan equivale a la ficha de la skill `/nuevo` (clasifica, propone rutas, validación, riesgos
> y registro antes de crear nada). Al ser un **mundo nuevo**, su "vault de conocimiento" será en su
> mayoría el propio repo público (`docs/`); la estrategia editorial no pública vivirá en una carpeta
> Drive ligera del nuevo mundo. Definir ubicación exacta del vault al fijar el nombre definitivo.

## Diferenciador (qué lo hace distinto de "un directorio más")

No es el listado, es la **pedagogía + la ruta personalizada**:
- Explicación "de dummies a técnico" con **conceptos transversales** bien explicados (qué es una BD, correr en local, desplegar una app, GPU/VRAM, API/token, Docker…).
- **"Monta tu setup"**: el usuario dice ordenador + presupuesto + objetivo y recibe una ruta concreta de qué instalar/usar y cuánto cuesta.
- Cada herramienta listada responde siempre: **qué es, para qué, cuándo usarla, dónde queda, cuánto cuesta** — no solo un enlace.
- **Neutral**: sin afiliados de pago en v1; siempre se mencionan alternativas open-source; costes con fecha de verificación.

## Stack técnico (coste objetivo ~€12-20/año = solo dominio)

- **Framework**: Astro + **Starlight** (i18n nativo ES/EN, sidebar, MDX para componentes interactivos).
- **Hosting**: **Cloudflare Pages** (gratis, ancho de banda ilimitado, build desde GitHub).
- **Buscador**: **Pagefind** (local, estático, gratis, full-text bilingüe).
- **Comentarios**: **Giscus** (sobre GitHub Discussions, gratis) — solo en blog.
- **Analítica**: Cloudflare Web Analytics (gratis) → Umami si crece.
- **Pipeline noticias**: RSS de labs → **n8n en el VPS Hetzner existente** → resumen → commit al repo (sin servidor que mantener).

| Concepto | Coste/año |
|---|---|
| Dominio (.com/.org) | €12-20 |
| Hosting, buscador, comentarios, analítica, SSL | €0 |
| Pipeline noticias (extractivo + LLM solo en destacadas) | céntimos/mes |

## Arquitectura de información (6 secciones nivel 1, espejo ES/EN)

```
1. APRENDE      1.1 Empieza aquí · 1.2 Nivel 0 (para todos) · 1.3 Nivel 1 (usuario)
                1.4 Nivel 2 (constructor) · 1.5 Nivel 3 (técnico) · 1.6 Conceptos transversales
2. HAZLO        2.1 Monta tu setup (interactivo) · 2.2 Recetas/Rutas · 2.3 Plataformas (catálogo)
3. POR SECTOR   Contabilidad/finanzas · Salud · Legal · Agricultura/ganadería · Informática ·
                Marketing/ventas · Educación · (+plantilla). Cada uno: qué puede hacer la IA, casos, herramientas, riesgos
4. NOTICIAS     4.1 Últimas (auto) · 4.2 Por laboratorio · 4.3 Lo no-trending (curado)
5. COMPARTE     Blog: 5.1 Reviews · 5.2 Cómo lo hice · 5.3 Aprendizajes (Giscus; foro propio = v3)
6. RECURSOS     Glosario · Mapa de la IA · Sobre el proyecto (misión/neutralidad/licencia) · Buscador
```

**1.6 Conceptos transversales** es el corazón pedagógico: páginas autoconclusivas y enlazables
desde cualquier término (BD y sus tipos, local vs nube + qué ordenador, desplegar una app, API/token/clave,
modelo/peso/cuantización, Docker, GPU/CPU/VRAM).

## Modelo de contenido e i18n (evitar el fallo nº1: desincronización ES/EN)

- Estructura espejo `src/content/docs/es/...` y `src/content/docs/en/...` (misma jerarquía, slug traducido).
- **ES = idioma fuente**; EN se genera con Claude y se revisa.
- Cada página lleva `translationKey` + `sourceUpdated` en frontmatter.
- **`scripts/i18n-check.mjs`** en CI: empareja por `translationKey`, **falla el PR** si hay páginas huérfanas o traducciones desactualizadas.
- Componente `TranslationStatus`: banner honesto "puede estar desactualizada" cuando el par va por detrás.
- Noticias y blog = **content collections** propias (schema Zod), fuera de la sidebar jerárquica.

## "Monta tu setup" (interactivo, determinista, sin IA en tiempo real en v1)

Datos + componente, no LLM en runtime: gratis, instantáneo, offline, auditable.
- `src/data/setup/`: `rules.es.json`, `rules.en.json` (textos) + `platforms.json` (catálogo neutro de herramientas: id, url, dónde queda, cómo se accede, coste).
- `src/components/SetupBuilder/`: isla ligera + `setup-engine.js` (función pura `recommend(inputs)→ruta`, con tests).
- Inputs: objetivo · local/nube · hardware (GPU/RAM) · presupuesto · nivel.
- Salida: ruta con pasos (qué instalar y por qué), coste estimado, alternativas y enlaces a conceptos (1.6).
- Añadir una ruta = añadir un objeto JSON (mantenible sin programar). Migrable a capa LLM en v2.

## Pipeline de noticias (coste mínimo, sin backend en producción)

```
RSS (OpenAI, Google AI, Mistral, HF, Anthropic, arXiv)
  → n8n en VPS (cron diario): leer → filtrar nuevas → dedup (hash URL) → clasificar lab/trending
  → resumen (extractivo por defecto; LLM barato solo en destacadas)
  → commit .md a src/content/news/ vía GitHub API (PAT scoped al repo)
  → Cloudflare Pages reconstruye solo → noticias publicadas (estáticas)
```
- **El VPS solo orquesta** (n8n ya existe); nunca sirve la web. Respetar el candado/turno del VPS al tocar n8n.
- Primeras semanas en **modo PR-revisado** (`reviewed:false`) por calidad; pasar a automático después.
- Noticias = contenido público sin PII → pueden ir a GitHub.

## Scaffold del repo (mundo nuevo; rutas provisionales hasta fijar nombre)

Código: `C:\Work\<MundoNuevo>\` (sibling de Personal/ESE/Nexo) · GitHub `arnau-cell/escuela-ia` (público).

```
escuela-ia/
├─ .github/workflows/   deploy.yml · i18n-check.yml
├─ src/
│  ├─ content/
│  │  ├─ docs/es/  (aprende, hazlo, por-sector, recursos)
│  │  ├─ docs/en/  (learn, build, by-industry, resources)
│  │  ├─ news/     (auto-poblado por n8n)
│  │  └─ blog/
│  ├─ content.config.ts        (schemas Zod: translationKey, sourceUpdated, lab, trending…)
│  ├─ components/   SetupBuilder/ · NewsFeed · SectorCard · TranslationStatus · ConceptLink
│  ├─ data/setup/   rules.es.json · rules.en.json · platforms.json
│  ├─ i18n/ui.ts    (cadenas de interfaz ES/EN)
│  └─ styles/
├─ scripts/   i18n-check.mjs · new-content.mjs (genera par es+en con translationKey)
├─ astro.config.mjs   (Starlight, locales es/en, Pagefind)
├─ README.md · CONTRIBUTING.md · LICENSE (MIT código + CC BY-SA contenido) · .gitignore
```
Estrategia editorial / calendario / política de neutralidad / fuentes → carpeta Drive del nuevo mundo (no en GitHub).

## MVP (v1) y fases

**v1 (lanzable):** sitio Astro+Starlight desplegado en CF Pages, ES/EN, buscador, Giscus ·
sección **APRENDE** (Empieza aquí + Nivel 0 + Nivel 1 + 6-8 conceptos transversales) ·
**Monta tu setup** con 8-12 reglas · **3 sectores** a fondo (Informática, Marketing, Salud) + plantilla ·
**Noticias** con pipeline en modo PR-revisado · 2-3 entradas de blog semilla · "Sobre el proyecto".
Criterio listo: i18n-check verde, Lighthouse >90, configurador sensato en 5 perfiles de prueba.

**v2:** Niveles 2-3, resto de sectores, recetas empaquetadas, noticias automáticas, catálogo de plataformas, configurador v2.
**v3:** comunidad/foro propio (Discourse en VPS), contribución por PR abierta, newsletter semanal, posible 3er idioma.

| Fase | Bloque | Esfuerzo (sesiones) |
|---|---|---|
| F0 | Scaffold + i18n + deploy CF Pages + dominio + Pagefind + Giscus + CI | 1-2 |
| F1 | Árbol de secciones (placeholders bilingües) + schemas + componentes base | 1-2 |
| F2 | Núcleo APRENDE (Nivel 0/1 + conceptos transversales) | 3-5 |
| F3 | Monta tu setup (engine + JSON + tests) | 2-3 |
| F4 | 3 sectores semilla + plantilla | 2 |
| F5 | Pipeline noticias en VPS (paralelizable desde el inicio) | 1-2 |
| F6 | Blog + pulido (SEO hreflang, OG, accesibilidad) | 1-2 |
| F7 | QA + lanzamiento v1 | 1 |

## Riesgos y mitigación (resumen)

- **Contenido desactualizado** → separar perenne (conceptos) de volátil (modelos/precios en tablas con `lastVerified`); noticias cubren actualidad.
- **Desincronización ES/EN** → `translationKey` + i18n-check que falla el PR + banner honesto.
- **Noticias auto con errores** → PR-revisado al inicio, extractivo por defecto, enlace a fuente, whitelist.
- **"Otro directorio más"** → la pedagogía + el configurador + el tono son el valor, no el listado.
- **Mantenimiento (eres tú solo)** → todo estático, mayoría de contenido perenne, noticias automatizadas, contribución por PR desde v1.
- **Tocar el VPS** → respetar candado/turno; workflow aislado; probar con un feed antes de activar todos.

## Verificación (cuando se construya)

- `npm run build` sin errores + `scripts/i18n-check.mjs` en verde (cero páginas huérfanas/desactualizadas).
- `setup-engine.test.js`: 5 perfiles de entrada → rutas esperadas.
- Despliegue real en Cloudflare Pages accesible por dominio, selector ES/EN salta a la página equivalente, Pagefind busca en ambos idiomas.
- Lighthouse (perf/SEO/accesibilidad) > 90; `hreflang` correcto entre pares.
- Pipeline: una ejecución de n8n crea un `.md` de noticia válido y dispara rebuild.

## Estado (actualizado 2026-07-04)

El plan técnico de producto sigue siendo este documento; el plan de negocio (legal, financiación,
aceleradoras, visibilidad, Uruguay y Emiratos) vive fuera de este repo público, en `_privado/` (gitignored)
— protocolo de construcción/auditoría en `_privado/protocolo/PROTOCOLO.md`.

**Fases completadas y auditadas, todas las reservas resueltas**: E1 (scaffold F0+F1), E2 (contenido
núcleo APRENDE), E3 (Monta tu setup), E4 (3 sectores semilla + plantilla), E5 (pipeline de noticias
— PR #5 real revisado, reescrito con tono editorial y mergeado), E6 (blog + legal on-site + pulido
— PR #6 mergeado, Giscus activo, sitio real desplegado en Cloudflare Workers). Detalle de cada una en
`_conocimiento/PENDIENTES.md` (sección "Resueltas") y `_privado/auditorias/`.

**Sitio real en producción**: `https://escuela-ia.arnau-cell.workers.dev` (Cloudflare Workers, no
Cloudflare Pages — `wrangler.toml`), dominio propio definitivo pendiente de decidir.

**E7 (QA + lanzamiento v1, F7) — ciclo completo, AUDITADA Y APROBADA técnicamente**:

1. *Constructora v1*: checklist MVP completo (configurador 12 reglas, 8 conceptos, 3 sectores a
   fondo + plantilla, 4 entradas de blog, "Sobre el proyecto" con contenido real). Encontró y
   "corrigió" un defecto de rutas fantasma marcando `draft: true` en 20 páginas fuera de alcance
   de v1 — commit `e4bc272`.
2. *Auditora*: **RECHAZÓ** ese fix por tapar un síntoma, no la causa — las rutas fantasma de
   Starlight (contenido ES bajo URLs `/en/...`) se generan para CUALQUIER página con slug
   traducido (no solo las 20 marcadas draft) y contaminaban la paginación Previous/Next y el
   índice de Pagefind (53 páginas "en" indexadas, solo 29 reales). Veredicto:
   `_privado/auditorias/E7-veredicto.md`.
3. *Constructora v2*: arregló la causa de raíz — paginación propia en `src/routeData.ts` (mismo
   dato real que ya usaba el sidebar) + integración propia `clean-ghost-fallback-routes` en
   `astro.config.mjs` que borra las carpetas fantasma de `dist/en/` antes de que Pagefind indexe.
   Verificado con el mismo método exigente que usó la auditoría, en local y en producción real:
   `page_count` de Pagefind exacto (29 EN = 29 reales, 29 ES = 29 reales), las 4 transiciones de
   paginación marcadas como rotas ahora reales. Commits `ba9eae7`/`23753fb` directos a `master`.
   Detalle: `_privado/auditorias/E7-handoff-v2.md`.
4. *Auditora v2*: **APROBADO técnicamente** — reprodujo el mismo contraste de forma independiente
   (local y producción real, anti-caché confirmado con `CF-Cache-Status: MISS`), revisó el código
   del fix, y comprobó vectores adicionales no pedidos explícitamente (canonical, breadcrumbs,
   robots.txt) sin encontrar huecos. Veredicto: `_privado/auditorias/E7-veredicto-v2.md`.

**Lo único que falta para el go/no-go de lanzamiento**: que Arnau confirme explícitamente (con
reflejo en `PENDIENTES.md`) que ya revisó personalmente los 3 textos legales — checkpoint humano
pendiente desde E6, ninguna auditoría ha encontrado registro de que se haya hecho. Ningún otro
punto, técnico o de contenido, sigue abierto para esta fase. Siguiente paso tras el go/no-go:
**E8** (visibilidad).

**Siguiente sesión**: auditoría de E7 (nueva sesión, distinta de la constructora) antes del
checkpoint humano de Arnau (go/no-go de lanzamiento) y de pasar a **E8** (visibilidad).
