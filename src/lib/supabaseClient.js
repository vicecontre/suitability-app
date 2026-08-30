import { createClient } from '@supabase/supabase-js';

// Cliente Supabase: se crea solo si ambas variables de entorno están
// presentes. Si faltan (por ejemplo, corriendo el proyecto sin .env),
// `supabase` queda en null y storage.js cae automáticamente a localStorage
// sin romper nada.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const client = url && anonKey ? createClient(url, anonKey) : null;

export async function getSupabase() {
  return client;
}
