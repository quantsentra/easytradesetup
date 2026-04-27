import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { CheckResult } from "@/lib/qa-suite";
import QaDetailView from "@/components/admin/QaDetailView";

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

export default async function QaRunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await loadRun(id);
  if (!run) notFound();

  const failures = run.results.filter((r) => r.status === "fail");

  return (
    <>
      <div className="tz-topbar">
        <div style={{ minWidth: 0 }}>
          <h1 className="tz-topbar-title">QA run.</h1>
          <div className="tz-topbar-sub" style={{ wordBreak: "break-word" }}>
            {new Date(run.ran_at).toISOString().slice(0, 16).replace("T", " ")} UTC ·{" "}
            <span className="font-mono">{run.git_sha ? run.git_sha.slice(0, 7) : "local"}</span> ·{" "}
            {run.vercel_env || "local"} · {(run.duration_ms / 1000).toFixed(1)}s
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/qa" className="tz-btn">← All runs</Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
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
          <div className="tz-kpi-value" style={{ color: run.warned ? "var(--tz-amber)" : "var(--tz-ink-dim)" }}>{run.warned}</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Red flags</div>
          <div className="tz-kpi-value" style={{ color: run.failed > 0 ? "var(--tz-loss)" : "var(--tz-ink-dim)" }}>{run.failed}</div>
        </div>
      </div>

      {/* Above-the-fold red-flag summary so blockers can't hide */}
      {failures.length > 0 && (
        <div className="tz-card mb-5" style={{
          borderColor: "rgba(217,59,59,0.45)",
          background: "linear-gradient(135deg, rgba(217,59,59,0.07) 0%, transparent 60%), var(--tz-surface)",
        }}>
          <div style={{ marginBottom: 10 }}>
            <div className="tz-card-title" style={{ color: "var(--tz-loss)", fontSize: 15 }}>
              ✗ {failures.length} red flag{failures.length === 1 ? "" : "s"}
            </div>
            <div className="tz-card-sub" style={{ fontSize: 12 }}>
              Blocking — fix before launch
            </div>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {failures.map((r) => (
              <li key={r.id} style={{ color: "var(--tz-ink)", fontSize: 13 }}>
                <span style={{ color: "var(--tz-ink-mute)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em" }}>
                  [{r.category}]
                </span>{" "}
                {r.name} —{" "}
                <span style={{ color: "var(--tz-loss)" }}>{r.detail}</span>
                {r.fix && (
                  <div className="text-[11.5px] mt-1" style={{ color: "var(--tz-ink-dim)", paddingLeft: 12 }}>
                    → {r.fix}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Filterable per-category breakdown */}
      <QaDetailView results={run.results} />

      <p className="mt-5 text-[10px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Run id · {run.id}
      </p>
    </>
  );
}
