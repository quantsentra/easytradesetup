import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Keep-alive cron. Supabase free-tier projects auto-pause after ~7 days
// with no database activity; a paused project drops its DNS record and
// every getUser()/query then hangs, which surfaced as a site-wide 504
// (MIDDLEWARE_INVOCATION_TIMEOUT). This route runs a trivial DB touch on
// a daily schedule so the idle timer never reaches the pause threshold.
//
// Note: this PREVENTS pausing. It cannot un-pause an already-paused
// project — that requires a manual Restore in the Supabase dashboard.
//
// Auth: Vercel cron sends CRON_SECRET as a Bearer token. Reject anything
// else so the open internet can't poke our DB on demand.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const start = Date.now();
  try {
    // HEAD-style count query: touches the DB, transfers no rows. `admins`
    // is a tiny always-present table (migration 001).
    const supa = createSupabaseAdmin();
    const { error } = await supa
      .from("admins")
      .select("user_id", { count: "exact", head: true });

    if (error) {
      console.error("[keepalive] query failed", error);
      return NextResponse.json(
        { ok: false, error: error.message, ms: Date.now() - start },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, ms: Date.now() - start });
  } catch (e) {
    console.error("[keepalive] threw", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e), ms: Date.now() - start },
      { status: 500 },
    );
  }
}
