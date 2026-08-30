# Perfilador de Inversionista — Suitability (Tarea 1)

Herramienta de perfilamiento de inversionistas para "Administración de
Portafolio Avanzada". Cuestionario propio del equipo (`Questionario
Suitability.pdf`), digitalizado y con un motor de puntaje transparente.

`atlaz-investment/` (carpeta hermana) se usó solo como referencia técnica
(stack, patrón de UI, patrón de filtros de seguridad) — el contenido de las
preguntas de este proyecto es 100% el del equipo, con los ajustes descritos
más abajo.

## Cómo correr

```bash
npm install   # si node_modules no vino copiado o quedó desactualizado
npm run dev
```

## Cambios respecto al cuestionario original del equipo

El original (`Questionario Suitability.pdf`) tenía 11 preguntas sin sistema
de puntaje. Se mantuvieron 10 de esas 11 preguntas prácticamente intactas
(ver `original: true` en `src/data/questions.js`), y se hicieron dos ajustes:

1. **P9 reescrita.** "El riesgo representa para ti: Amenaza / Inseguridad /
   Oportunidad" no cumplía con el requisito del instructivo de opciones
   mutuamente excluyentes (amenaza e inseguridad son casi sinónimos). Se
   reemplazó por una escala ordinal de actitud (evitar siempre / asumir con
   cautela / buscar activamente), misma dimensión (Tolerancia al riesgo).
2. **P12 agregada.** La dimensión obligatoria "Sesgos de comportamiento" no
   estaba realmente operacionalizada en el original. Se agregó la Pregunta
   de referencia 4 del instructivo (teoría de prospectos, Kahneman & Tversky
   / Carrie, Pan & Statman, 2012).

Además se agregaron tres preguntas que **no puntúan** en el perfil de riesgo,
para tres capas de análisis/filtro adicionales (ver más abajo): estilo de
decisión (activo/pasivo), circunstancias vitales/vulnerabilidad, y activos
digitales/FOMO.

Por último, se sumaron dos preguntas de **alfabetización financiera objetiva**
(P5b, P5c — Lusardi & Mitchell, 2011, la referencia internacional en este
tema) para reforzar la dimensión "Conocimiento", que antes dependía solo de
autoevaluación y experiencia declarada (ambas subjetivas).

## Dimensiones y pesos

| Dimensión | Peso | Preguntas |
|---|---|---|
| Tolerancia al riesgo (psicológica) | 25% | P6, P7, P8, P9 |
| Capacidad de riesgo (financiera) | 25% | P2, P3 |
| Situación financiera y flujos | 15% | P10, P11 |
| Conocimiento y experiencia financiera | 15% | P5, P5b, P5c |
| Horizonte de inversión | 10% | P1 |
| Sesgos de comportamiento | 10% | P12 |

HHI de concentración de pesos = 0.19 (por debajo del umbral de 0.25 que la
CMF identifica como "concentración alta" en cuestionarios de AGF chilenas).

P4 (objetivo de inversión) se muestra como contexto en el resultado pero no
puntúa: mezclar el objetivo declarado con la tolerancia revelada distorsiona
esta última.

## Puntaje y perfiles

Cada opción tiene un puntaje (1 a 3 o 1 a 4 según la pregunta), normalizado a
una escala 0-1 y promediado dentro de cada dimensión. El puntaje compuesto
final (0-100) es la suma ponderada de los puntajes de dimensión, y se mapea
a los 4 perfiles obligatorios en bandas parejas de 25 puntos:

- 0–25: Conservador
- 26–50: Moderado
- 51–75: Moderado-Agresivo
- 76–100: Agresivo

## Filtros de seguridad (downgrades)

Después del puntaje compuesto se aplican reglas que solo pueden **bajar**
el perfil, nunca subirlo (ver `src/lib/scoring.js`):

1. Horizonte < 1 año → tope Conservador (CMF / MiFID II).
2. Sin fondo de emergencia → tope Moderado (FINRA / bancos chilenos).
3. Conocimiento financiero nulo → tope Moderado (MiFID II / CMF).
4. Evento vital reciente (P14) → tope Moderado (Banks et al., 2019; G20/OECD, 2022).
5. Tolerancia alta + aversión a la pérdida alta (mismatch) → un escalón menos
   (Van Dolder & Vandenbroucke, 2024).
6. Inversión impulsiva en activos digitales/FOMO (P15) → tope Moderado
   (CFA Institute, 2023).

## Capas adicionales (más allá de lo mínimo pedido)

- **Chequeo de consistencia (IRV)**: detecta respuestas "en línea recta" que
  sugieren baja confiabilidad (Hartnett, Gerrans y Faff, 2019).
- **Tipo de Inversionista Conductual (Pompian, 2008)**: capa secundaria e
  informativa (Passive Preserver / Friendly Follower / Independent
  Individualist / Active Accumulator), vista en la Sesión 2 del curso. No
  reemplaza el perfil de riesgo obligatorio.

## Persistencia (Supabase opcional)

Si no se configuran las variables de entorno, todo se guarda en
`localStorage`. Para activar Supabase (registro y trazabilidad de las
respuestas, ver `src/lib/storage.js`):

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Ejecutar el SQL que está comentado en `.env.example` en el SQL editor de
   Supabase (crea la tabla `submissions` con RLS activado, solo-inserción
   desde el navegador).
3. Copiar `.env.example` a `.env` y completar `VITE_SUPABASE_URL` /
   `VITE_SUPABASE_ANON_KEY` (Project Settings → API → Publishable key).

El cliente (`@supabase/supabase-js`) ya viene como dependencia del proyecto;
no hace falta instalar nada aparte. `storage.js` detecta automáticamente si
las variables de entorno están presentes.

## Deploy en Vercel

Proyecto Vite estándar: conectar el repo en vercel.com, framework preset
"Vite", sin configuración adicional. Si se usa Supabase, agregar las mismas
variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) en
Project Settings → Environment Variables.
