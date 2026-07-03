---
title: "Cómo construimos el pipeline de noticias con n8n (y qué se rompió)"
description: "El diseño sobre el papel funcionaba. Al importarlo a un n8n real, aparecieron tres bugs que solo un servidor de verdad podía enseñarnos."
translationKey: como-lo-hice/pipeline-noticias-n8n
sourceUpdated: 2026-07-03
publishedAt: 2026-07-03
category: como-lo-hice
author: Arnau
lang: es
draft: false
---

La sección [Noticias](/noticias/) de este sitio no la escribe nadie a mano: un flujo en
[n8n](https://n8n.io) lee los RSS oficiales de varios laboratorios de IA, genera un resumen corto, crea
una rama en GitHub con los dos archivos (español e inglés) y abre un Pull Request para que se revise
antes de publicar. Esto es lo que pasó al construirlo de verdad, no en teoría.

## La primera versión, sobre el papel

El diseño era simple: cron diario → leer RSS → comprobar si la noticia ya existe (para no duplicar) →
resumen extractivo (nunca el artículo completo, solo lo que ya trae el propio RSS) → traducir o marcar
como pendiente de traducción → crear rama + 2 archivos + PR. Lo simulamos fuera de n8n con un script de
Node normal y funcionaba perfecto. El problema es que "funciona simulado" y "funciona en el n8n real" no
son lo mismo.

## Bug 1: el sandbox de n8n es más estricto de lo que parece

El primer intento de generar un identificador único por noticia usaba `require('crypto')`, la forma
estándar de Node de calcular un hash. Al ejecutar el flujo de verdad, saltó: *"Module 'crypto' is
disallowed"*. El motor de ejecución de código de n8n (el "JS Task Runner") bloquea el acceso a módulos
internos de Node por seguridad — ni siquiera el `crypto.subtle` del navegador (Web Crypto), que también
lo intentamos, está disponible ahí. Solución: escribir un SHA-256 en JavaScript puro, sin ninguna
dependencia, dentro del propio nodo de código. Menos elegante, pero es lo único que corre en ese sandbox.

## Bug 2: faltaba un paso entero

Para crear una rama nueva en GitHub (`noticias/{slug}`) hace falta el SHA del commit de `master` desde el
que arrancarla — la API de GitHub lo exige. El diseño original se lo saltaba. No es un error sutil: sin
ese dato, la llamada para crear la rama falla directamente. Se añadió un nodo extra que primero pide ese
SHA y luego lo pasa al siguiente paso.

## Bug 3: el mismo Pull Request se habría creado dos veces

Este fue el más interesante. El diseño conectaba "crear archivo en inglés" y "crear archivo en español"
en paralelo, y ambos apuntaban al mismo nodo final de "crear Pull Request". En n8n (como en la mayoría de
motores de flujos), cuando dos ramas del flujo llegan al mismo nodo, ese nodo se ejecuta **una vez por
cada rama que llega** — no espera a que lleguen todas antes de correr una sola vez. Resultado: se habría
abierto el mismo Pull Request dos veces por cada noticia. La solución fue encadenar los dos pasos en
serie (primero el archivo en inglés, luego el español, luego el PR) en vez de en paralelo.

## Lo que se mantuvo del diseño original

El resumen extractivo (nunca reproducir el artículo completo, solo el propio resumen que ya trae el RSS
más el enlace a la fuente), la whitelist de fuentes oficiales, y sobre todo el **modo PR-revisado**: el
flujo nunca hace commit directo a `master`. Cada noticia pasa por una rama y un Pull Request que alguien
tiene que aprobar a mano. Por qué esa decisión importó de verdad la contamos en la siguiente entrada:
[por qué la primera noticia automática se revisa a mano](/comparte/aprendizajes/por-que-modo-pr-revisado/).

## Resultado

Con los tres bugs corregidos, el flujo corrió de verdad contra el feed de Hugging Face y abrió un Pull
Request real con los dos archivos, en modo borrador (`reviewed: false`), esperando revisión humana antes
de fusionarse — exactamente como estaba pensado desde el principio.
