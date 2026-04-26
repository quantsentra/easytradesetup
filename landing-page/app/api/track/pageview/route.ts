import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SALT = process.env.PAGEVIEW_SALT || "ets-pv-salt-2026";

const SKIP_PREFIXES = ["/api", "/portal", "/admin", "/sign-in", "/sign-up", "/auth"];
const BOT_RE = /bot|crawler|spider|crawling|preview|headless|lighthouse|monitor|uptime/i;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { path?: unknown; referer?: unknown };
    const path = typeof body.path === "string" ? body.path.slice(0, 500) : "";
    const referer = typeof body.referer === "string" ? body.referer.slice(0, 500) : null;

    if (!path || !path.startsWith("/")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (SKIP_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
      return NextResponse.json({ ok: true, skip: true });
    }

    const ua = req.headers.get("user-agent") || "";
    if (BOT_RE.test(ua)) {
      return NextResponse.json({ ok: true, skip: true });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "0.0.0.0";
    const country = req.headers.get("x-vercel-ip-country") || null;

    const day = new Date().toISOString().slice(0, 10);
    const visitorId = crypto
      .createHash("sha256")
      .update(`${SALT}:${ip}:${ua}:${day}`)
      .digest("hex")
      .slice(0, 32);

    const supa = createSupabaseAdmin();
    await supa.from("pageviews").insert({
      visitor_id: visitorId,
      path,
      referer,
      country,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
