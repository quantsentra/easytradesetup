import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import QaRunButton from "@/components/admin/QaRunButton";

export const metadata = {
  title: "QA suite · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type RunRow = {
  id: string;
  ran_at: string;
  version: string;
  git_sha: string | null;
  vercel_env: string | null;
  duration_ms: number;
  total: number;
  passed: number;
  warned: number;
  failed: number;
};

async function loadRuns(): Promise<{ rows: RunRow[]; tableMissing: boolean; error: string | null }> {
  try {
    const supa = createSupabaseAdmin();
    const { data, error } = await supa
      .from("qa_runs")
      .select("id, ran_at, version, git_sha, vercel_env, duration_ms, total, passed, warned, failed")
      .order("ran_at", { ascending: false })
      .limit(30);
    if (error) {
      const msg = error.message || String(error);
      const tableMissing = /relation .* does not exist/i.test(msg) || msg.includes("does not exist");
      return { rows: [], tableMissing, error: msg };
    }
    return { rows: (data as RunRow[]) || [], tableMissing: false, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { rows: [], tableMissing: false, error: msg };
  }
}

function relTime(iso: string): string {
  const sec = (Date.now() - Date.parse(iso)) / 1000;
  if (sec < 60) return `${Math.floor(sec)}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86_400) return `${Math.floor(sec / 3600)}h ago`;
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ");
}

function statusChip(row: RunRow) {
  if (row.failed > 0) {
    return (
      <span className="tz-chip" style={{ background: "rgba(217,59,59,0.10)", color: "var(--tz-loss)", borderColor: "rgba(217,59,59,0.35)" }}>
        ✗ {row.failed} fail
      </span>
    );
  }
  if (row.warned > 0) return <span className="tz-chip tz-chip-amber">⚠ {row.warned} warn</span>;
  return <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />Green</span>;
}

export default async function QaPage() {
  const { rows, tableMissing, error } = await loadRuns();
  const latest = rows[0] || null;

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">QA suite.</h1>
          <div className="tz-topbar-sub">
            Pre-deploy go-live readiness gate · 50+ checks
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin" className="tz-btn">← Overview</Link>
        </div>
      </div>

      {/* Trigger card */}
      <div className="tz-card mb-5">
        <div className="tz-card-head" style={{ marginBottom: 14 }}>
          <div style={{ minWidth: 0 }}>
            <div className="tz-card-title">Run a fresh suite</div>
            <div className="tz-card-sub">
              Probes <span className="font-mono" style={{ color: "var(--tz-acid-dim)" }}>
                {process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local"}
              </span> · {process.env.VERCEL_ENV || "local"}
            </div>
          </div>
        </div>
        <QaRunButton />
      </div>

      {/* KPI strip from latest run */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
          <div className="tz-kpi">
            <div className="tz-kpi-label">Total</div>
            <div className="tz-kpi-value">{latest.total}</div>
          </div>
          <div className="tz-kpi">
            <div className="tz-kpi-label">Passed</div>
            <div className="tz-kpi-value" style={{ color: "var(--tz-win)" }}>{latest.passed}</div>
          </div>
          <div className="tz-kpi">
            <div className="tz-kpi-label">Warnings</div>
            <div className="tz-kpi-value" style={{ color: latest.warned ? "var(--tz-amber)" : "var(--tz-ink-dim)" }}>{latest.warned}</div>
          </div>
          <div className="tz-kpi">
            <div className="tz-kpi-label">Red flags</div>
            <div className="tz-kpi-value" style={{ color: latest.failed > 0 ? "var(--tz-loss)" : "var(--tz-ink-dim)" }}>{latest.failed}</div>
          </div>
        </div>
      )}

      {/* Migration helper */}
      {tableMissing && (
        <div className="tz-card mb-5" style={{
          borderColor: "rgba(180,114,22,0.35)",
          background: "linear-gradient(135deg, rgba(180,114,22,0.05) 0%, transparent 60%), var(--tz-surface)",
        }}>
          <h2 style={{ font: "600 15px var(--tz-display)", color: "var(--tz-amber)", margin: "0 0 6px" }}>
            qa_runs table not found
          </h2>
          <p className="text-[13px]" style={{ color: "var(--tz-ink-dim)" }}>
            Apply <code>supabase/migrations/020_qa_runs.sql</code> in Supabase SQL editor, then refresh.
          </p>
        </div>
      )}

      {error && !tableMissing && (
        <div className="tz-card mb-5" style={{
          borderColor: "rgba(217,59,59,0.35)",
          background: "rgba(217,59,59,0.05)",
        }}>
          <p className="font-mono text-[12px]" style={{ color: "var(--tz-loss)" }}>
            Error: {error}
          </p>
        </div>
      )}

      {/* Run history — table on >=md, card list on mobile */}
      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tz-card-head" style={{
          padding: "16px 18px", marginBottom: 0,
          borderBottom: "1px solid var(--tz-border)",
        }}>
          <div style={{ minWidth: 0 }}>
            <div className="tz-card-title">Run history · last 30</div>
            <div className="tz-card-sub">Tap any run for the per-check breakdown</div>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="text-[13px] p-6" style={{ color: "var(--tz-ink-mute)" }}>
            No runs yet. Hit <strong>Run QA suite</strong> above.
          </p>
        ) : (
          <>
            {/* Desktop / tablet — full table */}
            <div className="hidden sm:block" style={{ overflowX: "auto" }}>
              <table className="tz-table" style={{ minWidth: 720 }}>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Commit</th>
                    <th>Env</th>
                    <th>P · W · F</th>
                    <th>Dur.</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{statusChip(r)}</td>
                      <td className="font-mono text-[11.5px]" style={{ color: "var(--tz-acid-dim)" }}>
                        {r.git_sha ? r.git_sha.slice(0, 7) : "—"}
                      </td>
                      <td className="text-[12.5px]" style={{ color: "var(--tz-ink-dim)" }}>
                        {r.vercel_env || "—"}
                      </td>
                      <td className="tz-num text-[12.5px]">
                        <span style={{ color: "var(--tz-win)" }}>{r.passed}</span>
                        <span style={{ color: "var(--tz-ink-mute)", margin: "0 4px" }}>·</span>
                        <span style={{ color: r.warned ? "var(--tz-amber)" : "var(--tz-ink-mute)" }}>{r.warned}</span>
                        <span style={{ color: "var(--tz-ink-mute)", margin: "0 4px" }}>·</span>
                        <span style={{ color: r.failed ? "var(--tz-loss)" : "var(--tz-ink-mute)" }}>{r.failed}</span>
                      </td>
                      <td className="tz-num text-[12px]" style={{ color: "var(--tz-ink-dim)" }}>
                        {(r.duration_ms / 1000).toFixed(1)}s
                      </td>
                      <td className="tz-num text-[12px]">
                        <Link href={`/admin/qa/${r.id}`} style={{ color: "var(--tz-acid-dim)" }}>
                          {relTime(r.ran_at)} →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile — card list */}
            <ul className="sm:hidden" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {rows.map((r) => (
                <li
                  key={r.id}
                  style={{
                    borderBottom: "1px solid var(--tz-border)",
                    padding: "12px 14px",
                  }}
                >
                  <Link
                    href={`/admin/qa/${r.id}`}
                    style={{ display: "block", color: "var(--tz-ink)", textDecoration: "none" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      {statusChip(r)}
                      <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
                        {relTime(r.ran_at)}
                      </span>
                    </div>
                    <div className="tz-num text-[13px] mt-2" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span><span style={{ color: "var(--tz-win)" }}>{r.passed}</span> pass</span>
                      <span style={{ color: r.warned ? "var(--tz-amber)" : "var(--tz-ink-mute)" }}>
                        <strong>{r.warned}</strong> warn
                      </span>
                      <span style={{ color: r.failed ? "var(--tz-loss)" : "var(--tz-ink-mute)" }}>
                        <strong>{r.failed}</strong> fail
                      </span>
                      <span style={{ color: "var(--tz-ink-mute)", marginLeft: "auto" }}>
                        {(r.duration_ms / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <div className="font-mono text-[10.5px] mt-1.5" style={{ color: "var(--tz-ink-mute)" }}>
                      {r.git_sha ? r.git_sha.slice(0, 7) : "local"} · {r.vercel_env || "—"}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <p className="mt-5 text-[10px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Read-only · zero side effects · safe in production
      </p>
    </>
  );
}
