# Contribuir a Escuela IA

Gracias por el interés. Este proyecto es abierto por diseño: código MIT, contenido CC BY-SA 4.0.

## Regla de oro: toda página nace en par

Ninguna página de contenido se crea a mano. Se genera con:

```bash
npm run new -- docs --es <slug-es> --en <slug-en> --title-es "..." --title-en "..."
```

Esto crea el par ES + EN con un `translationKey` compartido — es lo que permite que el selector de idioma
funcione y que `npm run check:i18n` pueda emparejar las traducciones. **ES es el idioma fuente**: se escribe
primero, se piensa primero; el EN se traduce después con revisión (no es traducción automática sin revisar).

Antes de abrir un PR:

```bash
npm run build          # el sitio debe compilar sin errores
npm run check:i18n      # cero páginas huérfanas o desincronizadas
npm test                 # tests de scripts
```

## Neutralidad

Este proyecto no acepta afiliados de pago ni patrocinios que condicionen el contenido. Cualquier herramienta
mencionada que sea de pago debe ir acompañada de al menos una alternativa gratuita u open-source. Los datos
volátiles (precios, límites, capacidades de modelos concretos) llevan `lastVerified` en el frontmatter con
la fecha de la última comprobación.

## Flujo de PR

1. Fork o rama (según permisos).
2. Cambios + `npm run build && npm run check:i18n && npm test` en verde.
3. PR con descripción clara de qué cambia y por qué.
4. CI debe pasar (build + i18n-check) antes de mergear.

## Contenido sensible

- Nada de datos personales o PII en el contenido.
- Contenido de sectores regulados (salud, legal, finanzas) debe incluir el disclaimer estándar: contenido
  educativo, no sustituye asesoramiento profesional.
- Noticias: solo resúmenes extractivos con enlace a la fuente, nunca reproducción de texto/imágenes con
  copyright ajeno.

## Preguntas

Abre un issue o una discusión en GitHub.
