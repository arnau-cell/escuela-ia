# Pipeline de noticias · diseño para n8n (E5)

> **Estado: diseñado, todavía NO ejecutado dentro de n8n real** (sí probado fuera de n8n, ver
> `simulate-pipeline.mjs` y el resultado real en `src/content/news/*/2026-06-30-068c9bc4.md`).
> Todo lo de aquí es el diseño completo, verificado en las partes que se podían verificar sin escribir
> en el VPS (URLs de RSS reales, formato de contenido, gates del sitio), listo para importar/configurar.
>
> **Corrección (auditoría E5, 2026-07-03)**: la sesión constructora original reportó el VPS como
> inaccesible (`root@37.27.3.113` → `Permission denied`) y asumió que era por no tener autorización.
> Era un diagnóstico equivocado: el root SSH está deshabilitado a propósito en ese VPS; el usuario
> correcto es **`arnau@37.27.3.113`** con la misma clave `~/.ssh/hetzner_n8n` — verificado y funcional.
> No hay ningún bloqueo de acceso real. Ver `_privado/auditorias/E5-veredicto.md` para el detalle.
>
> **Este VPS es la infraestructura personal de Arnau** (una única instancia n8n self-hosted, sin
> separación por proyecto, que hoy también sirve automatizaciones de Contabilidad/Networking/Inversión
> UY). Es un VPS **distinto** de la n8n de Estudio ESE (instancia local/Docker, sin relación alguna con
> este servidor) — no confundir ni mezclar las dos. Aceptable usar el VPS personal para esta fase de
> prototipo; migrar a infraestructura propia de Escuela IA está anotado como pendiente en
> `_conocimiento/PENDIENTES.md` antes de financiación externa o due diligence.

## Resumen del flujo

```
Cron diario
  → leer feeds RSS (whitelist oficial, ver abajo)
  → por cada item: normalizar + generar id estable (hash del link)
  → comprobar en GitHub si ya existe (dedup — evita duplicados sin necesitar base de datos)
  → construir resumen extractivo (del propio snippet del RSS, sin IA)
  → traducir ES (ver "Decisión: idioma" abajo)
  → si es "destacada" (heurística de palabras clave): resumen más elaborado con LLM barato
  → crear rama + 2 archivos (ES+EN) + Pull Request — NUNCA commit directo a master
```

## Whitelist de fuentes RSS (verificadas 2026-07-03)

| Lab | URL del feed | Verificado |
|---|---|---|
| OpenAI | `https://openai.com/news/rss.xml` | ✅ RSS 2.0 válido, confirmado con fetch real |
| Google (Google AI blog) | `https://blog.google/technology/ai/rss/` | ✅ RSS 2.0 válido, confirmado con fetch real |
| Hugging Face | `https://huggingface.co/blog/feed.xml` | ✅ RSS 2.0 válido, confirmado con fetch real |
| arXiv (cs.AI) | `http://export.arxiv.org/rss/cs.AI` | ✅ RSS 2.0 válido, confirmado con fetch real (nota: `arxiv.org/rss/cs.AI` redirige aquí) |
| Anthropic | — | ❌ **Sin RSS oficial confirmado.** Probadas `/news/rss.xml`, `/news/feed` → 404. Existen mirrors no oficiales (ver más abajo) pero la regla de este proyecto es "whitelist de fuentes RSS **oficiales**" — no activar sin decisión explícita de Arnau. |
| Mistral AI | — | ❌ **Sin RSS oficial confirmado.** `mistral.ai/news` no expone feed autodiscoverable ni `/feed.xml`. Misma situación que Anthropic. |

**Decisión pendiente de Arnau**: para Anthropic y Mistral, elegir entre (a) activar el pipeline solo con los 4 feeds confirmados y añadir estos dos labs más adelante si aparece un feed oficial, (b) aceptar un mirror comunitario no oficial como excepción documentada (ej. `tim-hilde.github.io/anthropic-rss/rss.xml` para Anthropic — de código abierto pero no operado por Anthropic), o (c) sustituir el RSS por scraping directo de su página de novedades (más frágil, más mantenimiento). **Recomendación: opción (a)** — empezar con 4 fuentes 100% oficiales, añadir las otras dos cuando/si aparece un feed propio.

## Dedup sin base de datos

En vez de mantener un almacén de "ya visto" (que rompería el requisito de "sin backend en producción" del plan maestro), el propio repo GitHub sirve de registro: antes de crear un archivo, se comprueba con la API de GitHub (`GET /repos/arnau-cell/escuela-ia/contents/src/content/news/en/{slug}.md`) si ya existe. `slug` = `{YYYY-MM-DD}-{primeros 8 caracteres del sha256 del link del RSS}` — estable, determinista, sin colisiones prácticas.

## Resumen extractivo (sin IA, por defecto)

El propio `description`/`contentSnippet` que trae el RSS ya es un resumen (así funciona RSS). El workflow solo lo trunca a ~280 caracteres respetando el final de frase, y añade siempre el enlace a la fuente — nunca reproduce el artículo completo. Esto cumple `_privado/LEGAL.md` §1.5 sin necesitar ninguna llamada a un modelo.

## Decisión: idioma (ES/EN) — el matiz que no estaba resuelto en el plan original

