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

## PIVOTE (2026-07-04): el v1 construido no es lo que Arnau tenía en mente — no lanzar tal cual

E7 quedó técnicamente aprobado y con la revisión legal ya confirmada por Arnau (ver
`_privado/auditorias/E7-veredicto-v2.md`), pero al ver el sitio real, Arnau lo rechazó de fondo: no es
un problema de defectos, es que **el "core" que describió originalmente nunca quedó capturado en este
documento**, y por tanto ninguna sesión de construcción (aunque siguió el plan al pie de la letra) lo
construyó. Diagnóstico de la brecha, verificado sesión a sesión (`git log --all`, sin indicios de
paralelismo — se descarta el fallo de "subagentes"; el problema es de especificación, no de ejecución):

1. **Núcleo (antes "Monta tu setup")**: el plan documentaba explícitamente un motor de reglas
   determinista, "sin IA en tiempo real... gratis, instantáneo, offline, auditable" (ver sección de
   arriba). Lo que Arnau quiere de verdad: el cliente **describe su caso en texto libre**, y una **IA
   generativa en tiempo real** le arma un plan (opciones, costes, cómo hacerlo) y un **prompt maestro**
   redactado para que lo use en su asistente de IA favorito. Esto es una IA generativa, no una tabla de
   reglas — cambio de arquitectura, no de contenido.
