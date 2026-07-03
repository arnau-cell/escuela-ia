---
title: "Why Escuela IA exists"
description: "A free, neutral site to understand AI from zero to technical, because the resources that already exist are either directories, news-only, or paid."
translationKey: aprendizajes/bienvenida
sourceUpdated: 2026-07-03
publishedAt: 2026-07-02
category: aprendizajes
author: Arnau
lang: en
draft: false
---

This project started from a very specific frustration: the hardest part of AI isn't using it, it's
**understanding how everything fits together**. What each thing is, what it's for, when to use one tool
over another, where what you install actually lives, what "running locally" means, what a database is,
how you put an app online, what computer you need — all while trying to keep up with what changes every
week.

## What we looked for and didn't find

We looked at the resources that already exist: funnel-directories that list a thousand tools without
explaining when to use each one, newsletters that are just news with no pedagogy, very technical
resources that assume you can already code, or paid services charging for what should be free to learn.
None of them were, at the same time, neutral, bilingual, zero-to-advanced, organized by professional
sector, and able to tell you "here's what makes sense for you, given your computer and your budget."

## What Escuela IA is

A free, neutral, bilingual (Spanish/English) site to understand artificial intelligence from zero to a
technical level. It's not a business — it's a project meant to help, at minimal cost. In practice, that
means:

- **No paid affiliates.** When we mention a tool, we always look for open or free alternatives
  alongside it — we don't charge to be featured or recommended.
- **With a verification date.** Prices and features change; every volatile data point carries a
  `lastVerified` field so you know when it was last checked.
- **Genuinely bilingual.** Not a showcase machine translation — every Spanish page has a real English
  counterpart, and our own system (`i18n-check`) blocks publishing an out-of-sync pair without a warning.
- **With a personalized path.** The [Build your setup](/en/build/set-up-your-ai/) section recommends what
  to install based on your goal, your hardware, and your budget — with no AI involved in that
  recommendation, just clear, auditable rules.

## How it's built

In the open: the code is MIT-licensed and the educational content is CC BY-SA 4.0, both in the
[GitHub repository](https://github.com/arnau-cell/escuela-ia). Each phase is built, audited in a separate
session, and fixed before moving on — in fact, the entry
[how we built the news pipeline](/en/share/how-i-built-it/news-pipeline-n8n/) tells a real example of that
process, bugs included.

If you find this useful, or something is explained wrong,
[open an Issue](https://github.com/arnau-cell/escuela-ia/issues) — any correction is welcome.
