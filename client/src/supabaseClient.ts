/**
 * Delta Stars — Supabase Client
 * Initializes the Supabase client with VITE_ env vars.
 * Falls back gracefully when keys are not yet configured.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Quick connectivity check — returns true if Supabase is reachable.
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('_health').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}

/** Whether Supabase is configured with real credentials (not placeholders). */
export const isSupabaseConfigured: boolean =
  Boolean(SUPABASE_URL) &&
  Boolean(SUPABASE_ANON_KEY) &&
  SUPABASE_URL !== '__SET_ME__' &&
  SUPABASE_ANON_KEY !== '__SET_ME__';

/**
 * Supabase client instance.
 * When not configured, every call will gracefully return errors
 * that the api.ts fallback layer handles.
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  },
);

/**
 * Server-side Supabase client (uses service role key for admin operations).
 * Only import this in server/_core/ files.
 */
export function createServerSupabaseClient(): SupabaseClient | null {
  const serverUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serverUrl || !serviceKey) {
    console.warn('[Supabase] Server client not configured — SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY missing.');
    return null;
  }

  return createClient(serverUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