2. **Estética**: referencia explícita — [blueprint.am](https://blueprint.am) (herramienta de diseño de
   hardware por IA; **la referencia es de formato, no de contenido** — Blueprint diseña hardware, Escuela
   IA arma planes de proyecto). Capturado por screenshot el 2026-07-04
   (`_privado/protocolo/blueprint-am-referencia.png`, ver también scratchpad de la sesión). Patrón exacto
   a imitar en el núcleo de Escuela IA:
   - Cabecera mínima: logo a la izquierda, 2-3 enlaces de navegación, un botón de acción arriba a la
     derecha (estilo píldora, alto contraste).
   - Tipografía **monospace en mayúsculas** para titulares grandes y etiquetas — look técnico/terminal,
     no el tema de documentación de Starlight.
   - **Hero a pantalla completa con degradado vibrante** (azul cielo → blanco → verde menta → amarillo →
     naranja/rojo, tipo aurora) — nada de fondo blanco/gris de docs.
   - **Una única caja de texto libre como interacción principal** ("Ask blueprint to build robot..."),
     con placeholder rotativo de ejemplos, un botón "¿necesitas una idea?", selector de modo y botón de
     enviar — sin formulario de varios pasos con desplegables (eso es justo lo que tiene hoy "Monta tu
     setup" y hay que sustituirlo).
   - Debajo del pliegue: una sección de **casos/proyectos de la comunidad** (equivalente: planes reales
     generados, anonimizados, o entradas del blog) con un enlace "ver más".
   - Esto es **incompatible con el tema Starlight actual** (sidebar de documentación) al menos para la
     home y el núcleo — implica una landing propia para esas páginas, mantiene Starlight para
     Aprende/Por sector/Recursos donde sí encaja un formato de documentación.
3. **Wikipedia de herramientas**: nueva sección de nivel 1 (o expansión fuerte de Recursos), catálogo
   **universal** de herramientas de IA (no filtrado por sector), reutilizando y ampliando el schema ya
   real de `src/data/setup/platforms.json` (hoy 12 herramientas: id, url, dónde corre, cómo se accede,
   coste, alternativa open-source, `lastVerified`) — hay que ampliar la cobertura y exponerlo como
   catálogo navegable/buscable propio, no solo como datos internos del configurador.
   **Ranking/voto de usuarios**: confirmado que se deja para más adelante (requiere sistema de identidad
   que hoy no existe — se agrupa con "comunidad/foro propio" ya reservado para v3).
4. **Noticias**: referencia noticias.ai (portal con tarjetas por categoría, sección de referencia
   educativa conectada a la actualidad) — confirma el rol ya documentado de Noticias como alimentador del
   resto del sitio; sin cambio de alcance aquí, seguir el pipeline ya construido en E5.

### Implicaciones de arquitectura (antes de construir, decisiones pendientes de Arnau)

- **El sitio deja de ser 100% estático** en el núcleo: una IA generativa en tiempo real requiere una
  función de servidor (Cloudflare Pages Functions / Worker) que llame a un LLM — ya no es "gratis e
  instantáneo sin backend" como en el resto del sitio.
- **Proveedor de LLM y coste por uso**: pendiente de que Arnau elija proveedor/modelo y presupuesto
  (coherente con la guía global de usar modelos Claude actuales por defecto en apps de IA). Clave de API
  siempre en `.env.local`, nunca hardcodeada (regla global).
- **Abuso/coste**: al ser gratis y público, hace falta algún límite de uso (por IP/sesión) para no dejar
  el endpoint abierto a coste ilimitado — a diseñar en la sesión constructora, no a improvisar en
  producción.
- **AI Act (Reglamento UE 2024/1689) — reevaluar, no asumir que sigue sin aplicar**: `_privado/LEGAL.md`
  §1.8 concluyó "no aplica" en v1 precisamente *porque* el configurador era determinista sin IA en
  runtime, y dejó escrito explícitamente: "si en v2 se añade IA en runtime, reevaluar categoría de
  riesgo". Este pivote es exactamente ese escenario — no se puede dar por bueno el análisis anterior.
  Reevaluar categoría de riesgo antes de activar el endpoint en producción (probablemente "riesgo
  limitado" con obligación de transparencia — informar al usuario que interactúa con IA generativa —
  pero confirmarlo, no asumirlo).

### Planning: proveedor de LLM (decisión de Arnau, 2026-07-04) y qué implica construir esto

**Decisión**: fase de pruebas con **Claude Haiku 4.5** (`claude-haiku-4-5`, vía API de Anthropic). En un
futuro no lejano, migrar a un **LLM local potente** (autoalojado). El motor debe diseñarse con una capa
de abstracción (una función `generatePlan(input) → {plan, promptMaestro}` con el proveedor como
parámetro/config) para que ese cambio futuro sea una sustitución de proveedor, no una reescritura.

**Coste de Haiku 4.5, cifras reales (no estimación)** — contexto 200K, **$1.00/millón de tokens de
entrada, $5.00/millón de salida**:

| Escenario por generación | Input | Output | Coste/generación |
|---|---|---|---|
| Típico (1,5k in / 1,5k out) | $0,0015 | $0,0075 | **≈ $0,009** (menos de 1 céntimo) |
| Máximo esperado (2k in / 2k out) | $0,002 | $0,01 | **≈ $0,012** |

Proyección a volumen (usando el escenario típico, ≈$0,009/generación):

| Planes generados/mes | Coste/mes estimado |
|---|---|
| 500 | ≈ $4,50 |
| 5.000 | ≈ $45 |
| 50.000 | ≈ $450 |

Prácticamente gratis en fase de pruebas y lanzamiento inicial. Recomendación adicional de coste: si el
prompt del sistema (instrucciones fijas de cómo generar el plan) es estable y solo cambia la descripción
libre del cliente, usar **prompt caching** (bloque de sistema con `cache_control`) — lecturas de caché
cuestan ~0,1× el precio normal, así que en volumen esto reduce further el coste de la parte de instrucciones
fijas. Diseñar el prompt con las instrucciones fijas primero y la descripción del cliente al final, para
que el prefijo cacheable sea estable.

**Cuándo migrar a un LLM local potente (no ahora, más adelante)**: un LLM local requiere hardware de GPU
(propio o alquilado en la nube — RunPod, Vast.ai, etc.), con un coste fijo por hora (~$0,50-2/hora según
GPU) independientemente de si se usa o no, a diferencia de Haiku que es 100% variable por uso. Solo
compensa migrar cuando el volumen sostenido sea alto (la GPU necesita estar ocupada para que el coste
fijo por hora resulte más barato que pagar por token) o cuando haya una razón no económica (privacidad de
los datos de los clientes que describen su negocio, control total sin depender de un proveedor externo,
o el VPS/hardware ya está pagado por otro motivo). Con el volumen esperado de un sitio educativo gratuito
en sus primeras fases, Haiku sigue siendo la opción más barata y simple durante bastante tiempo — no
hay prisa por migrar. Cuando llegue el momento, elegir el modelo open-weight concreto (familias como
Llama, Qwen, DeepSeek, Mistral) **en el momento de decidir**, no ahora — el panorama de modelos abiertos
cambia rápido y cualquier recomendación fijada hoy quedaría desactualizada (mismo criterio de "coste con
fecha de verificación" que ya se aplica al resto del sitio).

**Qué implica construir el pivote completo, en fases** (para dimensionar el esfuerzo, no como plan de
sesiones rígido — cada sesión constructora decide su propio alcance dentro de esto):

| Bloque | Qué incluye | Complejidad relativa |
|---|---|---|
| Núcleo generativo (Haiku) | Función `generatePlan`, endpoint serverless (Cloudflare Pages Function), límite de uso por IP/sesión, mensaje de transparencia (IA generativa), reevaluación AI Act | Media — primer cambio de arquitectura del sitio (dejar de ser 100% estático) |
| Rediseño visual del núcleo | Home + página núcleo con la estética tipo blueprint.am (monospace, degradado, caja de texto libre), sin tocar Starlight en el resto del sitio | Media — trabajo de frontend, sin lógica nueva compleja |
| Wiki de herramientas | Ampliar `platforms.json` (hoy 12 entradas) a catálogo universal navegable, página de listado/búsqueda | Baja-media — mayormente contenido y una vista nueva sobre datos ya existentes |
| Migración a LLM local (futuro) | Aprovisionar GPU, autoalojar modelo, sustituir el proveedor detrás de `generatePlan` | Alta, pero diferida — no bloquea el lanzamiento del pivote |

Ninguno de estos bloques se construye en esta sesión (auditora) — quedan para la sesión constructora de
`PIVOTE-NUCLEO` (prompt en `_privado/protocolo/prompts/PIVOTE-NUCLEO-constructor.md`).
- **Numeración de fase**: este pivote no encaja en el E0-E11 ya asignado (E8 sigue siendo visibilidad).
  Se trata como ciclo propio **PIVOTE-NUCLEO** (constructor/auditor dedicados en
  `_privado/protocolo/prompts/`), independiente de la numeración de negocio.

### Estado del go/no-go de lanzamiento

**Queda en pausa.** El v1 ya construido y auditado (E1-E7) sigue técnicamente sano (gates verdes,
producción real funcionando, revisión legal confirmada), pero Arnau decidió no lanzarlo así — se
mantiene desplegado en `escuela-ia.arnau-cell.workers.dev` como referencia de trabajo, no como versión
final. El siguiente ciclo constructor/auditor es sobre el núcleo (ver arriba), no sobre visibilidad (E8).

### PIVOTE-NUCLEO — construido y auditado (2026-07-04/05), en PR sin fusionar

Rebautizado **Easy AI**, núcleo conversacional real sobre Claude Haiku 4.5 (ya no el motor de
reglas determinista, retirado sin dejar enlaces rotos) + Wiki de la IA completa (conceptos +
catálogo de herramientas + preguntas). El sitio deja de ser 100% estático: adapter
`@astrojs/cloudflare` añadido, solo las rutas `/api/**` son bajo demanda.

**Ciclo completo**: construcción (2026-07-04) → auditoría independiente, **APROBADO CON
RESERVAS** (`_privado/auditorias/PIVOTE-NUCLEO-veredicto.md`) → sesión de cierre (2026-07-05):
reservas 1/2/4 resueltas (AI Act reevaluado en `_privado/LEGAL.md` §1.8, `.gitignore` con
`.dev.vars`, todo en PR) + **primera conversación real con clave de Anthropic válida**, que
encontró y arregló un bug real (`astro:content` no viable en rutas bajo demanda de Cloudflare
Workers — contexto de la Wiki ahora se genera en build, no en la petición). Detalle completo en
`_privado/auditorias/PIVOTE-NUCLEO-handoff.md` (con su addendum).

**PR #8** (`pivote-nucleo` → `master`) abierto, sin fusionar — decisión de Arnau. Pendiente antes
del go/no-go: `wrangler secret put ANTHROPIC_API_KEY` en producción, Lighthouse tras el primer
deploy real con SSR, y fusionar el PR cuando Arnau lo decida.

### RANKING-WIKI — ranking de herramientas estilo Futurepedia (decisión de Arnau, 2026-07-05)

Arnau decidió implementar el **ranking de herramientas de la Wiki** con Futurepedia como
referencia de formato, y usarlo además como **base de recomendación del núcleo**: los planes que
el núcleo genera para cada cliente tienen en cuenta el ranking, y cada plan cerrado lo
retroalimenta (contador de recomendaciones por herramienta — señal que ningún directorio tiene).

Esto adelanta la parte de "voto" que estaba agrupada con comunidad/v3: el diseño usa **voto
anónimo** (HMAC de IP con salt secreto + TTL 30 días, mismo patrón ya testeado del rate-limit) y
por tanto NO requiere sistema de identidad — solo las reviews escritas siguen reservadas para v3.
De Futurepedia se copian las señales y el formato (contador de "útil", orden por popularidad en
categoría, curación editorial con criterios públicos); NUNCA su monetización (featured,
sponsored, afiliados — rompen la neutralidad, que es nuestro diferenciador).

- Investigación y diseño completo (fórmula pública del score, señales, fases):
  `_conocimiento/investigacion/04_futurepedia-y-ranking-herramientas.md`.
- Prompt constructor listo para el programador:
  `_privado/protocolo/prompts/RANKING-WIKI-constructor.md` (R1 = D1 + endpoints voto/ranking +
  orden en la Wiki + página de transparencia; R2 = señal del núcleo + score en el prompt;
  R3 = ampliar catálogo a 40-60 herramientas + puntuación editorial).
- **Prerrequisito**: PR #8 fusionado (el ciclo construye encima del pivote) — **cumplido**, PR #8
  fusionado en `master` el 2026-07-04/05.
- Acciones exclusivas de Arnau al construir: `wrangler d1 create escuela-ia-ranking` (+ id real
  en `wrangler.toml`), `wrangler secret put VOTE_SALT`, aplicar la migración D1 en producción.

#### R1 construido (2026-07-05), en PR sin fusionar — pendiente de auditoría

D1 (`tool_stats` + migración versionada), `POST /api/wiki/vote` (dedup HMAC+KV, rate-limit
20/día, valida `toolId` contra el catálogo real), `GET /api/wiki/ranking` (cacheado 300s,
`formulaVersion`), botón de voto + reordenación en `WikiToolsList.astro` (degrada a alfabético
sin JS/con la API caída), página "Cómo funciona el ranking" ES/EN, señal mínima de R2 (`chat.ts`
incrementa `nucleo_recs` al cerrar un plan, fire-and-forget), y política de privacidad + LEGAL.md
§1.9 actualizados. Los 4 gates en verde y verificación end-to-end en `wrangler dev` documentada
paso a paso en `_privado/auditorias/RANKING-WIKI-handoff.md`. Fuera de alcance de R1 (según lo
escrito, no improvisado): puntuación editorial, ampliación del catálogo, score dentro del prompt
del núcleo (resto de R2), reviews/estrellas/leaderboard (v3).

Siguiente paso: sesión auditora nueva y distinta (protocolo de siempre) antes de fusionar.
