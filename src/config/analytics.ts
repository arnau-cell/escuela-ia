/**
 * Cloudflare Web Analytics — cookieless, ver _privado/LEGAL.md §1.3 y
 * src/content/docs/recursos/cookies.md. El token real solo existe una vez Cloudflare Pages
 * esté conectado (Arnau, checkpoint humano de E1): panel de Cloudflare → Web Analytics →
 * "Add a site" (con el sitio ya sirviendo desde Pages) → copiar el token (el valor de
 * `data-cf-beacon` que da el panel, un JSON con la clave "token").
 *
 * Vacío = no se inyecta ningún script (ver src/components/Head.astro) — no se manda a
 * producción una llamada a un beacon sin token real.
 */
export const CF_BEACON_TOKEN = '';
