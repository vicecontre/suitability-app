// Cliente Supabase opcional y perezoso. Mientras no existan las variables de
// entorno (o el paquete no esté instalado), getSupabase() resuelve a null y
// el resto de la app sigue funcionando con localStorage (ver storage.js).
//
// Para activar Supabase:
//   1. npm install @supabase/supabase-js
//   2. Crear un archivo .env con:
//        VITE_SUPABASE_URL=https://xxxx.supabase.co
//        VITE_SUPABASE_ANON_KEY=xxxx
//   3. Crear la tabla `submissions` (ver .env.example).
//
// No hace falta tocar ningún otro archivo: storage.js llama a getSupabase()
// y decide solo si usarlo o caer a localStorage.

let cachedClient;

export async function getSupabase() {
  if (cachedClient !== undefined) return cachedClient;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    cachedClient = null;
    return cachedClient;
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    cachedClient = createClient(url, anonKey);
  } catch (err) {
    console.warn(
      '[supabaseClient] Variables de entorno presentes pero @supabase/supabase-js no está instalado. ' +
        'Ejecuta "npm install @supabase/supabase-js" para activar el guardado remoto.',
      err,
    );
    cachedClient = null;
  }

  return cachedClient;
}
