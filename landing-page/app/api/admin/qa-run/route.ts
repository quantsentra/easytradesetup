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

  // Origin determines which deploy the suite probes. Marketing routes live
  // on www (or apex) — when the admin caller is on portal.* / a Vercel
  // preview URL / localhost, probing the request host returns 307s for
  // every marketing path because middleware bounces non-portal pages back
  // to sign-in. So:
  //   1. body { origin } overrides everything (manual diagnostic from devs)
  //   2. production → always use the canonical marketing origin
  //   3. local / preview → fall back to the request host
  const url = new URL(req.url);
  let bodyOrigin: string | null = null;
  try {
    if ((req.headers.get("content-length") || "0") !== "0") {
      const body = (await req.json()) as { origin?: string };
      const v = (body.origin || "").trim();
      if (v && /^https?:\/\//i.test(v)) bodyOrigin = v.replace(/\/+$/, "");
    }
  } catch { /* empty / invalid body — fine */ }

  const origin =
    bodyOrigin
    ?? (process.env.VERCEL_ENV === "production"
        ? "https://www.easytradesetup.com"
        : `${url.protocol}//${url.host}`);

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
