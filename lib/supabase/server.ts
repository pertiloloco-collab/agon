// ═══════════════════════════════════════════════════════════
// AGON — Server-side Supabase Client
// For use in API routes and server components
// ═══════════════════════════════════════════════════════════

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for server-side usage.
 * Uses the service role key when available for elevated access,
 * otherwise falls back to the anon key.
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseKey);
}
