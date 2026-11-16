import { createClient } from '@supabase/supabase-js';

let client: ReturnType<typeof createClient> | undefined;

export function getSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !publishableKey) {
    throw new Error('Quote requests are temporarily unavailable. Please contact us directly.');
  }
  client ??= createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(30000) }),
    },
  });
  return client;
}
