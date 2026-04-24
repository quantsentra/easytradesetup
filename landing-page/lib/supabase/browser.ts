"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Browser-side Supabase client — singleton across the tab. Used by the
 * custom sign-in / sign-up pages and the nav's sign-out action.
 *
 * Do NOT import this from Server Components; use `lib/supabase/server.ts`.
 */
export function supabaseBrowser(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase env vars missing in browser bundle");
  }
  cached = createBrowserClient(url, anon) as unknown as SupabaseClient;
  return cached;
}
