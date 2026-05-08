import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-gated proxy that triggers the publish-instagram cron route. The cron
// itself is Bearer-authed via CRON_SECRET, which the browser can't see — so
// admin pages call this proxy, which adds the Authorization header server-
// side and forwards to the actual cron endpoint.
//
// Identical effect to the scheduled 09:00 IST run, just on demand for testing.
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not set" }, { status: 500 });
  }

  // Build absolute URL — Vercel functions can't fetch relative.
  const origin = new URL(req.url).origin;
  const target = `${origin}/api/cron/publish-instagram`;

  try {
    const res = await fetch(target, {
      method: "GET",
      headers: { authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    const body = await res.json();
    return NextResponse.json(body, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
