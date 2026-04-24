import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export type UserActivity = {
  previousLastSeen: string | null; // ISO; null on the user's first visit
  visitCount: number;              // total visits (including this one)
};

/**
 * Read the previous last-seen timestamp for a user, then upsert a new
 * last-seen = now() + increment visit_count. Returns the OLD last-seen
 * value so callers can compute "new since last visit" content.
 *
 * Not atomic — we do a read + an upsert. Acceptable: if two requests
 * race, both may see the same "previousLastSeen" and show one extra new
 * note. Low impact.
 */
export async function touchAndGetPrevious(userId: string): Promise<UserActivity> {
  try {
    const supa = createSupabaseAdmin();
    const { data: existing } = await supa
      .from("user_activity")
      .select("last_seen_at,visit_count")
      .eq("user_id", userId)
      .maybeSingle();

    const previousLastSeen = existing?.last_seen_at || null;
    const prevVisits = existing?.visit_count || 0;

    // Fire-and-forget write. We have the previous value; failing to
    // record this visit still lets the page render correctly.
    void supa
      .from("user_activity")
      .upsert(
        {
          user_id: userId,
          last_seen_at: new Date().toISOString(),
          visit_count: prevVisits + 1,
        },
        { onConflict: "user_id" },
      )
      .then(() => undefined);

    return { previousLastSeen, visitCount: prevVisits + 1 };
  } catch {
    return { previousLastSeen: null, visitCount: 1 };
  }
}
