// Cuestionario base: preguntas P1-P11 y P4 son las originales del equipo
// (Questionario Suitability.pdf), preservando su redacción, orden de
// dimensión y casi todas sus opciones tal cual. Cambios respecto al
// original, ambos justificados en el documento de diseño:
//
//   1. P9 se reescribió: "El riesgo representa para ti: Amenaza /
//      Inseguridad / Oportunidad" tenía un problema de exclusividad mutua
//      (amenaza e inseguridad son casi sinónimos). Se reemplazó por una
//      escala ordinal de actitud frente al riesgo, manteniendo la misma
//      dimensión (Tolerancia al riesgo).
//   2. Se agregó P12: la dimensión "Sesgos de comportamiento" del
//      instructivo no estaba realmente operacionalizada (P9 original era
//      actitud general, no un sesgo conductual concreto). P12 es la
//      Pregunta de referencia 4 del instructivo (teoría de prospectos,
//      Kahneman & Tversky; Carrie, Pan & Statman, 2012), y por sí sola
//      cubre esa dimensión obligatoria.
//
// Además de esos dos cambios, se agregaron tres preguntas extra a partir de
// literatura académica (no exigidas por el instructivo, pero justificadas):
//   3. P5b y P5c: alfabetización financiera objetiva ("Big Three" de
//      Lusardi & Mitchell, 2011) — refuerzan "Conocimiento" con preguntas de
//      respuesta correcta verificable, en vez de solo autoevaluación.
//   4. P15 (activos digitales/FOMO, ver más abajo): CFA Institute (2023).
//
// Pesos por dimensión (suman 1.0). HHI = sum(w_i^2) = 0.19, por debajo del
// umbral de 0.25 que la CMF identifica como "concentración alta" entre
// cuestionarios de AGF chilenas (Álvarez y Caamaño, 2026).
export const DIMENSIONS = {
  toleranciaRiesgo: {
    id: 'toleranciaRiesgo',
    label: 'Tolerancia al riesgo (psicológica)',
    weight: 0.25,
  },
  capacidadRiesgo: {
    id: 'capacidadRiesgo',
    label: 'Capacidad de riesgo (financiera)',
    weight: 0.25,
  },
  situacionFinanciera: {
    id: 'situacionFinanciera',
    label: 'Situación financiera y flujos',
    weight: 0.15,
  },
  conocimiento: {
    id: 'conocimiento',
    label: 'Conocimiento y experiencia financiera',
    weight: 0.15,
  },
  horizonte: {
    id: 'horizonte',
    label: 'Horizonte de inversión',
    weight: 0.10,
  },
  sesgos: {
    id: 'sesgos',
    label: 'Sesgos de comportamiento',
    weight: 0.10,
  },
};

