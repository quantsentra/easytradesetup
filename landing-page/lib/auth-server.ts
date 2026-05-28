import "server-only";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

// Server-side auth helper, backed by Clerk. The rest of the app consumes
// auth only through these functions, so swapping the provider stays local
// to this file. `getUser()` returns a minimal { id, email } shape — the
// same fields call sites read off the old Supabase user object — so
// downstream code is unchanged.
//
// `id` is the Clerk user id (e.g. "user_2abc…"), stored as-is in the
// `user_id text` columns the schema already uses.

export type AppUser = { id: string; email: string | null; name: string | null };

function primaryEmail(u: {
  primaryEmailAddressId?: string | null;
  emailAddresses?: Array<{ id: string; emailAddress: string }>;
}): string | null {
  const list = u.emailAddresses ?? [];
  const primary = list.find((e) => e.id === u.primaryEmailAddressId);
  return (primary ?? list[0])?.emailAddress ?? null;
}

/** Current signed-in user, or null. Use in Server Components / Route Handlers. */
export async function getUser(): Promise<AppUser | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const u = await currentUser();
  if (!u) return { id: userId, email: null, name: null };
  return {
    id: u.id,
    email: primaryEmail(u),
    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || null,
  };
}

/** Current Clerk user id, or null. Cheaper than getUser() — no profile fetch. */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

/**
 * Resolve a single user by Clerk id. Used by admin screens to show customer
 * email + name next to an entitlement / ticket row.
 */
export async function getUserById(id: string): Promise<{
  id: string;
  email: string | null;
  fullName: string | null;
  createdAt: string | null;
} | null> {
  try {
    const client = await clerkClient();
    const u = await client.users.getUser(id);
    return {
      id: u.id,
      email: primaryEmail(u),
      fullName: [u.firstName, u.lastName].filter(Boolean).join(" ") || null,
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
    };
  } catch {
    return null;
  }
}

/** List users for /admin/customers. */
export async function listAllUsers(limit = 200): Promise<
  Array<{
    id: string;
    email: string | null;
    fullName: string | null;
    createdAt: string | null;
  }>
> {
  try {
    const client = await clerkClient();
    const res = await client.users.getUserList({ limit });
    return res.data.map((u) => ({
      id: u.id,
      email: primaryEmail(u),
      fullName: [u.firstName, u.lastName].filter(Boolean).join(" ") || null,
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
    }));
  } catch {
    return [];
  }
}

/**
 * Bulk-resolve emails for a list of user ids. Used by the admin tickets
 * inbox to label rows without N round-trips.
 */
export async function emailsByUserIds(ids: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (ids.length === 0) return out;
  try {
    const client = await clerkClient();
    const res = await client.users.getUserList({ userId: ids, limit: Math.min(ids.length, 500) });
    for (const u of res.data) {
      const email = primaryEmail(u);
      if (email) out.set(u.id, email);
    }
  } catch {
    // best-effort — empty map just means labels fall back to the raw id
  }
  return out;
}
