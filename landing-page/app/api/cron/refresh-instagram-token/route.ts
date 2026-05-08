import { NextResponse, type NextRequest } from "next/server";
import { refreshLongLivedToken } from "@/lib/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Refresh the Instagram long-lived token before its 60-day expiry. Meta
// allows refresh after the token is at least 24h old and before it expires.
// We run weekly to be safe — every refresh resets the 60-day clock.
//
// IMPORTANT: this route can only LOG the refreshed token. Vercel env vars
// are read-only at runtime, so the actual rotation has to be done manually
// in Vercel dashboard (paste new token, redeploy) OR via Vercel CLI in a
// scheduled GitHub Action.
//
// If you want full automation here, we'd need to store the token in
// Supabase + read from there instead of env. For now, log + alert.

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const current = process.env.INSTAGRAM_LONG_TOKEN;
  if (!current) {
    return NextResponse.json(
      { ok: false, error: "INSTAGRAM_LONG_TOKEN not set" },
      { status: 500 },
    );
  }

  try {
    const refreshed = await refreshLongLivedToken(current);
    const expiryDays = Math.round(refreshed.expires_in / 86400);

    // Critical: do NOT log the full token. Log only the prefix + length so
    // the operator can confirm rotation worked without leaking secrets.
    const prefix = refreshed.access_token.slice(0, 12);
    const len = refreshed.access_token.length;
    console.log(
      `[ig-token-refresh] new token ${prefix}... (${len} chars, expires in ~${expiryDays} days)`,
    );

    return NextResponse.json({
      ok: true,
      expires_in_days: expiryDays,
      token_prefix: prefix,
      token_length: len,
      message:
        "Token refreshed. Vercel env is read-only at runtime — copy from logs into INSTAGRAM_LONG_TOKEN on the dashboard, then redeploy.",
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
