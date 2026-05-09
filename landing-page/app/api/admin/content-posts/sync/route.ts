import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import queueData from "@/admin-assets/content/100-day-queue.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QueueRow = {
  day: number;
  date: string;
  platform: string;
  format: string;
  hook: string;
  caption: string;
  image_prompt?: string;
  cta?: string;
  keyword_target?: string;
  slide_outline?: string[];
  duration_seconds?: number;
};

// One-shot importer: reads the bundled 14-day-queue.json and upserts every
// row into content_posts by day. Idempotent — re-runs update mutable fields
// (caption / hook / etc.) but never overwrite ig_media_id, status, or
// published_at on already-published rows.
//
// Reels are filtered out — Opus Clip handles those. Only static + carousel
// rows are inserted.
//
// Admin only. Hit it once after applying migration 027.
export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const sb = createSupabaseAdmin();
  const queue = (queueData as { queue: QueueRow[] }).queue;
  const igPostable = queue.filter((p) => p.platform === "instagram" && p.format !== "reel");

  let inserted = 0;
  let updated  = 0;
  const errors: Array<{ day: number; error: string }> = [];

  for (const p of igPostable) {
    // Check if row exists.
    const { data: existing } = await sb
      .from("content_posts")
      .select("id, status")
      .eq("day", p.day)
      .maybeSingle();

    const payload = {
      day:             p.day,
      date:            p.date,
      platform:        p.platform,
      format:          p.format,
      hook:            p.hook,
      caption:         p.caption,
      image_prompt:    p.image_prompt ?? null,
      cta:             p.cta ?? null,
      keyword_target:  p.keyword_target ?? null,
      slide_outline:   p.slide_outline ?? [],
      duration_seconds: p.duration_seconds ?? null,
    };

    if (!existing) {
      const { error } = await sb.from("content_posts").insert(payload);
      if (error) errors.push({ day: p.day, error: error.message });
      else inserted++;
    } else if (existing.status === "pending" || existing.status === "failed") {
      // Safe to update content for un-published rows.
      const { error } = await sb.from("content_posts").update(payload).eq("day", p.day);
      if (error) errors.push({ day: p.day, error: error.message });
      else updated++;
    }
    // status === 'published' or 'publishing' → leave row alone.
  }

  return NextResponse.json({
    ok: true,
    total_in_json: queue.length,
    eligible_for_ig: igPostable.length,
    inserted,
    updated,
    errors,
  });
}
