# Contexto del proyecto

Herramienta de perfilamiento de inversionistas (cuestionario de *suitability*)
para el ramo **Administración de Portafolio Avanzada** (Escuela de Postgrado,
Universidad de Chile). Es la **Tarea 1** de un trabajo en dos etapas: esta
entrega solo tiene que perfilar al inversionista (Conservador / Moderado /
Moderado-Agresivo / Agresivo); la **Tarea 2** (aún no asignada formalmente)
pedirá además recomendar un portafolio según el perfil obtenido — el código
ya está pensado para esa extensión (ver "Lo que probablemente cambie" más
abajo).

El cuestionario de base (`Questionario Suitability.pdf`, en la carpeta
padre) es **autoría del equipo**, no un ejemplo genérico. `atlaz-investment/`
(carpeta hermana en el mismo repo padre, no en este) es de otro grupo y se
usó solo como referencia de stack/patrones — nunca copiar contenido de
preguntas desde ahí sin que el equipo lo pida explícitamente.

Antes de tocar preguntas, pesos o filtros, lee `README.md` (documenta
dimensiones, pesos, HHI, bandas de puntaje y los 6 filtros de seguridad) —
este archivo no repite ese contenido, se enfoca en cómo trabajar en el
proyecto.

## Estado de la infraestructura

- **GitHub**: `https://github.com/vicecontre/suitability-app` (rama `main`).
  Dueño de la cuenta: vicecontre (vicecontre@fen.uchile.cl).
- **Vercel**: proyecto `suitability-app` bajo "vicecontre's projects"
  (plan Hobby), conectado por GitHub App al repo de arriba. Auto-deploya en
  cada push a `main`. URL de producción: https://suitability-app-tau.vercel.app/
- **Supabase**: proyecto en la organización "vicecontre's Org" (plan Free),
  región `us-east-1`. Guarda cada respuesta en la tabla `submissions`
  (JSON flexible — agregar/quitar preguntas nunca requiere migrar el
  esquema). Credenciales en `.env` (gitignored, no está en el repo).

## Cómo empezar en un PC nuevo

1. **Verifica que exista Node/npm** (`node --version`). En al menos un PC de
   este equipo (uno compartido, usuario "biblioteca") **no hay Node
   instalado** y tampoco hay forma de instalarlo desde ahí — en ese caso no
   se puede correr `npm install` / `npm run dev` / `npm run build`
   localmente. Eso no bloquea el trabajo: se puede seguir editando código y
   dejar que Vercel compile en la nube (ver "Verificar cambios sin Node").
2. `git clone https://github.com/vicecontre/suitability-app.git`
3. Si hay Node: `npm install && npm run dev`.
4. **Primer push desde un PC nuevo**: el primer `git push` va a abrir una
   ventana del navegador pidiendo login de GitHub (Git Credential Manager).
   Si en vez de eso da `remote: Repository not found` sin pedir login,
   probablemente ya hay credenciales cacheadas de OTRA cuenta de GitHub en
   ese Windows (pasó una vez en un PC compartido). Arreglo rápido, sin
   borrar nada: `git remote set-url origin https://vicecontre@github.com/vicecontre/suitability-app.git`
   y reintentar — eso fuerza el prompt de login con la cuenta correcta.
5. **Variables de entorno**: copiar `.env.example` a `.env` y pedirle los
   valores reales al dueño de la cuenta de Supabase (no están en el repo a
   propósito). Sin `.env`, la app funciona igual pero guarda en
   `localStorage` en vez de Supabase — no rompe nada.

## Verificar cambios sin Node disponible

Si no hay Node en la máquina, no se puede correr el dev server ni el build
localmente. Dos formas de verificar cambios igual:

1. **Dejar que Vercel compile**: hacer push y revisar el log del deployment
   en el dashboard de Vercel (tarda ~1 minuto). Es la fuente de verdad para
   saber si el build realmente funciona.
2. **Preview espejo en Artifact**: para revisar visualmente el flujo de
   preguntas/resultado sin depender de Vercel, existe un archivo HTML
   independiente (vanilla JS, sin React/Vite) que replica a mano la lógica
   de `src/data/questions.js` y `src/lib/scoring.js`, publicado como
   Artifact de Claude. Si vas a hacer un cambio grande en preguntas o en el
   motor de puntaje, conviene mantener ese espejo actualizado y pedirle a
   Claude que lo regenere junto con el cambio real — así se puede mostrar
   el resultado al equipo antes de esperar un deploy.

## Límites de Vercel/Supabase a tener en cuenta

- **Vercel Hobby** es de un solo dueño: otros compañeros no necesitan cuenta
  de Vercel para que esto funcione. Solo necesitan ser **collaborators del
  repo de GitHub** (gratis e ilimitado) — cualquier push a `main` redeploya
  solo, sin que nadie más toque Vercel. Sumar gente al dashboard de Vercel
  mismo normalmente requiere plan pago (no lo necesitamos).
