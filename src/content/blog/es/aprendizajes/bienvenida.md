---
title: "Por qué existe Escuela IA"
description: "Un sitio gratuito y neutral para entender la IA de cero a técnico, porque los referentes que existen son o directorios, o solo noticias, o de pago."
translationKey: aprendizajes/bienvenida
sourceUpdated: 2026-07-03
publishedAt: 2026-07-02
category: aprendizajes
author: Arnau
lang: es
draft: false
---

Este proyecto empezó por una frustración muy concreta: lo que más cuesta de la IA no es usarla, es
**entender cómo encaja todo**. Qué es cada cosa, para qué sirve, cuándo usar una herramienta u otra,
dónde queda lo que instalas, qué significa "correr en local", qué es una base de datos, cómo se pone una
app online, qué ordenador hace falta — y encima mantenerse al día de lo que cambia cada semana.

## Lo que buscamos y no encontramos

Miramos los referentes que ya existen: directorios-embudo que listan mil herramientas sin explicar cuándo
usar cada una, boletines que son solo noticias sin pedagogía, recursos muy técnicos que asumen que ya
sabes programar, o servicios de pago que cobran por lo que debería ser gratuito para aprender. Ninguno
era, a la vez, neutral, bilingüe, de cero a avanzado, organizado por sector profesional, y con una forma
de decirte "esto es lo que te conviene instalar a ti, con tu ordenador y tu presupuesto".

## Qué es Escuela IA

Un sitio gratuito, neutral y bilingüe (español/inglés) para entender la inteligencia artificial de cero a
nivel técnico. No es un negocio — es un proyecto para ayudar, a coste mínimo. Eso significa, en la
práctica:

- **Sin afiliados de pago.** Cuando mencionamos una herramienta, siempre buscamos alternativas
  abiertas o gratuitas junto a ella — no cobramos por aparecer ni por ser recomendados.
- **Con fecha de verificación.** Los precios y características cambian; cada dato volátil lleva un campo
  `lastVerified` para que sepas cuándo se comprobó por última vez.
- **De verdad bilingüe.** No es una traducción automática de escaparate: cada página en español tiene su
  par real en inglés, y un sistema propio (`i18n-check`) impide publicar un par desincronizado sin avisar.
- **Con una ruta personalizada.** La sección [Monta tu setup](/hazlo/monta-tu-setup/) te recomienda qué
  instalar según tu objetivo, tu hardware y tu presupuesto — sin IA de por medio en esa recomendación,
  solo reglas claras y auditables.

## Cómo se construye

En abierto: el código es MIT y el contenido educativo es CC BY-SA 4.0, ambos en el
[repositorio de GitHub](https://github.com/arnau-cell/escuela-ia). Cada fase se construye, se audita en
una sesión separada, y se corrige antes de avanzar — de hecho, la entrada
[cómo construimos el pipeline de noticias](/comparte/como-lo-hice/pipeline-noticias-n8n/) cuenta un
ejemplo real de ese proceso, bugs incluidos.

Si esto te resulta útil, o si algo está mal explicado, [abre un Issue](https://github.com/arnau-cell/escuela-ia/issues)
— cualquier corrección es bienvenida.
