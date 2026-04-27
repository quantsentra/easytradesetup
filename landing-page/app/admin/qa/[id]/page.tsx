import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { CheckResult, Category } from "@/lib/qa-suite";
import { CATEGORIES } from "@/lib/qa-suite";

export const metadata = {
  title: "QA run · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type RunDetail = {
  id: string;
  ran_at: string;
  version: string;
  git_sha: string | null;
  vercel_env: string | null;
  origin: string | null;
  duration_ms: number;
  total: number;
  passed: number;
  warned: number;
  failed: number;
  results: CheckResult[];
};

async function loadRun(id: string): Promise<RunDetail | null> {
  try {
    const supa = createSupabaseAdmin();
    const { data, error } = await supa
      .from("qa_runs")
      .select("id, ran_at, version, git_sha, vercel_env, origin, duration_ms, total, passed, warned, failed, results")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return data as RunDetail;
  } catch {
    return null;
  }
}

function statusBadge(s: CheckResult["status"]) {
  if (s === "pass") return <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />pass</span>;
  if (s === "warn") return <span className="tz-chip tz-chip-amber">⚠ warn</span>;
  return <span className="tz-chip" style={{ background: "rgba(217,59,59,0.10)", color: "var(--tz-loss)", borderColor: "rgba(217,59,59,0.35)" }}>✗ fail</span>;
}

const categoryDescriptions: Record<Category, string> = {
  Build: "Runtime version + deployment metadata.",
  Env: "Required env vars across Stripe, Supabase, Resend, Sentry.",
  Security: "HTTPS, CSP, frame protections, surface hardening.",
  Functional: "Critical pages + APIs return expected status codes.",
  SEO: "Title, meta, Open Graph, JSON-LD, sitemap, robots.",
  Database: "Supabase reachable + required tables / columns present.",
  Pricing: "FX drift, USD↔INR coherence, launch window sanity.",
  UX: "Home page copy contracts — brand, CTAs, no stale refund language.",
};

