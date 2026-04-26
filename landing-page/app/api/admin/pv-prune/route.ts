import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Auth: shared-secret bearer token, NOT user session.
// Caller (GitHub Actions schedule) sends:
//   Authorization: Bearer ${PV_PRUNE_SECRET}
// Without the env var set, every call returns 503 — fail-closed.

const RETENTION_DAYS = 90;

export async function POST(req: Request) {
  const secret = process.env.PV_PRUNE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "PV_PRUNE_SECRET not configured" },
      { status: 503 },
    );
  }

  const auth = req.headers.get("authorization") || "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (provided !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 24 * 3600e3).toISOString();

  try {
    const supa = createSupabaseAdmin();
    const { error, count } = await supa
      .from("pageviews")
      .delete({ count: "exact" })
      .lt("at", cutoffDate);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      deleted: count ?? 0,
      cutoff: cutoffDate,
      retentionDays: RETENTION_DAYS,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}

// Allow GET as no-op health check (for browser quick-test).
export async function GET() {
  return NextResponse.json({
    ok: true,
    info: "POST with Bearer token to prune. Retention: " + RETENTION_DAYS + " days.",
  });
}
