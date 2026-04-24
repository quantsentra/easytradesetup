import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";

/**
 * Returns true iff there is a row in the `admins` table keyed to this Clerk
 * user ID. Single source of truth for admin access — middleware only
 * enforces signed-in; the role check lives here.
 */
export async function isAdmin(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  try {
    const supa = createSupabaseAdmin();
    const { data, error } = await supa
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return false;
    return true;
  } catch {
    return false;
  }
}
