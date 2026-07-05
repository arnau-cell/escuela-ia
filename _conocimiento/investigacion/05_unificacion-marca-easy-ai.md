# Análisis: unificación de marca y estética a Easy AI (todo el sitio)

> Fecha: 2026-07-05. Detonante: Arnau, al ver el sitio tras el pivote — la home tiene la
> estética/formato Easy AI correctos, pero la Wiki y el resto de secciones conservan la estética
> de documentación de Starlight y la marca antigua "Escuela de la IA". Decisión de Arnau: **todo
> el sitio es Easy AI** (la empresa es Easy AI); no puede convivir el concepto antiguo con el
> moderno. Este análisis alimenta el plan del ciclo de rebrand, que se consolidará junto con el
> resultado de la auditoría de RANKING-WIKI.

## 1. Diagnóstico: por qué pasó

No es un descuido de ejecución sino de especificación (otra vez): el prompt del pivote decía
explícitamente *"esto sustituye el tema Starlight SOLO en home y núcleo — el resto del sitio
(Aprende, Por sector, Recursos) sigue en Starlight, donde el formato de documentación sí
encaja"*. El constructor cumplió lo escrito. Lo que Arnau quiere ahora es un paso más: una sola
identidad (marca + estética) en TODO el sitio, aunque las secciones de documentación conserven
su estructura (sidebar, buscador).

## 2. Inventario del estado actual (verificado sobre master, 2026-07-05)

### Marca en texto — conviven las dos
- **"Escuela de la IA / AI School"**: 19 apariciones en 13 archivos de contenido (aviso legal,
  sobre el proyecto, empieza-aquí, blog de bienvenida, noticias de bienvenida y sus pares EN) +
  `astro.config.mjs` (`title` — es lo que pinta la cabecera de TODAS las páginas Starlight) +
  `README.md` + comentario en `custom.css`.
- **"Easy AI"**: 41 apariciones en 29 archivos (home ES/EN, componentes del núcleo, prompts de
  sistema, y varios contenidos que el pivote ya actualizó — por-sector, wiki, aprende en parte).
- **Infraestructura con nombre viejo**: repo GitHub `arnau-cell/escuela-ia`, worker
  `escuela-ia.arnau-cell.workers.dev`, carpeta local `C:\Work\EscuelaIA`, `name` en
  `wrangler.toml` (`escuela-ia`).

### Estética — dos sistemas sin puente
- **Easy AI (home/núcleo)**: tokens definidos inline en `NucleoBuilder.astro` (`:root`:
  `--ink #11141c`, `--lime #c6ff3d`, `--mono` stack monospace, fondo con micro-retícula
  radial-gradient, titulares monospace en mayúsculas, acentos lima). No están extraídos a un
  archivo compartido.
- **Starlight (todo lo demás)**: tema por defecto casi intacto — `src/styles/custom.css` tiene
  **1 línea** (solo un comentario). Overrides de componentes existentes: `Head`, `Footer`,
  `PageTitle`, `LanguageSelect` (funcionales, no estéticos).

## 3. Diseño de la solución (recomendación)

**Re-skin de Starlight con los tokens Easy AI, no reconstrucción.** Starlight se tematiza por
completo vía CSS custom properties (`--sl-color-accent-*`, `--sl-color-bg`, `--sl-font`,
`--sl-font-mono`...) y overrides de componentes (ya usamos 4; se pueden añadir `SiteTitle`,
`Header`). Reconstruir Aprende/Wiki/Sectores como páginas a medida tiraría a la basura sidebar,
i18n, Pagefind y la paginación arreglada en E7 — coste alto, valor bajo. Con re-skin, el usuario
pasa de la home a la Wiki y ve la misma marca, la misma paleta, la misma cabecera; solo cambia
la estructura (documentación con sidebar), que es lo esperable.

Piezas del re-skin:
1. **Tokens compartidos**: extraer el `:root` de `NucleoBuilder.astro` a
   `src/styles/easy-ai-tokens.css` (una sola fuente de verdad) e importarlo desde la home y
   desde `custom.css` de Starlight.
2. **`custom.css` real**: mapear tokens Easy AI → variables `--sl-*` (acento lima, tinta,
   fondos, headings en monospace mayúsculas, enlaces). Cuidar el modo oscuro de Starlight
   (definir las dos paletas o forzar clara — decidir; la home actual es clara).
3. **Cabecera unificada**: override del header de Starlight para replicar la de la home
   (logo `EASY AI` con el span lima, navegación monospace en mayúsculas, selector de idioma
   pill). Mismo componente compartido si es viable, mismo aspecto como mínimo.
4. **Marca en texto**: `title` de `astro.config.mjs` → "Easy AI" (ES y EN, la marca no se
   traduce), barrido de las 19 apariciones antiguas en contenido (el aviso legal y "sobre el
   proyecto" con cuidado — son textos que Arnau revisó y aprobó en E6/E7; cambiar el nombre
   los altera → **checkpoint humano de re-lectura**), README, footer, metas OG en `Head`.
5. **Verificación visual**: comparar home vs. una página de docs en navegador (Chrome), ambos
   idiomas y móvil; Lighthouse después (accesibilidad de contraste con lima sobre claro).

### Lo que NO entra en este ciclo (deliberadamente)
- **Renombrar el repo GitHub / worker / carpeta local**: renombrar el repo rompe la config de
  Giscus (usa nombre de repo) y los edit links; el subdominio workers.dev es provisional hasta
  el dominio definitivo de todos modos. Se hace todo junto cuando Arnau compre el dominio
  definitivo — un solo movimiento, no dos.
- **Cambiar la estructura de las secciones de docs** (quitar sidebar, etc.) — el formato
  documentación se queda; solo cambia la piel.

## 4. Aviso legal previo (no bloquea el re-skin, sí el lanzamiento)

`_privado/LEGAL.md` §1.7 exige **búsqueda de disponibilidad de marca (EUIPO, OEPM, DNPI) antes
de fijar el nombre definitivo**. "Easy AI" es un nombre muy genérico/descriptivo: alto riesgo de
colisiones y difícil de registrar como marca. Usarlo como display del sitio en desarrollo no
compromete nada, pero **antes del go/no-go de lanzamiento** la búsqueda tiene que estar hecha
(acción de Arnau o sesión dedicada de E9/legal, con el dominio además). Si la búsqueda sale mal,
el rebrand de texto se repite — otra razón para centralizar la marca (punto 3.4: cuantos menos
sitios hardcodeados, más barato el cambio).

## 5. Encaje con el trabajo en curso

Orden propuesto (se consolida en el plan bueno tras la auditoría de RANKING-WIKI):
1. **Auditar RANKING-WIKI** (ventana nueva, prompt ya entregado al programador).
2. **Ciclo REBRAND-EASYAI** (constructor → auditor): puntos 1-5 del diseño de arriba +
   las mejoras que salgan del veredicto del ranking, en una o dos sesiones según reservas.
3. Checkpoint de Arnau: re-lectura de legales renombrados + decisión de dominio/marca (§4).
