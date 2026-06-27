# Escuela IA · 4º mundo (nombre PROVISIONAL)

> **Qué es este mundo:** el hogar del proyecto "Escuela de la IA / AI School" — una web pública,
> gratuita, neutral y bilingüe (ES/EN) para que cualquiera entienda la IA de cero a nivel técnico,
> con guía "monta tu setup", noticias, herramientas por sector y comunidad.
> Idea de Arnau (2026-06-27). Proyecto para **ayudar**, no negocio; monetización fuera de foco.

> **Estado: SOLO BASE ORGANIZATIVA.** Hoy NO se ha construido la web. Esto es la casa del mundo
> (carpetas + conocimiento + accesos) para empezar a construir mañana desde aquí.

---

## Decisiones tomadas (2026-06-27)

- **Mundo nuevo separado** (4º mundo, decisión explícita de Arnau — rompe a propósito la regla de "solo 3 mundos").
- **Repo público / open source** (código MIT · contenido CC BY-SA).
- **Nombre/dominio**: provisional `Escuela IA` / `escuela-ia`. Definitivo se decide antes de lanzar.
- **Stack** (investigado): Astro + Starlight · Cloudflare Pages · Pagefind · Giscus. Coste ~€12-20/año (dominio).

## Dónde está cada cosa

| Pieza | Ruta |
|---|---|
| Código del mundo (este repo) | `C:\Work\EscuelaIA\` |
| Conocimiento / plan / investigación | `C:\Work\EscuelaIA\_conocimiento\` |
| Workspace VS Code | `C:\Work\EscuelaIA.code-workspace` |
| Accesos directos del mundo | `C:\Work\_ACCESOS\Escuela IA\` (puerta única, vía escritorio `ACCESOS · Trabajo`) |
| GitHub | `arnau-cell/escuela-ia` (público) — **pendiente de crear** (no se ha tocado nada externo hoy) |
| Web (Cloudflare Pages) | pendiente (v1) |

## Estructura

```
EscuelaIA/
├─ README.md                 ← este archivo (puerta del mundo)
├─ CLAUDE.md / AGENTS.md     ← contexto fino para Claude Code / Codex en este mundo
├─ .gitignore
└─ _conocimiento/
   ├─ PLAN_MAESTRO.md        ← el plan completo (IA, secciones, MVP, fases, riesgos)
   ├─ DECISIONES.md          ← decisiones + reglas del sistema que aplican
   └─ investigacion/
      ├─ 01_stack-web-bilingue.md
      ├─ 02_competidores-y-fuentes-contenido.md
      └─ 03_diseno-arquitectura.md
```

> El scaffold de la web (Astro/Starlight, `src/`, etc.) se creará mañana, en este mismo repo.

## Pendiente para mañana (primer arranque)

1. Fijar **nombre + dominio** definitivos.
2. Decidir el **vault de conocimiento en Drive** del 4º mundo (hoy el conocimiento vive aquí en local; falta su copia en Drive — los 3 mundos actuales usan G/I/H, el 4º no tiene unidad asignada todavía).
3. Crear el **repo público** `arnau-cell/escuela-ia` y conectar Cloudflare Pages.
4. Empezar por **F0+F1** del plan (scaffold Astro + i18n + deploy vacío) — ver `_conocimiento/PLAN_MAESTRO.md`.
