import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Resets every content_posts row currently in 'failed' status back to
// 'pending' so the daily cron picks them up again. Attempts counter is
// preserved (so we can see how many tries it took if logging) but
// error_message is cleared. Admin-only.
export async function POST() {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("content_posts")
    .update({ status: "pending", error_message: null })
    .eq("status", "failed")
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
