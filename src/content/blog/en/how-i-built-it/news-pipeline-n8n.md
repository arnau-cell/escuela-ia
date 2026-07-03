---
title: "How we built the news pipeline with n8n (and what broke)"
description: "The design on paper worked. Importing it into a real n8n instance surfaced three bugs only a real server could teach us."
translationKey: como-lo-hice/pipeline-noticias-n8n
sourceUpdated: 2026-07-03
publishedAt: 2026-07-03
category: como-lo-hice
author: Arnau
lang: en
draft: false
---

The [News](/en/news/) section of this site isn't written by hand: a flow in [n8n](https://n8n.io) reads
official RSS feeds from several AI labs, generates a short summary, creates a GitHub branch with both
files (Spanish and English), and opens a Pull Request for review before publishing. Here's what actually
happened building it for real, not in theory.

## The first version, on paper

The design was simple: daily cron → read RSS → check whether the news item already exists (to avoid
duplicates) → extractive summary (never the full article, only what the RSS itself already provides) →
translate or flag as pending translation → create a branch + 2 files + a PR. We simulated it outside of
n8n with a plain Node script and it worked perfectly. The problem is that "works simulated" and "works in
real n8n" aren't the same thing.

## Bug 1: n8n's sandbox is stricter than it looks

The first attempt at generating a unique ID per news item used `require('crypto')`, Node's standard way
to compute a hash. Running the flow for real, it failed: *"Module 'crypto' is disallowed."* n8n's code
execution engine (the "JS Task Runner") blocks access to internal Node modules for security — not even
the browser's `crypto.subtle` (Web Crypto), which we also tried, is available there. Fix: write a pure
JavaScript SHA-256 implementation, no dependencies at all, inside the code node itself. Less elegant, but
it's the only thing that runs in that sandbox.

## Bug 2: an entire step was missing

Creating a new GitHub branch (`noticias/{slug}`) requires the SHA of the `master` commit to branch from
— the GitHub API requires it. The original design skipped it. It's not a subtle bug: without that data,
the branch-creation call fails outright. An extra node was added that fetches that SHA first and passes
it to the next step.

## Bug 3: the same Pull Request would have been created twice

This one was the most interesting. The design connected "create English file" and "create Spanish file"
in parallel, both pointing at the same final "create Pull Request" node. In n8n (like most workflow
engines), when two branches of the flow arrive at the same node, that node runs **once per incoming
branch** — it doesn't wait for all of them before running once. Result: the same Pull Request would have
been opened twice per news item. The fix was chaining the two steps in sequence (English file first, then
Spanish, then the PR) instead of running them in parallel.

## What stayed from the original design

The extractive summary (never reproduce the full article, only the RSS's own summary plus a link to the
source), the whitelist of official sources, and above all **PR-reviewed mode**: the flow never commits
directly to `master`. Every news item goes through a branch and a Pull Request that someone has to
approve by hand. Why that decision actually mattered is in the next entry:
[why the first automated news entry gets reviewed by hand](/en/share/lessons-learned/why-pr-reviewed-mode/).

## Result

With the three bugs fixed, the flow ran for real against the Hugging Face feed and opened a real Pull
Request with both files, in draft mode (`reviewed: false`), waiting for human review before merging —
exactly as planned from the start.