// Preguntas que puntúan y entran al puntaje compuesto (0-100).
export const SCORED_QUESTIONS = [
  {
    id: 'p1_horizonte',
    dimension: 'horizonte',
    referenceId: 2,
    original: true,
    text: '¿A qué plazo está dispuesto a invertir? ¿Cuándo necesitaría disponer de ese dinero?',
    source: 'MiFID II / CMF — horizonte real del cliente.',
    options: [
      { letter: 'a', text: 'Menos de 1 año', points: 1 },
      { letter: 'b', text: 'De 1 a 5 años', points: 2 },
      { letter: 'c', text: '5 o más años', points: 3 },
    ],
  },
  {
    id: 'p2_patrimonio',
    dimension: 'capacidadRiesgo',
    referenceId: 3,
    original: true,
    text: '¿Qué porcentaje de tus ahorros o patrimonio representa tu monto de inversión?',
    source: 'FINRA / bancos chilenos — impacto relativo de una eventual pérdida sobre el patrimonio.',
    options: [
      { letter: 'a', text: 'Menos del 20%', points: 3 },
      { letter: 'b', text: 'Entre el 20% y el 50%', points: 2 },
      { letter: 'c', text: 'Más del 50%', points: 1 },
    ],
  },
  {
    id: 'p3_ingresos',
    dimension: 'capacidadRiesgo',
    original: true,
    text: '¿Qué porcentaje de tus ingresos representa tu monto de inversión?',
    source: 'Capacidad de riesgo medida por flujo (ingresos), complementaria a la medida por stock (patrimonio).',
    options: [
      { letter: 'a', text: 'Menos del 20%', points: 3 },
      { letter: 'b', text: 'Entre el 20% y el 50%', points: 2 },
      { letter: 'c', text: 'Más del 50%', points: 1 },
    ],
  },
  {
    id: 'p5_conocimiento',
    dimension: 'conocimiento',
    referenceId: 5,
    original: true,
    text: '¿Tiene experiencia o conocimiento invirtiendo en fondos mutuos o acciones?',
    source: 'MiFID II / CMF — conocimiento y experiencia revelada, requerida regulatoriamente.',
    options: [
      { letter: 'a', text: 'No, nunca he invertido ni tengo conocimientos', points: 1 },
      { letter: 'b', text: 'No he invertido, pero sí tengo conocimientos', points: 2 },
      { letter: 'c', text: 'He invertido, pero asesorado por un experto', points: 3 },
      { letter: 'd', text: 'Tengo conocimientos e invierto activamente', points: 4 },
    ],
  },
  {
    id: 'p5b_literacy_interes',
    dimension: 'conocimiento',
    added: true,
    text: 'Suponga que deposita $100.000 en una cuenta de ahorro que paga 2% de interés al año, y no retira ni deposita nada más. Después de 5 años, ¿cuánto cree que tendrá en la cuenta?',
    source: 'Lusardi & Mitchell (2011), "Financial Literacy around the World" (NBER) — primera de las "Big Three", el estándar internacional de alfabetización financiera (usado por la OCDE). A diferencia de P5 (autoevaluación + experiencia), esta tiene una respuesta objetivamente correcta.',
    options: [
      { letter: 'a', text: 'Más de $110.000', points: 4 },
      { letter: 'b', text: 'Exactamente $110.000', points: 1 },
      { letter: 'c', text: 'Menos de $110.000', points: 1 },
      { letter: 'd', text: 'No estoy seguro/a', points: 1 },
    ],
  },
  {
    id: 'p5c_literacy_inflacion',
    dimension: 'conocimiento',
    added: true,
    text: 'Suponga que el interés de su cuenta de ahorro es 1% al año y la inflación es 2% al año. Después de 1 año, con el dinero de esa cuenta, ¿podría comprar...?',
    source: 'Lusardi & Mitchell (2011) — segunda de las "Big Three" (comprensión de inflación / poder adquisitivo).',
    options: [
      { letter: 'a', text: 'Más de lo que puede comprar hoy', points: 1 },
      { letter: 'b', text: 'Exactamente lo mismo que hoy', points: 1 },
      { letter: 'c', text: 'Menos de lo que puede comprar hoy', points: 4 },
      { letter: 'd', text: 'No estoy seguro/a', points: 1 },
    ],
  },
  {
    id: 'p6_estilo',
    dimension: 'toleranciaRiesgo',
    original: true,
    text: '¿Qué situación te identifica más respecto a las inversiones?',
    source: 'Preferencia declarada de asignación de activos (estilo de tolerancia al riesgo).',
    options: [
      { letter: 'a', text: 'Invertir todo mi dinero en instrumentos de bajo riesgo y tener una ganancia acotada', points: 1 },
      { letter: 'b', text: 'Repartir mi dinero en instrumentos con más riesgo (más retorno) e instrumentos con menor riesgo (menor retorno)', points: 2 },
      { letter: 'c', text: 'Invertir todo mi dinero en instrumentos de mucho riesgo, que pueden tener un gran retorno', points: 3 },
    ],
  },
  {
    id: 'p7_recesion',
    dimension: 'toleranciaRiesgo',
    original: true,
    text: 'Si el mercado entra en recesión y su inversión pierde valor, ¿qué haría?',
    source: 'Reacción revelada ante un evento de mercado externo/macro (no específico a su cartera).',
    options: [
      { letter: 'a', text: 'Vender inmediatamente y evitar más pérdidas', points: 1 },
      { letter: 'b', text: 'Consultar con mi asesor de inversiones', points: 2 },
      { letter: 'c', text: 'Mantener mis posiciones y comprar más', points: 3 },
    ],
  },
  {
    id: 'p8_caida50',
    dimension: 'toleranciaRiesgo',
    referenceId: 1,
    original: true,
    text: 'Si tu portafolio pierde un 50% de su valor, ¿qué harías?',
    source: 'CMF Chile / CFA Institute — reacción revelada ante una pérdida personal y extrema (adaptación del -20% del instructivo a -50%, mismo propósito).',
    options: [
      { letter: 'a', text: 'Vender inmediatamente y evitar más pérdidas', points: 1 },
      { letter: 'b', text: 'Consultar con mi asesor de inversiones', points: 2 },
      { letter: 'c', text: 'Mantener mis posiciones y comprar más', points: 3 },
    ],
  },
  {
    id: 'p9_actitud_riesgo',
    dimension: 'toleranciaRiesgo',
    modified: true,
    text: 'El riesgo en las inversiones representa para ti, principalmente:',
    source: 'Reescritura de la pregunta original ("amenaza / inseguridad / oportunidad") para asegurar opciones mutuamente excluyentes, tal como exige el instructivo.',
    options: [
      { letter: 'a', text: 'Algo que se debe evitar siempre que sea posible', points: 1 },
      { letter: 'b', text: 'Algo que hay que asumir con cautela, solo cuando es necesario', points: 2 },
      { letter: 'c', text: 'Una oportunidad que vale la pena buscar activamente', points: 3 },
    ],
  },
  {
    id: 'p12_prospectos',
    dimension: 'sesgos',
    referenceId: 4,
    added: true,
    text: 'Imagine que debe elegir entre dos alternativas de inversión. ¿Cuál prefiere?',
    source: 'Kahneman & Tversky (teoría de prospectos) / Carrie, Pan & Statman (2012) — Pregunta de referencia 4 del instructivo. Pregunta nueva: cierra la dimensión "Sesgos de comportamiento", que no estaba operacionalizada en el cuestionario original. Redactada sin el envoltorio de "inversión ya ganada" del borrador anterior, que generaba ambigüedad sobre qué representaba el monto.',
    options: [
      { letter: 'a', text: 'Asegurar $800.000 de ganancia, sin dudarlo', points: 1 },
      { letter: 'b', text: 'Asegurar $800.000, aunque me tienta la otra opción', points: 2 },
      { letter: 'c', text: 'Arriesgarme a ganar $2.000.000 o no ganar nada, aunque lo dudo un poco', points: 3 },
      { letter: 'd', text: 'Arriesgarme claramente a ganar $2.000.000 o no ganar nada', points: 4 },
    ],
  },
  {
    id: 'p10_ingresos_futuros',
    dimension: 'situacionFinanciera',
    referenceId: 6,
    original: true,
    text: '¿Cómo esperas que sean tus ingresos en los próximos años?',
    source: 'Encuestas AFP / CMF — estabilidad de flujos futuros.',
    options: [
      { letter: 'a', text: 'Esporádicos, sin un ingreso estable', points: 1 },
      { letter: 'b', text: 'Estables dentro de un año o dos', points: 2 },
      { letter: 'c', text: 'Estables dentro de los próximos 5 años', points: 3 },
    ],
  },
  {
    id: 'p11_ahorro_emergencia',
    dimension: 'situacionFinanciera',
    original: true,
    text: '¿Cuál es tu capacidad de ahorro para hacer frente a imprevistos?',
    source: 'Colchón de liquidez — capacidad real de absorber un imprevisto sin liquidar la inversión.',
    options: [
      { letter: 'a', text: 'Ninguna: no tengo una reserva de emergencia ni un hábito de ahorro estable', points: 1 },
      { letter: 'b', text: 'Ahorro de forma esporádica, con propósito general', points: 2 },
      { letter: 'c', text: 'Ahorro de forma constante y tengo una reserva destinada a imprevistos', points: 3 },
    ],
  },
];