- **Nunca** poner la `service_role` / `secret key` de Supabase en una
  variable `VITE_...` — esas terminan visibles en el navegador de
  cualquiera. Solo la `anon` / `publishable key` va en el frontend.
- El import de `@supabase/supabase-js` debe ser **estático** (`import { createClient } from '@supabase/supabase-js'` arriba del archivo), nunca dinámico
  con un paquete que podría no estar instalado — un `import()` dinámico de
  un paquete faltante rompe el build de producción de Vite/Rollup aunque
  Supabase nunca se llegue a usar en tiempo de ejecución (nos pasó una vez,
  ver el commit "Corrige build: @supabase/supabase-js como dependencia
  real").
- `package-lock.json` fue copiado desde otro proyecto (`atlaz-investment`) y
  parcheado a mano para el nombre/versión — si alguna vez da problemas de
  "lockfile out of sync", lo más simple es borrarlo y dejar que `npm
  install` lo regenere (requiere Node disponible en ese momento).

## Documento de diseño (Entregable 2)

La fuente de verdad del documento de diseño es **`docs/documento-diseno.tex`**
(LaTeX, pensado para Overleaf) — **no** un artifact ni ninguna página
generada por Claude fuera del repo. Ese `.tex` es lo que se entrega
(compilado a PDF), y debe mantenerse sincronizado a mano cada vez que
cambie algo en `src/data/questions.js` o `src/lib/scoring.js`: preguntas,
puntajes, pesos de dimensión, filtros de seguridad o capas adicionales.

Cómo trabajarlo:

1. Copiar el contenido de `docs/documento-diseno.tex` a un proyecto de
   Overleaf (Overleaf → New Project → Upload Project, o pegar el contenido
   en un proyecto en blanco) y compilar con pdfLaTeX.
2. Nadie en este equipo puede compilar LaTeX localmente sin instalar un
   toolchain de TeX — Overleaf es la vía más simple, no requiere instalar
   nada.
3. Si Claude edita este archivo, debe hacerlo **directamente en el
   `.tex`** (no crear una versión HTML/Artifact aparte) y avisar
   explícitamente qué sección cambió, para que se pueda volver a compilar
   en Overleaf y revisar el PDF resultante.
4. Antes de dar por cerrado el documento, verificar que compile sin
   errores en Overleaf al menos una vez — nadie en este hilo lo ha
   compilado todavía, así que puede tener errores de sintaxis LaTeX no
   detectados (paquetes: `booktabs`, `longtable`, `makecell`,
   `xcolor[table]`, `mdframed`, `hyperref`, `babel[spanish]` — todos
   estándar en la distribución completa de Overleaf).

## Lo que probablemente cambie (y cómo no romper nada al cambiarlo)

Este es un trabajo de curso en desarrollo activo; varias cosas están
deliberadamente abiertas:

- **Redacción de preguntas y pesos**: el profesor/ayudante pueden pedir
  ajustes tras el feedback de diseño (Clase 5 del curso). Cada pregunta en
  `questions.js` tiene un campo `source` con su cita — si cambias una
  pregunta, actualiza también ese campo, porque el documento de diseño se
  arma a partir de esos datos. Después de tocar `DIMENSIONS`, verifica que
  los pesos sigan sumando 1.0 y que el HHI (`sum(w_i^2)`) siga bajo 0.25.
- **Nuevas dimensiones candidatas, evaluadas pero no agregadas todavía**:
  preferencias ESG/sostenibilidad (Meyer, Tanner & Sugandhita, 2025) — el
  equipo decidió no incluirla en la Tarea 1 porque el propio paper de la CMF
  aclara que ESG no debe mezclarse con el perfil de riesgo, así que iría
  como pregunta de contexto (igual que P4 objetivo), probablemente más
  relevante para la Tarea 2 (filtraría qué fondos mostrar).
- **Tarea 2 (recomendación de portafolio)**: cuando se asigne, el punto de
  entrada limpio es `evaluateSuitability(answers).finalProfile` (en
  `src/lib/scoring.js`) — ya devuelve uno de los 4 perfiles exactos. No
  hace falta tocar el motor de puntaje para agregar la recomendación, solo
  mapear `finalProfile` (y opcionalmente `bit.key` o las respuestas de
  objetivo/ESG) a una sugerencia de activos.
- **Filtros de seguridad**: si se agrega un filtro nuevo, debe poder solo
  *bajar* el perfil calculado, nunca subirlo (mismo patrón que los 6
  filtros existentes en `applySafetyFilters`), y necesita su propia cita.
- **Supabase**: el esquema de la tabla `submissions` es intencionalmente
  genérico (JSON), así que agregar/quitar preguntas no debería requerir
  tocar el SQL. Si algún día se necesita una columna real (no dentro del
  JSON), eso sí es manual en el SQL Editor de Supabase — no está
  versionado con git.
