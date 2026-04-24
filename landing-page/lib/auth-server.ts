import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase server-side auth helper. Reads the session cookie, validates
 * with Supabase Auth, and returns the user (or null).
 *
 * Use this in Server Components, Route Handlers, and Server Actions.
 * The returned user.id is a UUID — store it in the same `user_id text`
 * columns we used for Clerk IDs; the shape is different but compatible.
 */
export async function getUser() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const supa = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component path — cookie mutations are a no-op here.
        }
      },
    },
  });

  const { data } = await supa.auth.getUser();
  return data.user || null;
}

/** Convenience: returns the Supabase user id, or null if no session. */
export async function getUserId(): Promise<string | null> {
  const u = await getUser();
  return u?.id || null;
}

/**
 * Pull a Supabase auth user by ID using the service-role key.
 * Used by admin screens to resolve customer emails and names.
 */
export async function getUserById(id: string): Promise<{
  id: string;
  email: string | null;
  fullName: string | null;
  createdAt: string | null;
} | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !service) return null;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@supabase/supabase-js");
    const admin = createClient(url, service, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await admin.auth.admin.getUserById(id);
    if (error || !data?.user) return null;
    return {
      id: data.user.id,
      email: data.user.email ?? null,
      fullName: (data.user.user_metadata?.full_name as string | undefined) ?? null,
      createdAt: data.user.created_at ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * List Supabase auth users. For /admin/customers.
 */
export async function listAllUsers(limit = 200): Promise<
  Array<{
    id: string;
    email: string | null;
    fullName: string | null;
    createdAt: string | null;
  }>
> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !service) return [];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@supabase/supabase-js");
    const admin = createClient(url, service, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await admin.auth.admin.listUsers({ perPage: limit });
    if (error || !data?.users) return [];
    return data.users.map((u: {
      id: string;
      email?: string | null;
      user_metadata?: { full_name?: string };
      created_at?: string;
    }) => ({
      id: u.id,
      email: u.email ?? null,
      fullName: (u.user_metadata?.full_name as string | undefined) ?? null,
      createdAt: u.created_at ?? null,
    }));
  } catch {
    return [];
  }
}

/**
 * Bulk-resolve email addresses for a list of user IDs. Used by the admin
 * tickets inbox to show who opened each ticket without N round-trips.
 */
export async function emailsByUserIds(ids: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (ids.length === 0) return out;
  const all = await listAllUsers(500);
  const byId = new Map(all.map((u) => [u.id, u.email || u.id]));
  for (const id of ids) {
    const email = byId.get(id);
    if (email) out.set(id, email);
  }
  return out;
}
