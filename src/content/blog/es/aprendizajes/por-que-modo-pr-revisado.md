---
title: "Por qué la primera noticia automática se revisa a mano"
description: "El pipeline de noticias podría publicar solo, sin que nadie lo revise. Decidimos que no lo haga todavía, y la razón tiene que ver con la traducción, no con la IA."
translationKey: aprendizajes/por-que-modo-pr-revisado
sourceUpdated: 2026-07-03
publishedAt: 2026-07-03
category: aprendizajes
author: Arnau
lang: es
draft: false
---

Cuando diseñamos el [pipeline de noticias](/comparte/como-lo-hice/pipeline-noticias-n8n/), la pregunta
obvia era: si ya genera el resumen y crea los archivos solo, ¿por qué no publicarlo directamente? La
respuesta que dimos —y que nos costó tener clara— es que el riesgo no está donde parece.

## El riesgo no es que la IA "invente"

El resumen de cada noticia no lo genera un modelo de lenguaje: es extractivo, literalmente el propio
resumen que ya trae el RSS oficial del laboratorio, recortado a un tamaño razonable. Ahí no hay
alucinación posible porque no hay generación — solo se copia y se recorta texto que el laboratorio ya
publicó. Ese no era el punto débil.

## El riesgo real: la traducción automática a medias

Este sitio es bilingüe de verdad — cada página en español tiene su par en inglés, enlazado por un mismo
identificador (`translationKey`), y un script (`i18n-check.mjs`) que **falla la build entera** si un par
se desincroniza sin avisar. Para las noticias, casi todas las fuentes publican solo en inglés. Sin un
servicio de traducción activado todavía (decisión pendiente, no técnica: falta que se apruebe cuál usar),
el sistema tiene un mecanismo de repliegue: si no hay traducción, el archivo en español se genera con el
texto en inglés tal cual, marcado con `translationOutdated: true`. El sitio muestra entonces un aviso
visible ("esta traducción puede estar desactualizada") en vez de fingir que hay una traducción real donde
no la hay.

Ese repliegue es honesto, pero no es lo mismo que una buena traducción. Publicar eso automáticamente,
sin que nadie lo vea antes, significaría que la versión en español del sitio a veces mostraría inglés sin
traducir — justo lo que este proyecto existe para evitar (bilingüe de verdad, no de escaparate).

## La decisión: modo PR-revisado, no "vamos a automatizar más adelante"

Por eso cada noticia generada por el pipeline llega como una rama y un Pull Request, no como un commit
directo. Alguien la lee, corrige la traducción si hace falta, y decide fusionarla. Es más lento que la
automatización completa — a propósito. La regla que nos pusimos: dejarlo correr así **1-2 semanas
mínimo** y solo entonces evaluar si automatizar el merge, y solo cuando haya un servicio de traducción de
verdad conectado, no antes.

## La lección, en una frase

Cuando automatizas algo que toca la calidad percibida de lo que publicas (aquí, el idioma en el que se
lee), el punto donde meter revisión humana no es "donde falla la IA" sino "donde el sistema puede
degradarse en silencio sin que nadie se entere". El aviso de traducción desactualizada ya avisa al lector;
el Pull Request evita que ese aviso sea la única defensa.
