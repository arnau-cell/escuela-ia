---
title: "Ollama: correr modelos de IA en tu ordenador, probado"
description: "Instalamos Ollama, bajamos un par de modelos y probamos lo que de verdad importa: qué necesitas, qué cuesta y cuándo tiene sentido frente a usar la nube."
translationKey: reviews/ollama-modelos-en-local
sourceUpdated: 2026-07-03
publishedAt: 2026-07-03
lastVerified: 2026-07-03
category: reviews
author: Arnau
lang: es
draft: false
---

## Qué es

[Ollama](https://ollama.com) es una herramienta gratuita y de código abierto para descargar y ejecutar
modelos de lenguaje directamente en tu propio ordenador — sin enviar tus datos a ningún servidor externo,
sin cuenta obligatoria y sin coste. Es probablemente la puerta de entrada más simple para pasar de "usar
un chatbot en el navegador" a "tener un modelo corriendo en tu máquina".

## Qué hace bien

- **Instalación real de un solo comando.** En Mac/Linux/Windows, instalas y con `ollama run llama3.2`
  (o el modelo que elijas) ya tienes un modelo descargado y respondiendo en la terminal.
- **Elige la cuantización por ti.** Desde 2026, Ollama detecta tu hardware y selecciona automáticamente
  el nivel de cuantización (por defecto Q4_K_M) para que modelos grandes corran razonablemente incluso
  en portátiles con 8 GB de RAM — antes había que elegir esto a mano.
- **Soporte de visión real.** Modelos como Qwen-VL, Llama 3.2 Vision o la familia Phi-4 multimodal
  corren con el mismo comando `ollama run` que los modelos solo de texto, sin instalar adaptadores aparte.
- **Compatible con la API de OpenAI.** Tiene *tool calling* y *structured outputs* (JSON Schema) con el
  mismo formato que la API de OpenAI — si ya tienes código escrito contra esa API, migrar a un modelo
  local es, en muchos casos, cambiar solo la URL base.

## Qué falta o cuesta

- El software local es gratis y así seguirá (es su propuesta central), pero **Ollama Cloud** —su servicio
  de inferencia en la nube, para cuando tu hardware no da para modelos grandes— es de pago: el plan Pro
  cuesta 20 USD/mes y el plan Max, 100 USD/mes (verificado en
  [ollama.com/pricing](https://ollama.com/pricing), 2026-07-03). No hace falta para lo básico: solo entra
  en juego si quieres modelos que tu propio ordenador no puede mover.
- Necesitas *algo* de conocimiento de terminal — no hay una interfaz gráfica oficial nativa (aunque
  existen proyectos de terceros que le ponen una capa visual encima).
- La calidad de las respuestas depende del modelo que elijas, no de Ollama en sí — Ollama es el motor,
  no el modelo.

## Cuándo tiene sentido usarlo (y cuándo no)

Tiene sentido si: quieres privacidad real (nada sale de tu máquina), no quieres pagar por token, o estás
aprendiendo cómo funcionan los modelos por dentro. Ver también nuestra página de conceptos
[local vs. nube](/aprende/conceptos/local-vs-nube/) para la comparación completa de cuándo conviene cada
opción.

No tiene tanto sentido si: tu ordenador es modesto y necesitas los modelos más potentes del mercado (esos
siguen siendo más grandes de lo que un portátil normal puede mover bien), o si prefieres no complicarte
con la terminal.

## Veredicto

Gratis, de código abierto, y sorprendentemente fácil de instalar para lo que hace. Si tienes curiosidad
por probar un modelo de IA sin depender de ningún servicio externo, es el punto de partida que
recomendamos primero.

*Herramienta mencionada sin patrocinio ni afiliación — política de neutralidad de este proyecto en
[Sobre el proyecto](/recursos/sobre-el-proyecto/).*
