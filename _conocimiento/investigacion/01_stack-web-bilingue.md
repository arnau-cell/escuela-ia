# Investigación 01 · Stack web bilingüe de coste mínimo (jun 2026)

## Stack recomendado

**Astro + Starlight · Cloudflare Pages · Pagefind · Giscus · analítica Cloudflare/Umami.**
Coste real: **~€12-20/año** (solo el dominio); todo lo demás €0.

### Por qué Astro + Starlight
- **i18n nativo** zero-config para 2 idiomas (ES/EN), con estructura espejo y selector que salta a la página equivalente.
- **MDX** para componentes interactivos (el "monta tu setup").
- **Blog** integrado; **Pagefind** (buscador local estático, gratis, full-text) ya integrado en Starlight.
- Curva suave (Markdown + Git), rendimiento alto (SSG, cero JS por defecto), SEO out-of-box.

### Comparativa de frameworks

| Criterio | Astro Starlight | Docusaurus | VitePress | Nextra | MkDocs Material |
|---|---|---|---|---|---|
| i18n 2 idiomas | Nativo zero-config | Robusto | Por locales | _meta.json | Plugin |
| Blog | Sí | Sí (plugin) | Manual | Sí | No |
| MDX interactivo | Sí | Sí | Sí | Sí (full React) | No |
| Buscador gratis | Pagefind local | Algolia | Local | Lunr/Algolia | Built-in |
| Curva | Muy suave | Media (React) | Media (Vue) | Media (Next) | Suave (YAML) |
| Estado 2026 | Activo | Estable | Estable | Activo | **Maintenance mode** |

→ Astro Starlight gana por i18n + blog + interactividad + facilidad. (MkDocs en mantenimiento desde nov-2025.)

## Hosting (gratis)

| Plataforma | Ancho de banda | Builds | Coste | Notas |
|---|---|---|---|---|
| **Cloudflare Pages** | Ilimitado | 500/mes | €0 | **Ganador** |
| GitHub Pages | 100 GB/mes | Ilimitado | €0 | Backup; repo ≤1 GB |
| Vercel | 100 GB/mes | Ilimitado | €0 | Cuidado con overage |
| Netlify | ~límites ajustados 2026 | ~20 | €0 | Menos generoso |

## Piezas auxiliares (gratis)

- **Buscador**: Pagefind (local, sin API, ilimitado). Algolia DocSearch solo si se aprueba programa OSS; no merece la complejidad al inicio.
- **Comentarios**: Giscus (sobre GitHub Discussions), GDPR-friendly, €0. Solo en blog.
- **Analítica**: Cloudflare Web Analytics (€0, básica) → Umami (cloud free tier o self-host) si crece.
- **Dominio**: ~€10-20/año (Namecheap/Cloudflare Registrar). SSL incluido gratis.

## Resumen de costes

| Concepto | Año 1 | Año 2+ |
|---|---|---|
| Dominio | €12-20 | €12-20 |
| Hosting + buscador + comentarios + analítica + SSL | €0 | €0 |

## Fuentes
- https://starlight.astro.build/guides/i18n/
- https://www.pkgpulse.com/guides/best-documentation-frameworks-2026
- https://docusaurus.io/docs/i18n/introduction · https://vitepress.dev/guide/i18n
- https://dev.to/morinaga/static-site-search-for-astro-in-2026-why-i-picked-pagefind-over-algolia-and-lunr-pg1
- https://starlight.astro.build/guides/site-search/
- https://snapdeploy.dev/blog/deploy-website-free-2026-complete-guide/
- https://giscus.app/ · https://umami.is/ · https://www.namecheap.com/domains/
