import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export type LatestUpdate = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  published_at: string;
};

export async function fetchLatestUpdate(): Promise<LatestUpdate | null> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("updates")
      .select("id,slug,title,excerpt,published_at")
      .eq("draft", false)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as LatestUpdate) || null;
  } catch {
    return null;
  }
}

export async function countUpdatesSince(isoTimestamp: string): Promise<number> {
  try {
    const supa = createSupabaseAdmin();
    const { count } = await supa
      .from("updates")
      .select("id", { count: "exact", head: true })
      .eq("draft", false)
      .gt("published_at", isoTimestamp);
    return count ?? 0;
  } catch {
    return 0;
  }
}