// P4 (objetivo de inversión): pregunta original del equipo. Se conserva tal
// cual, pero se muestra solo como contexto en el resultado — el instructivo
// no la exige como dimensión de puntaje y mezclarla con Tolerancia
// distorsionaría esa dimensión (objetivo declarado y tolerancia revelada no
// son lo mismo).
export const OBJECTIVE_QUESTION = {
  id: 'p4_objetivo',
  axis: 'objetivo',
  original: true,
  text: '¿Qué buscas con tu inversión? Responde según cuál es tu objetivo.',
  options: [
    { letter: 'a', text: 'Asegurar y mantener mi capital', label: 'Preservación de capital' },
    { letter: 'b', text: 'Hacer crecer de forma moderada y estable mi capital', label: 'Crecimiento moderado' },
    { letter: 'c', text: 'Buscar el máximo crecimiento de mi capital, sin importar el riesgo', label: 'Máximo crecimiento' },
  ],
};

// Estilo de decisión (activo/pasivo): pregunta nueva, no puntúa en el
// compuesto de riesgo. Alimenta únicamente la clasificación secundaria de
// Tipo de Inversionista Conductual (Pompian, 2008), vista en la Sesión 2.
export const ACTIVITY_QUESTION = {
  id: 'p13_activo_pasivo',
  axis: 'activity',
  added: true,
  text: '¿Cómo describe mejor la forma en que usted toma decisiones de inversión?',
  source: 'Pompian, M. (2008). Behavioral Finance and Wealth Management — Paso 1: activo o pasivo. Separa explícitamente delegar en un asesor calificado (a) de seguir fuentes no calificadas como familia/redes sociales (b), ya que no son el mismo comportamiento: (b) es el sesgo de "Friendly Follower" (Pompian, 2008), (a) es delegación en expertise real.',
  options: [
    { letter: 'a', text: 'Prefiero que un asesor financiero calificado decida por mí' },
    { letter: 'b', text: 'Sigo lo que recomiendan mi familia, mis amigos, o lo que veo en redes sociales' },
    { letter: 'c', text: 'Comparo varias alternativas y decido yo, aunque a veces converso con un asesor u otras personas antes' },
    { letter: 'd', text: 'Investigo por mi cuenta y tomo la decisión final yo mismo, sin depender de lo que me sugieran' },
  ],
};

