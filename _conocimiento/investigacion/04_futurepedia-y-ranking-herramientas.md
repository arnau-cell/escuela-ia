# Investigación: Futurepedia y diseño del ranking de herramientas de la Wiki

> Fecha: 2026-07-05 · Fuentes verificadas ese día (futurepedia.io, su página de editorial
> guidelines y la ficha de ChatGPT). Decisión de Arnau: el ranking de herramientas SÍ se
> implementa (adelanta la parte de "voto" que estaba agrupada con comunidad/v3; las reviews
> escritas siguen en v3). Además el ranking alimentará las recomendaciones del núcleo.

## 1. Cómo funciona Futurepedia (análisis 2026-07-05)

### Listado (tarjetas)
Cada tarjeta muestra: icono, nombre, descripción de una línea, **contador de
favoritos/guardados** (ej. ChatGPT: 6.560), rating de estrellas, etiquetas de categoría y
modelo de precio. ~10 categorías amplias con contador de herramientas (Business: 1.640,
Productividad: 669, Automatización: 542...).

### Ficha de herramienta
- **Rating 1-5 estrellas** con distribución visible (gráfico de barras) y nº de reviews
  ("verified users"). Volumen bajo por herramienta (ChatGPT: 9 reviews) — el rating de estrellas
  NO es su señal principal; el contador de favoritos sí.
- **Pros y contras editoriales** (equipo interno que prueba las herramientas en proyectos reales).
- **Precios por tiers** con cifras concretas.
- **Alternativas** (herramientas similares enlazadas).
- Badge "Verified", botón "Write a review", embed promocional.

### Cómo ordenan (las señales del ranking)
1. **Favoritos/guardados** de usuarios (la señal visible dominante).
2. **Trending**: mezcla de visitas + guardados + recencia.
3. **Leaderboard** por upvotes de comunidad.
4. **Curación editorial**: criterios declarados — impacto real en flujos de trabajo, usabilidad,
   seguridad/privacidad, fiabilidad (monitorizan cambios de precios y modelos). Declaran "no
   vendemos rankings, no ocultamos debilidades".

### Monetización (lo que NO vamos a copiar)
- **Enlaces de afiliado** en cada "Visit Site" (UTM + advertiser disclosure: cobran por clics).
- **Featured/sponsored placements** (visibilidad de pago).
- Venta de cursos propios (Skill Leap).

Choca de frente con nuestra regla de neutralidad (sin afiliados de pago en v1, fórmula
transparente). De Futurepedia copiamos el **formato y las señales**, no el modelo de negocio.

## 2. Qué copiamos y qué no

| Elemento de Futurepedia | ¿Lo adoptamos? | Cómo |
|---|---|---|
| Contador de "guardados/útil" por herramienta | **Sí** — señal principal | Voto anónimo "me resulta útil", 1 por visitante/herramienta/30 días |
| Orden por popularidad dentro de categoría | **Sí** | Orden por puntuación descendente en `WikiToolsList` |
| Curación editorial con criterios públicos | **Sí** (fase 2) | Puntuación editorial 0-10 con página "cómo puntuamos" |
| Rating 1-5 estrellas con reviews escritas | **No por ahora** | Requiere moderación e identidad → sigue en v3 (comunidad) |
| Pros/contras por herramienta | **Sí** (fase 2, contenido) | Campos `pros`/`cons` ES/EN en el catálogo |
| Precios por tiers y alternativas | **Ya lo tenemos** | `costDetail` + `alternativeId` + `lastVerified` |
| Trending / leaderboard | Más adelante | Necesita volumen de tráfico primero |
| Afiliados, featured, sponsored, badge de pago | **Nunca** | Rompe la neutralidad, que es el diferenciador |

## 3. Nuestra señal única: el núcleo

Futurepedia no tiene nada equivalente: nuestro núcleo conversacional genera planes reales y
**ya resuelve las herramientas recomendadas contra el catálogo en código**
(`src/pages/api/nucleo/chat.ts`, `resolvedPlatforms`). Cada plan terminado (`done: true`) es una
"recomendación real emitida" — un contador agregado por herramienta, sin ningún dato del
usuario, es una señal de relevancia que ningún directorio tiene.

## 4. Diseño propuesto (sobre lo ya construido)

### Puntuación (fórmula pública, transparente)

```
score(tool) = votos_utiles                      (señal comunidad, desde R1)
            + w_n * recomendaciones_nucleo      (señal propia, desde R2)
            + w_e * puntuacion_editorial        (señal curada, desde R3)
```

