import { NextResponse, type NextRequest } from "next/server";
import { UPTIME_TARGETS, pingOne, recordPings } from "@/lib/uptime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel cron entry. Configured in vercel.json to fire every 5 minutes.
//
// Auth: Vercel cron requests carry the project's CRON_SECRET in the
// Authorization header. Reject anything else so the route can't be
// hit from the open internet to spam our uptime ledger.
//
// Pings every URL in UPTIME_TARGETS in parallel (8s timeout per ping)
// and writes one row per probe to public.uptime_pings.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const start = Date.now();
  const results = await Promise.all(UPTIME_TARGETS.map((t) => pingOne(t.url)));

  try {
    await recordPings(results);
  } catch (e) {
    console.error("[uptime/cron] insert failed", e);
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
        results,
      },
      { status: 500 },
    );
  }

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json({
    ok: true,
    total_ms: Date.now() - start,
    pinged: results.length,
    failed: failed.length,
    results,
  });
}
