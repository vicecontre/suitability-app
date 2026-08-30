// Los 4 perfiles obligatorios del curso (Clase 1). El orden importa: se usa
// para aplicar los filtros de seguridad (cap/downgrade) en scoring.js.
export const PROFILE_ORDER = ['Conservador', 'Moderado', 'Moderado-Agresivo', 'Agresivo'];

function buildAssets(riskFreePct) {
  // Proporciones relativas fijas de renta variable (10 posiciones
  // ilustrativas), escaladas para llenar el remanente que deja el
  // porcentaje libre de riesgo. Es una asignación de referencia para
  // mostrar visualmente el perfil, no una recomendación real de cartera
  // (eso es objeto de la Tarea 2).
  const equityShape = [26.8, 20.9, 17.3, 7.6, 7.4, 4.0, 4.0, 4.0, 4.0, 4.0];
  const equityNames = [
    'Acciones EE.UU. (blue chips)',
    'Acciones EE.UU. (consumo/salud)',
    'Tecnología / Growth',
    'Renta variable internacional',
    'Consumo defensivo',
    'Infraestructura / Utilities',
    'Utilities',
    'Salud',
    'Bienes raíces (REITs)',
    'Tecnología (hardware)',
  ];
  const equityTotal = equityShape.reduce((a, b) => a + b, 0);
  const remaining = 100 - riskFreePct;
  const assets = [];
  if (riskFreePct > 0) {
    assets.push({ name: 'Renta fija / libre de riesgo', value: riskFreePct, isRiskFree: true });
  }
  equityShape.forEach((share, i) => {
    assets.push({ name: equityNames[i], value: Number(((share / equityTotal) * remaining).toFixed(1)) });
  });
  return assets;
}

export const RISK_PROFILES = {
  Conservador: {
    title: 'Conservador',
    tagline: 'Preservación de capital y alta liquidez',
    description:
      'Prioriza no perder dinero por sobre el crecimiento del capital. Es apropiado para quienes necesitan el dinero en el corto plazo, tienen baja capacidad financiera para absorber pérdidas, o simplemente no están dispuestos a tolerar caídas de valor, ni siquiera temporales.',
    toleranciaCaidas: 'Muy baja: no está dispuesto a ver números rojos en su inversión.',
    composicionTexto: '80% – 90% renta fija (depósitos a plazo, bonos de corto plazo, fondos de liquidez) / 10% – 20% renta variable.',
    color: '#2b8a3e',
    assets: buildAssets(85),
  },
  Moderado: {
    title: 'Moderado',
    tagline: 'Proteger el capital, con crecimiento acotado',
    description:
      'Busca proteger el capital frente a la inflación asumiendo un riesgo bajo a cambio de un crecimiento moderado. Soporta volatilidad menor en el corto plazo, siempre que la mayor parte del capital esté razonablemente protegida.',
    toleranciaCaidas: 'Baja a media: tolera fluctuaciones acotadas, pero no caídas prolongadas de gran magnitud.',
    composicionTexto: '55% – 65% renta fija / 35% – 45% renta variable (acciones estables, ETFs diversificados).',
    color: '#1971c2',
    assets: buildAssets(60),
  },
  'Moderado-Agresivo': {
    title: 'Moderado-Agresivo',
    tagline: 'Crecimiento del capital en el mediano-largo plazo',
    description:
      'Comprende que el mercado fluctúa y está dispuesto a soportar periodos con rendimientos negativos a cambio de una mayor rentabilidad esperada en el mediano y largo plazo. Requiere un horizonte de inversión amplio y conocimiento financiero razonable.',
    toleranciaCaidas: 'Media-alta: acepta caídas de doble dígito en periodos acotados sin alterar su estrategia.',
    composicionTexto: '25% – 35% renta fija / 65% – 75% renta variable.',
    color: '#e8590c',
    assets: buildAssets(30),
  },
  Agresivo: {
    title: 'Agresivo',
    tagline: 'Máximo crecimiento, alta volatilidad',
    description:
      'Busca maximizar el retorno de largo plazo y ve las caídas de mercado como oportunidades de compra más que como amenazas. Requiere horizonte largo, alta capacidad financiera y conocimiento sólido de los instrumentos utilizados.',
    toleranciaCaidas: 'Alta: tolera caídas severas (20% o más) sin cambiar de estrategia.',
    composicionTexto: '0% – 10% renta fija / 90% – 100% renta variable y activos alternativos.',
    color: '#c92a2a',
    warning:
      'Advertencia: este perfil puede experimentar caídas superiores al 20% en ventanas de 12 meses y una volatilidad anual considerablemente más alta que el promedio de mercado. Es apropiado únicamente para inversionistas con horizonte largo, conocimiento financiero adecuado y capacidad real —no solo disposición— de absorber pérdidas.',
    assets: buildAssets(5),
  },
};

// Tipo de Inversionista Conductual (Pompian, 2008) — capa secundaria e
// informativa. No reemplaza el perfil de riesgo obligatorio de arriba.
export const BIT_PROFILES = {
  passivePreserver: {
    key: 'passivePreserver',
    name: 'Preservador Pasivo',
    nameEn: 'Passive Preserver',
    risk: 'Baja',
    biasType: 'Emocional',
    description: 'Prioriza la seguridad y la preservación de capital. Baja propensión al riesgo.',
    cognitiveBiases: ['Anchoring', 'Mental Accounting'],
    emotionalBiases: ['Endowment', 'Loss Aversion', 'Status Quo', 'Regret'],
  },
  friendlyFollower: {
    key: 'friendlyFollower',
    name: 'Seguidor Amistoso',
    nameEn: 'Friendly Follower',
    risk: 'Baja-Media',
    biasType: 'Cognitivo',
    description: 'Inversionista pasivo que replica ideas de inversión ajenas más que generarlas.',
    cognitiveBiases: ['Framing', 'Hindsight'],
    emotionalBiases: ['Regret'],
  },
  independentIndividualist: {
    key: 'independentIndividualist',
    name: 'Individualista Independiente',
    nameEn: 'Independent Individualist',
    risk: 'Media-Alta',
    biasType: 'Cognitivo',
    description: 'Asume riesgos medios a altos, con opiniones de inversión propias y bien formadas.',
    cognitiveBiases: ['Conservatism', 'Availability', 'Representativeness'],
    emotionalBiases: ['Self-Attribution', 'Overconfidence'],
  },
  activeAccumulator: {
    key: 'activeAccumulator',
    name: 'Acumulador Activo',
    nameEn: 'Active Accumulator',
    risk: 'Alta',
    biasType: 'Emocional',
    description: 'Perfil más agresivo; confía en replicar en sus inversiones el éxito logrado en otros ámbitos.',
    cognitiveBiases: ['Illusion of Control'],
    emotionalBiases: ['Overconfidence', 'Self-Control'],
  },
};

export const OBJECTIVE_LABELS = {
  a: 'Preservación de capital',
  b: 'Crecimiento moderado',
  c: 'Máximo crecimiento',
};