Pesos iniciales sugeridos: `w_n = 0.5`, `w_e = 2` (ajustables; se publican en la página
"cómo funciona el ranking"). Mientras solo exista la señal de votos, score = votos. El orden
alfabético queda como desempate estable.

### Voto anónimo sin sistema de identidad
- Botón "¿Te resulta útil?" en cada tarjeta de la Wiki.
- Dedup sin cuentas: HMAC(ip, salt secreto) + toolId en KV con TTL de 30 días — mismo patrón ya
  probado del rate-limit (`src/lib/rate-limit.js`). No se guarda la IP en claro ni ningún dato
  personal persistente.
- Anti-abuso: límite diario de votos por IP (rate-limit existente) + Cloudflare Turnstile
  invisible como opción si aparece abuso real (no de inicio).
- Esto **desbloquea** lo que en el pivote se había pospuesto "por requerir identidad": el voto
  anónimo no la requiere; solo las reviews escritas la requieren (v3).

### Almacenamiento
- **D1** (SQLite de Cloudflare, tier gratuito) para votos y agregados: tabla `votes`
  (tool_id, day, count) o agregado directo `tool_stats` (tool_id, votes, nucleo_recs,
  editorial_score, updated_at). KV no sirve como contador principal (límite ~1 escritura/seg
  por clave y consistencia eventual); sí sirve para el dedup con TTL.
- El sitio sigue estático: los agregados se sirven por `GET /api/wiki/ranking` (JSON cacheado
  con `Cache-Control: s-maxage=300`) y `WikiToolsList` los pide en cliente con **degradación
  elegante** a orden alfabético si el fetch falla.

### Integración con el núcleo (la parte que pide Arnau: "base para saber qué apps se recomiendan a cada cliente")
1. `chat.ts` lee los agregados de D1 y añade `communityScore` a cada entrada del catálogo que
   embebe en el prompt de sistema, con la instrucción: *"cuando varias herramientas encajen igual
   de bien para la necesidad del usuario, menciona primero la mejor valorada por la comunidad —
   pero el encaje con la necesidad manda, y la alternativa open-source se menciona siempre"*.
   El ranking desempata; nunca sustituye el criterio de encaje ni la neutralidad.
2. Al cerrar un plan (`done: true`), `chat.ts` incrementa `nucleo_recs` de cada herramienta de
   `resolvedPlatforms` (agregado anónimo, sin contenido del plan).
3. Los planes generados quedan así retroalimentando el ranking, y el ranking a su vez informa
   los planes siguientes.

### Requisito de contenido
Con 12 herramientas el ranking casi no dice nada. Ampliar `platforms.json` a ~40-60 entradas
(mismo schema + `description {es,en}` opcional; disciplina `lastVerified` intacta) es parte del
plan (fase R3, trabajo de contenido).

### Privacidad / legal
- Voto anónimo con IP seudonimizada (HMAC con salt secreto) y TTL 30 días → actualizar la
  política de privacidad on-site y dejar nota en `_privado/LEGAL.md` (GDPR: minimización, sin
  perfil de usuario). No afecta al AI Act (el ranking no es un sistema de IA).

## 5. Fases para la sesión constructora

| Fase | Alcance | Complejidad |
|---|---|---|
| R1 | D1 + `POST /api/wiki/vote` + `GET /api/wiki/ranking` + botón de voto + orden por votos + página "cómo funciona el ranking" | Media |
| R2 | Contador de recomendaciones del núcleo + blend del score + score en el prompt del núcleo | Baja |
| R3 | Ampliar catálogo a 40-60 herramientas + puntuación editorial con criterios públicos + pros/contras | Media (contenido) |
| v3 (sin cambios) | Reviews escritas, trending, leaderboard — requieren identidad/volumen | Alta, diferida |

Prompt constructor listo en `_privado/protocolo/prompts/RANKING-WIKI-constructor.md`.

Fuentes: [futurepedia.io](https://www.futurepedia.io/) · [Editorial guidelines](https://www.futurepedia.io/editorial-guidelines) · [Ficha ChatGPT](https://www.futurepedia.io/tool/chatgpt) · [Comparativa de directorios por tráfico](https://aiblewmymind.substack.com/p/how-to-find-the-right-ai-tools-for) · [Perfil/guía de listado](https://www.mypresences.com/service/futurepedia/)
