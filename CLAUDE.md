# CLAUDE.md · Escuela IA (4º mundo · provisional)

> Contexto fino para Claude Code en este mundo. Hereda las reglas globales (`~/.claude/CLAUDE.md`)
> y el espíritu del sistema de Arnau (orden, autonomía con contexto, blindar a la primera, español sobrio).

## Qué es

Mundo nuevo (4º, decisión explícita de Arnau el 2026-06-27) para el proyecto **"Escuela de la IA / AI School"**:
web pública, gratuita, neutral, bilingüe ES/EN, para que cualquiera entienda la IA de cero a técnico.
Open source (código MIT · contenido CC BY-SA). Proyecto para ayudar; monetización fuera de foco.

## Estado

Solo base organizativa. La web NO está construida. El plan completo está en `_conocimiento/PLAN_MAESTRO.md`.

## Reglas de este mundo

- **Código** → este repo `C:\Work\EscuelaIA\` (GitHub `arnau-cell/escuela-ia`, público).
- **Conocimiento** → `_conocimiento/` (y, pendiente, su copia en Drive del mundo).
- **Datos/PII** → nunca a GitHub (`.gitignore` + `_DATOS/` fuera del repo).
- **Idioma de producto**: ES y EN en paralelo; **ES es el idioma fuente**, EN se deriva y se revisa.
- **Neutralidad**: sin afiliados de pago en v1; siempre alternativas open-source; costes con fecha de verificación.
- **VPS** (pipeline de noticias con n8n): leer libre; escribir requiere turno/candado.

## Stack (decidido)

Astro + Starlight · Cloudflare Pages · Pagefind · Giscus · analítica Cloudflare/Umami.
Pipeline noticias: RSS → n8n (VPS) → resumen → commit → rebuild.

## Punteros

- Plan maestro: `_conocimiento/PLAN_MAESTRO.md`
- Decisiones y reglas: `_conocimiento/DECISIONES.md`
- Investigación: `_conocimiento/investigacion/`
