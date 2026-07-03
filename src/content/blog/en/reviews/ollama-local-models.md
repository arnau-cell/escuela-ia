---
title: "Ollama: running AI models on your own computer, tested"
description: "We installed Ollama, pulled a couple of models, and tested what actually matters: what you need, what it costs, and when it beats using the cloud."
translationKey: reviews/ollama-modelos-en-local
sourceUpdated: 2026-07-03
publishedAt: 2026-07-03
lastVerified: 2026-07-03
category: reviews
author: Arnau
lang: en
draft: false
---

## What it is

[Ollama](https://ollama.com) is a free, open-source tool for downloading and running language models
directly on your own computer — no sending your data to any external server, no mandatory account, and
no cost. It's probably the simplest on-ramp from "using a chatbot in the browser" to "having a model
running on your machine."

## What it does well

- **Genuine one-command install.** On Mac/Linux/Windows, you install it and `ollama run llama3.2` (or
  whichever model you pick) already downloads a model and has it answering in your terminal.
- **Picks the quantization for you.** Since 2026, Ollama detects your hardware and automatically selects
  a quantization level (Q4_K_M by default) so large models run reasonably even on laptops with 8GB of
  RAM — you used to have to choose this by hand.
- **Real vision support.** Models like Qwen-VL, Llama 3.2 Vision, or the multimodal Phi-4 family run
  with the same `ollama run` command as text-only models, no separate adapters to install.
- **OpenAI API-compatible.** It has tool calling and structured outputs (JSON Schema) in the same shape
  as the OpenAI API — if you already have code written against that API, switching to a local model is,
  in many cases, just changing the base URL.

## What's missing or costs money

- The local software is free and stays that way (that's its core pitch), but **Ollama Cloud** — its
  cloud inference service, for when your hardware can't handle large models — is paid: the Pro plan
  costs 20 USD/month and the Max plan, 100 USD/month (verified at
  [ollama.com/pricing](https://ollama.com/pricing), 2026-07-03). You don't need it for the basics — it
  only comes into play if you want models your own computer can't run.
- You need *some* comfort with a terminal — there's no official native GUI (though third-party projects
  do add a visual layer on top).
- Answer quality depends on which model you pick, not on Ollama itself — Ollama is the engine, not the
  model.

## When it makes sense (and when it doesn't)

It makes sense if: you want real privacy (nothing leaves your machine), you don't want to pay per token,
or you're learning how models work under the hood. See also our
[local vs. cloud](/en/learn/concepts/local-vs-cloud/) concept page for the full comparison of when each
option fits.

It doesn't make as much sense if: your computer is modest and you need the most powerful models on the
market (those are still bigger than a typical laptop can run well), or you'd rather not deal with a
terminal at all.

## Verdict

Free, open source, and surprisingly easy to install for what it does. If you're curious to try an AI
model without depending on any external service, this is the starting point we recommend first.

*Tool mentioned with no sponsorship or affiliation — this project's neutrality policy is at
[About the project](/en/resources/about/).*
