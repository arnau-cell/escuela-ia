# Escuela de la IA / AI School

**ES** — El sitio de referencia gratuito y neutral para entender la IA de cero a nivel técnico, bilingüe (ES/EN). Sin afiliados de pago, siempre alternativas open-source, y una guía "monta tu setup" que te dice exactamente qué instalar según tu ordenador, presupuesto y objetivo. No es un negocio: es un proyecto para ayudar.

**EN** — The free, neutral reference site for understanding AI from zero to technical level, bilingual (ES/EN). No paid affiliates, always open-source alternatives, and a "set up your AI" guide that tells you exactly what to install based on your computer, budget and goal. Not a business — a project to help.

🌐 [escuela-ia.arnau-cell.workers.dev](https://escuela-ia.arnau-cell.workers.dev) _(subdominio provisional de_
_Cloudflare Workers; dominio propio definitivo pendiente de decidir)_

## Stack

[Astro](https://astro.build) + [Starlight](https://starlight.astro.build) · [Cloudflare Workers](https://workers.cloudflare.com) (hosting) · [Pagefind](https://pagefind.app) (buscador) · [Giscus](https://giscus.app) (comentarios del blog, activo sobre GitHub Discussions) · [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) (sin cookies de rastreo).

## Desarrollo local

```bash
npm install
npm run dev          # http://localhost:4321
npm run build         # build de producción
npm run preview       # sirve el build de producción
npm run check:i18n     # verifica que todos los pares ES/EN estén completos
npm test               # tests de los scripts
```

## Estructura

```
src/
├─ content/
│  ├─ docs/        # ES en la raíz, EN bajo docs/en/ (mismo translationKey)
│  ├─ news/        # noticias, generadas por el pipeline automático
│  └─ blog/        # entradas de blog (COMPARTE)
├─ content.config.ts
├─ components/
├─ data/setup/      # reglas del configurador "monta tu setup"
└─ i18n/ui.ts
scripts/
├─ new-content.mjs   # genera un par ES+EN nuevo con translationKey compartido
└─ i18n-check.mjs     # falla si hay páginas huérfanas o traducciones desactualizadas
```

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md). El plan completo del producto está en [`_conocimiento/PLAN_MAESTRO.md`](./_conocimiento/PLAN_MAESTRO.md) — es un documento abierto, cualquiera puede leer hacia dónde va el proyecto.

## Licencias

Este repositorio usa un esquema dual:

- **Código** — configuración, componentes, scripts, estilos: [MIT](./LICENSE).
- **Contenido educativo** — `src/content/`, `_conocimiento/`: [CC BY-SA 4.0](./LICENSE-content.md).

## Sobre el proyecto

Idea y desarrollo: [Arnau Muset](https://github.com/arnau-cell). Sin afiliados de pago, sin patrocinios que condicionen el contenido core (que siempre es gratuito). Ver la sección "Sobre el proyecto" del propio sitio para la política de neutralidad completa.
