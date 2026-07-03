---
title: "Cookie policy"
description: "This site does not use tracking cookies. Verified against the real site, not in the abstract."
translationKey: recursos/cookies
sourceUpdated: 2026-07-03
sidebar:
  order: 6
---

## This site does not use tracking cookies

Verified directly against the built site (not a generic template claim):

- The HTTP response for pages includes no `Set-Cookie` header at all.
- The site engine (Starlight) and the search tool (Pagefind) run no code that writes cookies — the only
  thing they store in your browser is your light/dark theme preference, in **`localStorage`** (technical
  local storage, not a cookie, never sent to any server, and not used to track you).
- The planned analytics (Cloudflare Web Analytics, or alternatively Umami) were chosen specifically for
  being **cookieless** (they measure visits in aggregate and anonymously, with no need to identify you
  across visits) — under Spanish law (LSSI art. 22.2) this does not require prior consent. While the site
  isn't deployed on Cloudflare Pages yet, this analytics isn't even active.
- Comments (Giscus, on top of GitHub Discussions) aren't active yet — once they are, they'll run inside a
  GitHub iframe only on blog pages where a user chooses to interact; any cookie set at that point is set
  by GitHub under its own domain, not by this site (see its
  [cookie policy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)).
  This page will be reviewed once Giscus is actually turned on.

## That's why there's no cookie banner

A consent banner is only required when a site uses non-essential cookies (tracking analytics,
advertising, etc.). Since this site uses none, showing a banner would just be noise for visitors — it's
omitted on purpose, not by oversight.

## If this changes

If any non-essential cookie is ever added (for example, if the chosen analytics is replaced with one
that does use them), this page will be updated first and the corresponding banner added before turning
it on — not the other way around.
