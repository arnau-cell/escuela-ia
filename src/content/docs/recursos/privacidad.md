---
title: "Política de privacidad"
description: "Qué datos trata este sitio (hoy: prácticamente ninguno), con qué base legal, y qué hace Giscus con los comentarios."
translationKey: recursos/privacidad
sourceUpdated: 2026-07-05
sidebar:
  order: 5
---

## Resumen

Este sitio es sobre todo estático; solo un puñado de rutas `/api/**` corren bajo demanda (el núcleo
conversacional, las preguntas sobre la Wiki y el voto de herramientas). No requiere registro para
consultarlo y **no incluye ningún formulario de contacto ni captura de datos personales
identificables**. El voto de herramientas trata tu dirección IP de forma seudonimizada y temporal
(ver más abajo) — es el único tratamiento de datos algo más que trivial que existe hoy, y el
tratamiento en su conjunto sigue siendo, por diseño, mínimo.

## Qué se trata y con qué base legal

| Dato | ¿Se trata hoy? | Detalle |
|---|---|---|
| Navegación (páginas vistas, país aproximado) | Si el hosting final (Cloudflare Pages) tiene la analítica conectada | [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) o Umami, ambos configurados para no usar cookies de rastreo ni fingerprinting — ver la [política de cookies](/recursos/cookies/). Base legal: interés legítimo (medición agregada y anónima de audiencia). |
| Voto de herramientas ("¿te resulta útil?") en la [Wiki](/wiki-ia/herramientas/) | Sí | Tu IP se transforma con HMAC (firma criptográfica con una clave secreta del servidor) antes de guardarse — nunca se guarda en claro. Esa huella se usa solo para evitar votos repetidos por la misma persona en la misma herramienta, se borra automáticamente a los 30 días, y no se cruza con ningún otro dato ni construye un perfil. Detalle completo en [Cómo funciona el ranking](/wiki-ia/como-funciona-el-ranking/). Base legal: interés legítimo (integridad de un contador público, medida mínima y proporcionada). |
| Núcleo conversacional y preguntas de la Wiki (IA generativa) | Sí, de forma efímera | Tu mensaje se envía a la API de Anthropic para generar la respuesta; no se guarda en ningún registro ni base de datos propia de este sitio más allá del límite de uso diario (contador por IP y día, sin contenido de la conversación). Aviso de transparencia de IA (art. 50 del Reglamento de IA de la UE) visible en ambas superficies. |
| Comentarios del blog | No — Giscus está preparado pero no activo todavía (pendiente de que se habilite GitHub Discussions en el repositorio) | Cuando se active: los comentarios los gestiona **GitHub Discussions**, bajo la cuenta de GitHub de quien comenta. Este sitio no almacena esos comentarios ni los datos asociados — los gestiona GitHub según su propia [política de privacidad](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement). Base legal: consentimiento (inicias sesión en GitHub voluntariamente para comentar). |
| Lista de espera / newsletter | No — todavía no existe en el sitio | Se documentará aquí con el proveedor exacto y su base legal antes de publicarse. |
| Formularios de contacto | No — el contacto es vía Issues de GitHub, bajo la cuenta de GitHub de quien escribe | Gestionado por GitHub, no por este sitio. |

## Quién es el responsable del tratamiento

El titular del proyecto — ver [aviso legal](/recursos/aviso-legal/) para los datos de contacto y
titularidad. Para cualquier consulta sobre privacidad, usa el mismo canal de contacto.

## Tus derechos

Sobre cualquier dato que GitHub trate en tu nombre (comentarios, Issues), tus derechos de acceso,
rectificación, supresión y demás derechos del RGPD se ejercen directamente ante GitHub, ya que es quien
almacena y procesa esos datos. Este sitio no mantiene una base de datos propia de usuarios sobre la que
puedas ejercer esos derechos, porque no existe tal base de datos.

## Cambios

Esta política se actualizará en cuanto el sitio incorpore cualquier tratamiento de datos nuevo (por
ejemplo, una lista de espera con email). El campo `sourceUpdated` de esta página refleja la fecha de la
última revisión.
