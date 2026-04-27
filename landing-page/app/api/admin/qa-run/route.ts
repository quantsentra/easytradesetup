import "server-only";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { runSuite } from "@/lib/qa-suite";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Allow generous walltime — full suite ≈ 15s but slow networks can stretch.
export const maxDuration = 60;

// Triggers a full QA suite run. Persists the result to qa_runs so the admin
// page can render history and diff regressions across deploys.

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  if (!(await isAdmin(user.id))) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  // Origin determines which deploy the suite probes. Honour the Host header
  // (Vercel sets it to the resolved deployment URL) — falls back to www.
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;

  const result = await runSuite(origin);

  // Persist. If qa_runs migration hasn't been applied, return the result
  // anyway so the operator can run the suite + see the missing-table check
  // surface itself as a fail.
  let persistedId: string | null = null;
  let persistError: string | null = null;
  try {
    const supa = createSupabaseAdmin();
    const { data, error } = await supa
      .from("qa_runs")
      .insert({
        ran_by: user.id,
        version: result.version,
        git_sha: result.gitSha,
        vercel_env: result.vercelEnv,
        origin: result.origin,
        duration_ms: result.durationMs,
        total: result.totals.total,
        passed: result.totals.passed,
        warned: result.totals.warned,
        failed: result.totals.failed,
        results: result.results,
      })
      .select("id")
      .single();
    if (error) throw error;
    persistedId = data?.id || null;
  } catch (e) {
    persistError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    ok: true,
    runId: persistedId,
    persistError,
    ...result,
  });
}
