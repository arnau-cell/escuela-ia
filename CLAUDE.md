# CLAUDE.md · Escuela IA (4º mundo · provisional)

> Contexto fino para Claude Code en este mundo. Hereda las reglas globales (`~/.claude/CLAUDE.md`)
> y el espíritu del sistema de Arnau (orden, autonomía con contexto, blindar a la primera, español sobrio).

## Qué es

Mundo nuevo (4º, decisión explícita de Arnau el 2026-06-27) para el proyecto **"Escuela de la IA / AI School"**:
web pública, gratuita, neutral, bilingüe ES/EN, para que cualquiera entienda la IA de cero a técnico.
Open source (código MIT · contenido CC BY-SA). Proyecto para ayudar; monetización fuera de foco.

## Estado

Base organizativa + estrategia (E0) completas. Fase actual: **E1** (scaffold web bilingüe, F0+F1). El plan
técnico está en `_conocimiento/PLAN_MAESTRO.md`; el plan total de fases (E0-E11: producto, legal, financiación,
visibilidad) vive en `_privado/` (no se sube al repo público — ver regla de codificación abajo).

## Reglas de este mundo

- **Código** → este repo `C:\Work\EscuelaIA\` (GitHub `arnau-cell/escuela-ia`, público).
- **Conocimiento** → `_conocimiento/` (y, pendiente, su copia en Drive del mundo).
- **Datos/PII** → nunca a GitHub (`.gitignore` + `_DATOS/` fuera del repo).
- **Estrategia privada** (legal, pitch, aceleradoras, financiación) → `_privado/` (`.gitignore`), nunca a GitHub.
- **Idioma de producto**: ES y EN en paralelo; **ES es el idioma fuente**, EN se deriva y se revisa.
- **Neutralidad**: sin afiliados de pago en v1; siempre alternativas open-source; costes con fecha de verificación.
- **VPS** (pipeline de noticias con n8n): leer libre; escribir requiere turno/candado.

## Regla de codificación y auditoría (dura, 2026-07-02)

**SIEMPRE 1 agente a la vez. NUNCA subagentes** (ni Agent tool, ni Task/Workflow multi-agente, ni paralelismo
de agentes) en ninguna fase de este proyecto. Construcción y auditoría son sesiones de Claude Code separadas
y secuenciales — nunca simultáneas, nunca la misma sesión. Protocolo completo y prompts listos para cada fase
en `_privado/protocolo/` (privado, no en el repo público).

**Ampliación (2026-07-05, tras incidente real): una sola VENTANA escribiendo en el repo a la vez.**
El 2026-07-05 tres ventanas escribieron a la vez en este repo (pivote, planificación de ranking y pitch
decks) y se cruzaron. Regla operativa: antes de escribir nada (código, docs u outputs), ejecuta `git status`;
si hay cambios sin comitear que NO son tuyos, para y pregunta a Arnau qué ventana los está generando. Al
terminar tu bloque de trabajo, comitea (o declara explícitamente qué dejas sin comitear y por qué). Material
de pitch/inversores NUNCA fuera de `_privado/` o Drive (outputs/ está gitignorado como red de seguridad).

## Stack (decidido)

Astro + Starlight · Cloudflare Workers (`escuela-ia.arnau-cell.workers.dev`, conectado 2026-07-03) · Pagefind · Giscus (activo) · Cloudflare Web Analytics.
Pipeline noticias: RSS → n8n (VPS) → resumen → commit → rebuild.

## Punteros

- Plan maestro: `_conocimiento/PLAN_MAESTRO.md`
- Decisiones y reglas: `_conocimiento/DECISIONES.md`
- Investigación: `_conocimiento/investigacion/`
