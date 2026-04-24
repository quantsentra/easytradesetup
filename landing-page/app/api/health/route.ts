import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Health check. Hit by Uptime Robot / BetterStack / Vercel cron.
// Returns 200 with { ok: true, checks } when every subsystem responds;
// 503 when any dependency is down. Never caches.
//
// No secrets in the response body — only boolean health flags.

type Check = { ok: boolean; latencyMs: number };
type Report = {
  ok: boolean;
  at: string;
  version: string;
  checks: {
    supabase: Check;
    clerkEnv: { ok: boolean };
    resendEnv: { ok: boolean };
  };
};

async function checkSupabase(): Promise<Check> {
  const start = Date.now();
  try {
    const supa = createSupabaseAdmin();
    const { error } = await supa.from("entitlements").select("user_id", { head: true, count: "exact" }).limit(1);
    if (error) throw error;
    return { ok: true, latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

export async function GET() {
  const supabase = await checkSupabase();
  const clerkEnv = {
    ok: !!process.env.CLERK_SECRET_KEY && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  };
  const resendEnv = { ok: !!process.env.RESEND_API_KEY };

  const report: Report = {
    ok: supabase.ok && clerkEnv.ok,
    at: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
    checks: { supabase, clerkEnv, resendEnv },
  };

  return NextResponse.json(report, {
    status: report.ok ? 200 : 503,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