El plan maestro dice "resumen extractivo por defecto, LLM barato solo en destacadas" pensando en la **profundidad** del resumen, pero no resolvía explícitamente que el sistema de contenido exige **siempre un par ES+EN** con el mismo `translationKey` (`scripts/i18n-check.mjs` trata `news` igual que `docs`). Casi todas las fuentes de la whitelist publican en inglés — así que hace falta traducir, no solo resumir.

**Diseño elegido**: el título y el resumen extractivo en inglés se traducen al español con una llamada barata (traducción, no generación — mismo texto, otro idioma) antes de crear los dos archivos. El archivo ES se genera siempre con `translationOutdated: false` si la traducción tuvo éxito, o `true` si falló (fallback: copia el texto en inglés con el flag activo, para que el banner `TranslationStatus` avise). **La revisión humana obligatoria de esta fase (modo PR-revisado) es precisamente el punto donde se pule cualquier traducción floja antes de aprobar el PR** — no hace falta que la traducción automática sea perfecta desde el primer día.

Alternativa considerada y descartada por ahora: traducir con un modelo de lenguaje en vez de un servicio de traducción — más caro y menos determinista para una tarea que es, en esencia, mecánica. Si Arnau prefiere un servicio de traducción gratuito y open-source (ej. LibreTranslate autoalojado en el mismo VPS, en un contenedor Docker adicional), es la opción recomendada por coherencia con el resto del proyecto (abierto, sin coste marginal). Requiere su aprobación porque añade un contenedor nuevo al VPS compartido.

## "Destacada" (trending) — heurística simple, no IA

`trending: true` si el título contiene alguna de estas palabras clave (lista corta, ampliable sin tocar el workflow — vive en el nodo "Code: clasificar"): nombres de lanzamientos mayores (`GPT-`, `Claude `, `Gemini `, `Llama `, número de versión mayor). Determinista, igual que el resto del proyecto evita "IA donde no hace falta" (mismo principio que `setup-engine.js`). Solo si `trending: true` se añade el paso opcional de resumen más elaborado vía LLM barato (requiere credencial de API configurada en n8n — no incluida en este diseño, decisión de Arnau qué proveedor usar).

## Modo PR-revisado (obligatorio en esta fase, no cambiar)

El workflow **nunca** hace commit directo a `master`. Cada noticia: rama nueva → 2 archivos (`reviewed: false`) → Pull Request. Un humano revisa (contenido, traducción, clasificación) y decide: aprobar y fusionar (opcionalmente cambiando `reviewed: true` en el propio PR antes de aprobar), pedir cambios, o cerrar sin fusionar. Pasar a modo automático (crear directo con `reviewed: true`) es una decisión posterior de Arnau tras ver 1-2 semanas de calidad real — no se activa en esta fase bajo ninguna circunstancia.

## Nodos del workflow (ver `pipeline-noticias.workflow.json`)

1. **Schedule Trigger** — cron diario (propuesto: 06:00 UTC).
2. **Code: whitelist de feeds** — array `{lab, url}` con las 4 fuentes confirmadas.
3. **RSS Feed Read** — por cada item de la whitelist (n8n itera automáticamente sobre los items de entrada).
4. **Code: normalizar** — slug determinista, extraer título/link/snippet/fecha, clasificar `trending` (heurística de palabras clave).
5. **HTTP Request (GitHub API): comprobar duplicado** — `GET /repos/.../contents/src/content/news/en/{slug}.md`; **IF** 404 → continuar, si 200 → descartar el item.
6. **Code: resumen extractivo** — truncar snippet a ~280 caracteres en límite de frase.
7. **HTTP Request: traducir a ES** (servicio a decidir, ver arriba) con fallback a `translationOutdated: true` si falla o no está configurado.
8. **IF: ¿es destacada?** → rama opcional de resumen enriquecido vía LLM barato (pendiente de credencial).
9. **HTTP Request (GitHub API): crear rama** `noticias/{slug}` desde `master`.
10. **HTTP Request (GitHub API): crear archivo** `src/content/news/en/{slug}.md`.
11. **HTTP Request (GitHub API): crear archivo** `src/content/news/es/{slug}.md`.
12. **HTTP Request (GitHub API): crear Pull Request** `noticias/{slug}` → `master`, con nota recordando revisar la traducción antes de aprobar.

## Credenciales necesarias en n8n (configurar ahí, nunca en este repo)

- **GitHub PAT** con scope mínimo (fine-grained: `contents:write`, `pull_requests:write`, limitado al repo `arnau-cell/escuela-ia`). Nombre sugerido de la credencial en n8n: `github-escuela-ia-news-bot`.
- Si se activa traducción vía servicio externo o LLM barato para destacadas: su API key correspondiente, como credencial separada.

## Cómo activar esto (pasos para quien tenga acceso al VPS)

1. Resolver la decisión pendiente de Anthropic/Mistral (arriba).
2. Importar `pipeline-noticias.workflow.json` en n8n **o** construir los nodos a mano siguiendo la lista de arriba — el JSON no ha sido importado/probado en un n8n real, revisar cada nodo al importar.
3. Configurar las credenciales (GitHub PAT como mínimo).
4. Activar el workflow con **un solo feed** primero (ej. solo Hugging Face) — regla de riesgos del plan maestro. Confirmar que genera un PR válido con un archivo que pasa `node scripts/i18n-check.mjs` y el schema Zod de la collection `news`.
5. Si sale bien, activar el resto de feeds confirmados.
6. Dejar corriendo en modo PR-revisado al menos 1-2 semanas antes de considerar automatizar el merge.
