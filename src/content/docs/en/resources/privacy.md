---
title: "Privacy policy"
description: "What data this site processes (today: practically none), on what legal basis, and what Giscus does with comments."
translationKey: recursos/privacidad
sourceUpdated: 2026-07-05
sidebar:
  order: 5
---

## Summary

This site is mostly static; only a handful of `/api/**` routes run on demand (the conversational
core, Wiki questions, and tool voting). It requires no sign-up to browse and **includes no
contact form or identifiable personal-data capture**. Tool voting processes your IP address in a
pseudonymized, temporary way (see below) — it's the only somewhat non-trivial processing that
exists today, and overall processing remains minimal by design.

## What is processed and on what legal basis

| Data | Processed today? | Detail |
|---|---|---|
| Browsing (pages viewed, approximate country) | Only if the final hosting (Cloudflare Pages) has analytics connected | [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) or Umami, both configured to avoid tracking cookies or fingerprinting — see the [cookie policy](/en/resources/cookies/). Legal basis: legitimate interest (aggregate, anonymous audience measurement). |
| Tool voting ("was this useful?") in the [Wiki](/en/wiki/tools/) | Yes | Your IP is transformed with HMAC (a cryptographic signature using a server-side secret key) before being stored — it's never stored in the clear. That fingerprint is used only to prevent repeat votes from the same person on the same tool, is deleted automatically after 30 days, and is never cross-referenced with any other data or used to build a profile. Full detail in [How the ranking works](/en/wiki/how-ranking-works/). Legal basis: legitimate interest (integrity of a public counter, a minimal and proportionate measure). |
| Conversational core and Wiki questions (generative AI) | Yes, ephemerally | Your message is sent to the Anthropic API to generate the reply; it isn't stored in any log or database of this site's own beyond the daily usage limit (a counter per IP and day, with no conversation content). AI transparency notice (art. 50 of the EU AI Act) visible on both surfaces. |
| Blog comments | No — Giscus is prepared but not active yet (pending GitHub Discussions being enabled on the repository) | Once active: comments are handled by **GitHub Discussions**, under the GitHub account of whoever comments. This site does not store those comments or the associated data — GitHub does, under its own [privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement). Legal basis: consent (you sign in to GitHub voluntarily to comment). |
| Waitlist / newsletter | No — doesn't exist on the site yet | Will be documented here with the exact provider and legal basis before it ships. |
| Contact forms | No — contact is via GitHub Issues, under the GitHub account of whoever writes | Handled by GitHub, not by this site. |

## Who is the data controller

The project's owner — see the [legal notice](/en/resources/legal-notice/) for contact and ownership
details. For any privacy
question, use the same contact channel.

## Your rights

For any data GitHub processes on your behalf (comments, Issues), your GDPR rights of access,
rectification, erasure and the rest are exercised directly with GitHub, since it is the one storing and
processing that data. This site keeps no user database of its own over which you could exercise those
rights, because no such database exists.

## Changes

This policy will be updated as soon as the site adds any new data processing (for example, an email
waitlist). This page's `sourceUpdated` field reflects the date of the last review.