export default async function QaRunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await loadRun(id);
  if (!run) notFound();

  const grouped = new Map<Category, CheckResult[]>();
  for (const cat of CATEGORIES) grouped.set(cat, []);
  for (const r of run.results) {
    const list = grouped.get(r.category) || [];
    list.push(r);
    grouped.set(r.category, list);
  }

  // Surface failures and warnings first within each category
  for (const list of grouped.values()) {
    list.sort((a, b) => {
      const order = { fail: 0, warn: 1, pass: 2 };
      return order[a.status] - order[b.status];
    });
  }

  const failures = run.results.filter((r) => r.status === "fail");
  const warnings = run.results.filter((r) => r.status === "warn");

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">QA run.</h1>
          <div className="tz-topbar-sub">
            {new Date(run.ran_at).toISOString().slice(0, 19).replace("T", " ")} UTC ·
            {" "}{run.git_sha ? <span className="font-mono">{run.git_sha.slice(0, 7)}</span> : "local"} ·
            {" "}{run.vercel_env || "local"} · v{run.version} ·
            {" "}{(run.duration_ms / 1000).toFixed(1)}s
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/qa" className="tz-btn">← All runs</Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="tz-kpi">
          <div className="tz-kpi-label">Total</div>
          <div className="tz-kpi-value">{run.total}</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Passed</div>
          <div className="tz-kpi-value" style={{ color: "var(--tz-win)" }}>{run.passed}</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Warnings</div>
          <div className="tz-kpi-value" style={{ color: "var(--tz-amber)" }}>{run.warned}</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Red flags</div>
          <div className="tz-kpi-value" style={{ color: run.failed > 0 ? "var(--tz-loss)" : "var(--tz-ink-dim)" }}>{run.failed}</div>
        </div>
      </div>

      {/* Red flags banner — visible above the fold so blockers can't hide */}
      {failures.length > 0 && (
        <div className="tz-card mb-6" style={{
          borderColor: "rgba(217,59,59,0.45)",
          background: "linear-gradient(135deg, rgba(217,59,59,0.07) 0%, transparent 60%), var(--tz-surface)",
        }}>
          <div className="tz-card-head">
            <div>
              <div className="tz-card-title" style={{ color: "var(--tz-loss)" }}>
                ✗ {failures.length} red flag{failures.length === 1 ? "" : "s"} — fix before launch
              </div>
              <div className="tz-card-sub">
                These are blocking. Each shows the failing condition and a remediation hint where available.
              </div>
            </div>
          </div>
          <ul className="space-y-2 text-[13px]">
            {failures.map((r) => (
              <li key={r.id} style={{ color: "var(--tz-ink)" }}>
                <strong>[{r.category}]</strong> {r.name} —
                {" "}<span style={{ color: "var(--tz-loss)" }}>{r.detail}</span>
                {r.fix && (
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--tz-ink-dim)", paddingLeft: 16 }}>
                    → {r.fix}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && failures.length === 0 && (
        <div className="tz-card mb-6" style={{
          borderColor: "rgba(180,114,22,0.35)",
          background: "linear-gradient(135deg, rgba(180,114,22,0.05) 0%, transparent 60%), var(--tz-surface)",
        }}>
          <div className="tz-card-head">
            <div>
              <div className="tz-card-title" style={{ color: "var(--tz-amber)" }}>
                ⚠ {warnings.length} warning{warnings.length === 1 ? "" : "s"} — non-blocking, optimise when possible
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Per-category breakdown */}
      {CATEGORIES.map((cat) => {
        const items = grouped.get(cat) || [];
        if (items.length === 0) return null;
        const fails = items.filter((i) => i.status === "fail").length;
        const warns = items.filter((i) => i.status === "warn").length;
        const passes = items.filter((i) => i.status === "pass").length;
        const allGreen = fails === 0 && warns === 0;
        return (
          <div key={cat} className="tz-card mb-4" style={{ padding: 0, overflow: "hidden" }}>
            <div className="tz-card-head" style={{
              padding: "16px 20px", marginBottom: 0,
              borderBottom: "1px solid var(--tz-border)",
              display: "flex", alignItems: "center", gap: 16,
              flexWrap: "wrap",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tz-card-title">{cat}</div>
                <div className="tz-card-sub">{categoryDescriptions[cat]}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {allGreen ? (
                  <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />all green</span>
                ) : (
                  <>
                    {fails > 0 && <span className="tz-chip" style={{ background: "rgba(217,59,59,0.10)", color: "var(--tz-loss)", borderColor: "rgba(217,59,59,0.35)" }}>{fails} fail</span>}
                    {warns > 0 && <span className="tz-chip tz-chip-amber">{warns} warn</span>}
                    {passes > 0 && <span className="tz-chip tz-chip-cyan">{passes} pass</span>}
                  </>
                )}
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="tz-table" style={{ minWidth: 720 }}>
                <thead>
                  <tr>
                    <th style={{ width: 90 }}>Status</th>
                    <th>Check</th>
                    <th>Detail</th>
                    <th style={{ width: 80 }}>Took</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.id}>
                      <td>{statusBadge(r.status)}</td>
                      <td>
                        <div style={{ color: "var(--tz-ink)" }}>{r.name}</div>
                        <div className="font-mono text-[10.5px]" style={{ color: "var(--tz-ink-mute)" }}>{r.id}</div>
                      </td>
                      <td className="text-[12.5px]" style={{ color: "var(--tz-ink-dim)" }}>
                        <div>{r.detail}</div>
                        {r.fix && r.status !== "pass" && (
                          <div className="text-[11.5px] mt-1" style={{ color: "var(--tz-ink-mute)" }}>
                            → {r.fix}
                          </div>
                        )}
                      </td>
                      <td className="tz-num text-[12px]" style={{ color: "var(--tz-ink-mute)" }}>
                        {r.durationMs}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Run id · {run.id}
      </p>
    </>
  );
}
