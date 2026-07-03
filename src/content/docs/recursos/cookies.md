---
title: "Política de cookies"
description: "Este sitio no usa cookies de rastreo. Verificado sobre el sitio real, no en abstracto."
translationKey: recursos/cookies
sourceUpdated: 2026-07-03
sidebar:
  order: 6
---

## Este sitio no usa cookies de rastreo

Verificado directamente sobre el sitio construido (no es una afirmación genérica de plantilla):

- La respuesta HTTP de las páginas no incluye ninguna cabecera `Set-Cookie`.
- El motor del sitio (Starlight) y el buscador (Pagefind) no ejecutan ningún código que escriba cookies
  — el único dato que guardan en tu navegador es la preferencia de tema claro/oscuro, en
  **`localStorage`** (almacenamiento local técnico, no una cookie, y no se envía a ningún servidor ni se
  usa para rastrearte).
- La analítica prevista (Cloudflare Web Analytics o, alternativamente, Umami) está elegida
  específicamente por ser **sin cookies** (mide visitas de forma agregada y anónima sin necesitar
  identificarte entre visitas) — bajo LSSI art. 22.2 esto no requiere consentimiento previo. Mientras el
  sitio no esté desplegado en Cloudflare Pages, esta analítica ni siquiera está activa.
- Los comentarios (Giscus, sobre GitHub Discussions) todavía no están activos — cuando se activen,
  correrán dentro de un iframe de GitHub solo en las páginas de blog donde el usuario decida interactuar;
  cualquier cookie que ponga en ese momento la pone GitHub bajo su propio dominio, no este sitio (ver su
  [política de cookies](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)).
  Esta página se revisará en cuanto Giscus se active de verdad.

## Por eso no hay banner de cookies

Un banner de consentimiento solo es obligatorio cuando el sitio usa cookies no esenciales (analítica de
rastreo, publicidad, etc.). Al no usar ninguna, mostrar un banner sería ruido innecesario para quien
visita el sitio — se omite a propósito, no por descuido.

## Si esto cambia

Si en el futuro se añade cualquier cookie no esencial (por ejemplo, si se sustituye la analítica elegida
por otra que sí las use), esta página se actualizará primero y se añadirá el banner correspondiente antes
de activarla — no al revés.