// Circunstancias vitales / vulnerabilidad: pregunta nueva, no puntúa en el
// compuesto. Actúa como un cuarto filtro de seguridad (downgrade), igual que
// horizonte, liquidez y conocimiento. Fuente: Banks, Bassoli y Mammi (2019);
// G20/OECD (2022) — ambas citadas en el paper de Suitability de la CMF.
export const VULNERABILITY_QUESTION = {
  id: 'p14_vulnerabilidad',
  axis: 'vulnerability',
  added: true,
  text: '¿Ha vivido en el último año alguna de estas situaciones?',
  source: 'Banks, Bassoli y Mammi (2019); G20/OECD (2022) — factores de vulnerabilidad.',
  options: [
    { letter: 'a', text: 'Ninguna de las siguientes' },
    { letter: 'b', text: 'Pérdida de empleo o jubilación reciente' },
    { letter: 'c', text: 'Un diagnóstico de salud grave (propio o de un familiar directo)' },
    { letter: 'd', text: 'Un cambio familiar mayor (separación, viudez, nuevo dependiente a cargo)' },
  ],
};

// Activos digitales / FOMO: pregunta nueva, no puntúa en el compuesto.
// Actúa como un sexto filtro de seguridad (downgrade) cuando revela una
// conducta de inversión impulsiva. Fuente: CFA Institute (2023), "Gen Z and
// Investing: Social Media, Crypto, FOMO, and Family" — citado en el paper de
// Suitability de la CMF, que recomienda explícitamente que el proceso de
// idoneidad "evalúe sesgos impulsivos como el FOMO" en vez de depender solo
// de la autoevaluación de tolerancia al riesgo.
export const DIGITAL_ASSETS_QUESTION = {
  id: 'p15_activos_digitales',
  axis: 'digitalAssets',
  added: true,
  text: '¿Cómo describiría su relación con las criptomonedas u otros activos digitales?',
  source: 'CFA Institute (2023), "Gen Z and Investing: Social Media, Crypto, FOMO, and Family".',
  options: [
    { letter: 'a', text: 'No he invertido en criptomonedas ni activos digitales' },
    { letter: 'b', text: 'He invertido después de investigar el proyecto o activo' },
    { letter: 'c', text: 'He invertido principalmente porque muchas personas hablaban de eso en ese momento' },
    { letter: 'd', text: 'Invierto frecuentemente en activos digitales nuevos apenas se vuelven populares' },
  ],
};

function byId(id) {
  return SCORED_QUESTIONS.find((q) => q.id === id);
}

// Orden de presentación al usuario (17 preguntas en total).
export const ALL_QUESTIONS = [
  byId('p1_horizonte'),
  byId('p2_patrimonio'),
  byId('p3_ingresos'),
  OBJECTIVE_QUESTION,
  byId('p5_conocimiento'),
  byId('p5b_literacy_interes'),
  byId('p5c_literacy_inflacion'),
  byId('p6_estilo'),
  byId('p7_recesion'),
  byId('p8_caida50'),
  byId('p9_actitud_riesgo'),
  byId('p12_prospectos'),
  byId('p10_ingresos_futuros'),
  byId('p11_ahorro_emergencia'),
  ACTIVITY_QUESTION,
  VULNERABILITY_QUESTION,
  DIGITAL_ASSETS_QUESTION,
];
