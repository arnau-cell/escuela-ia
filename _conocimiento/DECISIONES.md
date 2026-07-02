# Decisiones y reglas del sistema · Escuela IA

## Decisiones de Arnau (2026-06-27)

1. **Nombre**: provisional `Escuela IA` / repo `escuela-ia`. Nombre + dominio definitivos se deciden antes de lanzar.
2. **Mundo**: **nuevo mundo separado** (4º). Decisión explícita; rompe a propósito la regla de "solo 3 mundos oficiales".
3. **Repositorio**: **público / open source** (código MIT · contenido CC BY-SA). Permite contribución por PR.
4. **Arranque**: hoy **solo organizar la base** (este mundo + conocimiento + accesos). NO construir la web. Mañana se empieza a estructurar y construir desde aquí.

## Reglas del sistema que aplican (heredadas)

- **Routing**: código → `C:\Work\EscuelaIA` + GitHub `arnau-cell` · conocimiento → `_conocimiento/` (+ Drive pendiente) · datos/PII → nunca a GitHub.
- **NO se acepta**: trabajar en OneDrive · PII/datos a GitHub · automatización sin prueba real · entregable a terceros sin PDF · improvisar rutas.
- **Gate /nuevo**: este plan equivale a la ficha de `/nuevo` (clasifica, propone rutas, validación, riesgos, registro). Al ser mundo nuevo, falta formalizar nombre/dominio y la ubicación del vault Drive.
- **VPS** (Hetzner, n8n): leer libre; escribir requiere turno (candado `~/.claude/vps-lock.ps1`). El pipeline de noticias usará n8n del VPS pero el VPS nunca sirve la web.
- **Autonomía con contexto**: ejecutar lo automatizable; escalar a Arnau lo irreversible/externo/credenciales/decisión de negocio.

## Decisiones abiertas (para mañana)

- Nombre y dominio definitivos.
- Ubicación del **vault de conocimiento en Drive** del 4º mundo (los 3 actuales usan G/I/H; el 4º no tiene unidad asignada). Hasta entonces, el conocimiento vive en este repo (se respaldará al crear el remoto público).
- Crear el repo público y conectar Cloudflare Pages.
- Política editorial / de neutralidad detallada (irá en `CONTRIBUTING.md` + "Sobre el proyecto").

## Decisiones de Arnau (2026-07-02)

1. **Alcance ampliado**: el proyecto ya no es solo la web — incluye vehículo de startup (legal, financiación,
   visibilidad, Uruguay + Emiratos). Plan total de fases E0-E11 en `_privado/` (privado, no en este repo público
   por contener estrategia de negocio, cifras y contactos).
2. **Codificación y auditoría**: siempre 1 agente de Claude Code a la vez, nunca subagentes. Construcción y
   auditoría en sesiones separadas. Regla grabada en `CLAUDE.md` (raíz del repo) y memoria persistente.
3. **F0+F1 (scaffold web bilingüe) en ejecución** como fase E1 del plan total.
