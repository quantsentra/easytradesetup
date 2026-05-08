import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// YT counterpart of /api/admin/content-posts/retry-failed. Resets every row
// where yt_status='failed' back to 'pending' so the YT cron picks them up.
export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("content_posts")
    .update({ yt_status: "pending", yt_error_message: null })
    .eq("yt_status", "failed")
    .select("day");

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Array<{ day: number }>;
  return NextResponse.json({
    ok: true,
    reset_count: rows.length,
    reset_days: rows.map((r) => r.day),
  });
}
