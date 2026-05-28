/**
 * Privileged Supabase client — bypasses RLS. Never import this into a
 * component rendered to the browser. Intended for webhooks, background
 * jobs, and admin-only route handlers.
 *
 * Supabase is the DATA store only; auth is owned by Clerk. All app reads/
 * writes go through this service-role client.
 */
export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase admin env vars missing: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
