# Investigación 03 · Diseño y arquitectura (jun 2026)

> Resumen del diseño técnico. El detalle completo (MVP, fases, riesgos) está en `../PLAN_MAESTRO.md`.

## Arquitectura de información (6 secciones, espejo ES/EN)

1. **APRENDE** — Empieza aquí · Nivel 0 (todos) · Nivel 1 (usuario) · Nivel 2 (constructor) · Nivel 3 (técnico) · **Conceptos transversales**.
2. **HAZLO** — Monta tu setup (interactivo) · Recetas/Rutas · Plataformas (catálogo).
3. **POR SECTOR** — Contabilidad, Salud, Legal, Agricultura/ganadería, Informática, Marketing, Educación (+plantilla).
4. **NOTICIAS** — Últimas (auto) · Por laboratorio · Lo no-trending (curado).
5. **COMPARTE** (blog) — Reviews · Cómo lo hice · Aprendizajes (Giscus; foro propio en v3).
6. **RECURSOS** — Glosario · Mapa de la IA · Sobre el proyecto · Buscador.

**Conceptos transversales** = corazón pedagógico y diferenciador: qué es una BD y sus tipos, local vs nube + qué ordenador, desplegar una app, API/token/clave, modelo/peso/cuantización, Docker, GPU/CPU/VRAM. Páginas autoconclusivas, enlazables desde cualquier término.

## Modelo de contenido e i18n

- Estructura espejo `src/content/docs/es/...` y `.../en/...` (misma jerarquía, slug traducido).
- **ES = idioma fuente**; EN se genera con Claude y se revisa.
- Frontmatter con `translationKey` + `sourceUpdated`; **`scripts/i18n-check.mjs`** en CI falla el PR si hay páginas huérfanas/desactualizadas; banner `TranslationStatus` honesto.
- Noticias y blog = content collections propias (schema Zod), fuera de la sidebar.

## "Monta tu setup" (determinista, sin IA en runtime en v1)

- Datos: `src/data/setup/rules.es.json` + `rules.en.json` (textos) + `platforms.json` (catálogo neutro: id, url, dónde queda, cómo se accede, coste).
- Componente: isla ligera + `setup-engine.js` (función pura `recommend(inputs)→ruta`, con tests).
- Inputs: objetivo · local/nube · hardware (GPU/RAM) · presupuesto · nivel. Salida: ruta con pasos, coste, alternativas y enlaces a conceptos.
- Añadir ruta = añadir JSON (mantenible sin programar); migrable a capa LLM en v2.

## Pipeline de noticias (sin backend en producción)

`RSS → n8n (VPS, cron diario): leer → filtrar → dedup (hash URL) → clasificar lab/trending → resumen (extractivo; LLM solo destacadas) → commit .md vía GitHub API → Cloudflare rebuild`. El VPS solo orquesta (respetar candado al tocar n8n). Primeras semanas en modo PR-revisado por calidad.

## MVP (v1)

Sitio Astro+Starlight desplegado (ES/EN, buscador, Giscus) · APRENDE (Nivel 0/1 + 6-8 conceptos transversales) · Monta tu setup (8-12 reglas) · 3 sectores a fondo (Informática, Marketing, Salud) + plantilla · Noticias (pipeline modo PR) · 2-3 entradas de blog · Sobre el proyecto. Listo si: i18n-check verde, Lighthouse >90, configurador sensato en 5 perfiles.

## Fases (sesiones aprox.)

F0 setup (1-2) · F1 esqueleto secciones (1-2) · F2 núcleo APRENDE (3-5) · F3 monta tu setup (2-3) · F4 3 sectores (2) · F5 pipeline noticias (1-2, paralelo) · F6 blog+pulido (1-2) · F7 QA+lanzamiento (1).

## Riesgos clave

Desactualización (separar perenne vs volátil con `lastVerified`) · desincronización ES/EN (i18n-check + banner) · noticias auto con errores (PR-revisado, enlace a fuente) · "otro directorio más" (la pedagogía es el valor) · mantenimiento en solitario (todo estático + automatizado) · tocar el VPS (candado).
