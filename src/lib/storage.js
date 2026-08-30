import { getSupabase } from './supabaseClient';

const LOCAL_KEY = 'suitability_submissions';

// Guarda una respuesta completa del cuestionario. Si Supabase está
// configurado (ver supabaseClient.js), se inserta en la tabla `submissions`;
// si no, se guarda en localStorage. Esto es exactamente el pilar de
// "Registro y Trazabilidad" del marco de gobernanza de suitability (ESMA,
// 2022, citado en el paper CMF): conservar las respuestas y el resultado
// obtenido, no solo mostrarlo en pantalla.
export async function saveSubmission(record) {
  const payload = {
    answers: record.answers,
    dimension_scores: record.dimensionScores,
    composite_score: record.compositeScore,
    initial_profile: record.initialProfile,
    final_profile: record.finalProfile,
    applied_filters: record.appliedFilters,
    consistency_flag: record.consistency.flag,
    consistency_sd: record.consistency.sd,
    bit_profile: record.bit.key,
    created_at: new Date().toISOString(),
  };

  const supabase = await getSupabase();
  if (supabase) {
    const { error } = await supabase.from('submissions').insert(payload);
    if (error) {
      console.warn('[storage] Falló el insert en Supabase, se guarda localmente como respaldo.', error);
      saveLocal(payload);
    }
    return;
  }

  saveLocal(payload);
}

function saveLocal(payload) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    existing.push(payload);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('[storage] No se pudo guardar en localStorage.', err);
  }
}

export function readLocalSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}
