import { DIMENSIONS, SCORED_QUESTIONS } from '../data/questions';
import { PROFILE_ORDER, BIT_PROFILES } from '../data/profiles';

// Normaliza un puntaje de una pregunta (escala 1-N según la pregunta, la
// mayoría 1-3, alguna 1-4) a una escala común 0-1.
function normalize(points, maxPoints) {
  if (maxPoints <= 1) return 0;
  return (points - 1) / (maxPoints - 1);
}

function findOption(question, letter) {
  return question.options.find((o) => o.letter === letter);
}

function maxPointsOf(question) {
  return Math.max(...question.options.map((o) => o.points));
}

// Promedia (0-1) las respuestas de cada dimensión.
export function computeDimensionScores(answers) {
  const byDimension = {};
  for (const q of SCORED_QUESTIONS) {
    const option = findOption(q, answers[q.id]);
    if (!option) continue;
    byDimension[q.dimension] = byDimension[q.dimension] || [];
    byDimension[q.dimension].push(normalize(option.points, maxPointsOf(q)));
  }
  const dimensionScores = {};
  for (const dimId of Object.keys(DIMENSIONS)) {
    const values = byDimension[dimId] || [];
    dimensionScores[dimId] = values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : null;
  }
  return dimensionScores;
}

// Puntaje compuesto 0-100: suma ponderada de los puntajes de dimensión.
export function computeCompositeScore(dimensionScores) {
  let total = 0;
  for (const dimId of Object.keys(DIMENSIONS)) {
    total += (dimensionScores[dimId] ?? 0) * DIMENSIONS[dimId].weight;
  }
  return Math.round(total * 100);
}

// Bandas parejas de 25 puntos cada una sobre la escala 0-100.
export function bandFromScore(score) {
  if (score <= 25) return 'Conservador';
  if (score <= 50) return 'Moderado';
  if (score <= 75) return 'Moderado-Agresivo';
  return 'Agresivo';
}

function capAt(profile, cap) {
  return PROFILE_ORDER.indexOf(profile) > PROFILE_ORDER.indexOf(cap) ? cap : profile;
}

function oneStepDown(profile) {
  const idx = PROFILE_ORDER.indexOf(profile);
  return PROFILE_ORDER[Math.max(0, idx - 1)];
}

// Filtros de seguridad: pueden bajar el perfil calculado, nunca subirlo.
// Documentan explícitamente la fuente de cada regla para la defensa oral.
export function applySafetyFilters({ answers, initialProfile, dimensionScores }) {
  const applied = [];
  let result = initialProfile;

  if (answers.p1_horizonte === 'a') {
    result = capAt(result, 'Conservador');
    applied.push({
      id: 'horizonte',
      label: 'Horizonte menor a 1 año',
      reason:
        'La renta variable es impredecible en menos de 12 meses; se limita el perfil a Conservador (CMF / MiFID II).',
    });
  }

  if (answers.p11_ahorro_emergencia === 'a') {
    result = capAt(result, 'Moderado');
    applied.push({
      id: 'liquidez',
      label: 'Sin fondo de emergencia',
      reason:
        'Un imprevisto obligaría a liquidar activos en mal momento; se limita el perfil a Moderado (FINRA / bancos chilenos).',
    });
  }

  if (answers.p5_conocimiento === 'a') {
    result = capAt(result, 'Moderado');
    applied.push({
      id: 'conocimiento',
      label: 'Conocimiento financiero nulo',
      reason:
        'No procede ofrecer productos complejos sin experiencia previa; se limita el perfil a Moderado (MiFID II / CMF).',
    });
  }

  if (['b', 'c', 'd'].includes(answers.p14_vulnerabilidad)) {
    result = capAt(result, 'Moderado');
    applied.push({
      id: 'vulnerabilidad',
      label: 'Evento vital reciente',
      reason:
        'Los eventos de salud, cesantía o cambios familiares reducen temporalmente la tolerancia real al riesgo; se limita el perfil a Moderado (Banks et al., 2019; G20/OECD, 2022).',
    });
  }

  const tolerancia = dimensionScores.toleranciaRiesgo ?? 0;
  const sesgos = dimensionScores.sesgos ?? 0;
  if (tolerancia >= 0.75 && sesgos <= 0.25) {
    result = oneStepDown(result);
    applied.push({
      id: 'mismatch',
      label: 'Tolerancia alta pero aversión a la pérdida alta',
      reason:
        'Tolerancia al riesgo y aversión a la pérdida son dimensiones independientes; ante una alta aversión revelada se baja un escalón el perfil (Van Dolder & Vandenbroucke, 2024).',
    });
  }

  return { result, applied };
}

// Variación de Respuesta entre Ítems (IRV): detecta respuestas "en línea
// recta" que sugieren baja confiabilidad más que un perfil real (Hartnett,
// Gerrans y Faff, 2019, Financial Analysts Journal — citado en el paper CMF).
export function computeConsistency(answers) {
  const values = SCORED_QUESTIONS.map((q) => {
    const option = findOption(q, answers[q.id]);
    return option ? normalize(option.points, maxPointsOf(q)) : null;
  }).filter((v) => v !== null);

  if (values.length < 2) return { flag: false, sd: null };

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  const sd = Number(Math.sqrt(variance).toFixed(3));

  return { flag: sd < 0.12, sd };
}

// Tipo de Inversionista Conductual (Pompian, 2008): usa los mismos cuartiles
// que el perfil de riesgo principal, pero aplicados solo a la sub-dimensión
// de tolerancia psicológica (Paso 2 de Pompian), matizado por la pregunta de
// estilo de decisión activo/pasivo (Paso 1).
export function classifyBIT({ dimensionScores, activityAnswer }) {
  const tolerance = dimensionScores.toleranciaRiesgo ?? 0.5;
  let key;
  if (tolerance <= 0.25) key = 'passivePreserver';
  else if (tolerance <= 0.5) key = 'friendlyFollower';
  else if (tolerance <= 0.75) key = 'independentIndividualist';
  else key = 'activeAccumulator';

  const isActive = ['c', 'd'].includes(activityAnswer);
  return { ...BIT_PROFILES[key], isActive };
}

// Orquestador principal: recibe todas las respuestas y devuelve el resultado
// completo que consume la UI.
export function evaluateSuitability(answers) {
  const dimensionScores = computeDimensionScores(answers);
  const compositeScore = computeCompositeScore(dimensionScores);
  const initialProfile = bandFromScore(compositeScore);
  const { result: finalProfile, applied: appliedFilters } = applySafetyFilters({
    answers,
    initialProfile,
    dimensionScores,
  });
  const consistency = computeConsistency(answers);
  const bit = classifyBIT({ dimensionScores, activityAnswer: answers.p13_activo_pasivo });

  return {
    dimensionScores,
    compositeScore,
    initialProfile,
    finalProfile,
    appliedFilters,
    consistency,
    bit,
  };
}
