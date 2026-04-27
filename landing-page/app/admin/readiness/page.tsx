import Link from "next/link";
import { loadReadiness, type ReadinessRow, type Category, type Severity } from "@/lib/launch-readiness";
import ReadinessAckButton from "@/components/admin/ReadinessAckButton";

export const metadata = {
  title: "Launch readiness · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const CATEGORY_ORDER: Category[] = ["Email", "Payments", "Database", "Security", "Operations", "Content"];

function severityChip(s: Severity, done: boolean) {
  if (done) {
    return <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />Done</span>;
  }
  if (s === "blocker") {
    return (
      <span className="tz-chip" style={{
        background: "rgba(217,59,59,0.10)", color: "var(--tz-loss)", borderColor: "rgba(217,59,59,0.35)",
      }}>
        ✗ Blocker
      </span>
    );
  }
  return <span className="tz-chip tz-chip-amber">⚠ Warning</span>;
}

export default async function ReadinessPage() {
  const rows = await loadReadiness();

  const blockers = rows.filter((r) => r.severity === "blocker");
  const warnings = rows.filter((r) => r.severity === "warning");
  const blockersDone = blockers.filter((r) => r.effectiveDone).length;
  const warningsDone = warnings.filter((r) => r.effectiveDone).length;
  const allDone = blockers.length > 0 && blockersDone === blockers.length;

  // Group by category for rendering, preserving the canonical order.
  const grouped = new Map<Category, ReadinessRow[]>();
  for (const cat of CATEGORY_ORDER) grouped.set(cat, []);
  for (const r of rows) {
    const list = grouped.get(r.category) || [];
    list.push(r);
    grouped.set(r.category, list);
  }

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Launch readiness.</h1>
          <div className="tz-topbar-sub">
            Pre-prod gate · {blockers.length} blocker{blockers.length === 1 ? "" : "s"} · {warnings.length} warning{warnings.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin" className="tz-btn">← Overview</Link>
        </div>
      </div>

      {/* Hero status — single banner that reads green / amber / red */}
      <div
        className="tz-card mb-6"
        style={
          allDone
            ? { borderColor: "rgba(31,157,85,0.45)", background: "linear-gradient(135deg, rgba(31,157,85,0.07) 0%, transparent 60%), var(--tz-surface)" }
            : blockersDone < blockers.length
              ? { borderColor: "rgba(217,59,59,0.45)", background: "linear-gradient(135deg, rgba(217,59,59,0.07) 0%, transparent 60%), var(--tz-surface)" }
              : { borderColor: "rgba(180,114,22,0.45)", background: "linear-gradient(135deg, rgba(180,114,22,0.05) 0%, transparent 60%), var(--tz-surface)" }
        }
      >
        <div className="tz-card-title" style={{
          color: allDone ? "var(--tz-win)" : blockersDone < blockers.length ? "var(--tz-loss)" : "var(--tz-amber)",
          fontSize: 17,
        }}>
          {allDone
            ? "✓ All blockers cleared — ready for paid traffic"
            : blockersDone < blockers.length
              ? `✗ ${blockers.length - blockersDone} blocker${blockers.length - blockersDone === 1 ? "" : "s"} remaining — fix before paid launch`
              : `⚠ Blockers green · ${warnings.length - warningsDone} warning${warnings.length - warningsDone === 1 ? "" : "s"} optional`}
        </div>
        <div className="tz-card-sub" style={{ marginTop: 4 }}>
          Soft launch (50–200 hand-monitored customers) is fine once Email + Payments + Database blockers are green. Scaled / paid-ad launch waits for full green.
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
        <div className="tz-kpi">
          <div className="tz-kpi-label">Total items</div>
          <div className="tz-kpi-value">{rows.length}</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Done</div>
          <div className="tz-kpi-value" style={{ color: "var(--tz-win)" }}>
            {blockersDone + warningsDone}
          </div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Blockers left</div>
          <div className="tz-kpi-value" style={{ color: blockers.length - blockersDone > 0 ? "var(--tz-loss)" : "var(--tz-ink-dim)" }}>
            {blockers.length - blockersDone}
          </div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Warnings left</div>
          <div className="tz-kpi-value" style={{ color: warnings.length - warningsDone > 0 ? "var(--tz-amber)" : "var(--tz-ink-dim)" }}>
            {warnings.length - warningsDone}
          </div>
        </div>
      </div>

      {/* Per-category */}
      {CATEGORY_ORDER.map((cat) => {
        const items = grouped.get(cat) || [];
        if (items.length === 0) return null;
        const doneCount = items.filter((i) => i.effectiveDone).length;
        return (
          <div key={cat} className="tz-card mb-4" style={{ padding: 0, overflow: "hidden" }}>
            <div className="tz-card-head" style={{
              padding: "16px 18px", marginBottom: 0,
              borderBottom: "1px solid var(--tz-border)",
              display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tz-card-title">{cat}</div>
                <div className="tz-card-sub">
                  {doneCount} / {items.length} done
                </div>
              </div>
              <span className={`tz-chip ${doneCount === items.length ? "tz-chip-acid" : ""}`}>
                {doneCount === items.length ? <span className="tz-chip-dot" /> : null}
                {doneCount} / {items.length}
              </span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    borderBottom: "1px solid var(--tz-border)",
                    padding: "14px 18px",
                    background: item.effectiveDone ? "rgba(31,157,85,0.04)" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        {severityChip(item.severity, item.effectiveDone)}
                        <strong style={{ color: "var(--tz-ink)", fontSize: 14 }}>{item.title}</strong>
                      </div>
                      <p className="text-[12.5px] mt-1.5" style={{ color: "var(--tz-ink-dim)" }}>
                        {item.description}
                      </p>

                      {/* Live status detail (only on auto-detect items) */}
                      {item.status && (
                        <div className="font-mono text-[11px] mt-2" style={{
                          color: item.status.done ? "var(--tz-win)" : "var(--tz-amber)",
                        }}>
                          {item.status.done ? "✓ " : "→ "}{item.status.detail}
                        </div>
                      )}
                      {!item.status && item.ackedAt && (
                        <div className="font-mono text-[11px] mt-2" style={{ color: "var(--tz-ink-mute)" }}>
                          ✓ Acked {new Date(item.ackedAt).toISOString().slice(0, 10)}
                        </div>
                      )}

                      {/* Fix steps — collapsed visual list, always present */}
                      {item.fixSteps.length > 0 && !item.effectiveDone && (
                        <ol style={{
                          marginTop: 8, paddingLeft: 18, fontSize: 12,
                          color: "var(--tz-ink-dim)", lineHeight: 1.5,
                          display: "flex", flexDirection: "column", gap: 2,
                        }}>
                          {item.fixSteps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      )}
                    </div>

                    <div style={{ flexShrink: 0 }}>
                      {item.auto ? (
                        <span className="font-mono text-[10.5px]" style={{
                          color: "var(--tz-ink-mute)", textTransform: "uppercase", letterSpacing: ".06em",
                        }}>
                          Auto-detected
                        </span>
                      ) : (
                        <ReadinessAckButton slug={item.id} acked={item.manualAcked} />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest"
        style={{ color: "var(--tz-ink-mute)" }}>
        Auto-detected items reflect live env / DB state · Manual items use launch_readiness_acks · Edit list in lib/launch-readiness.ts
      </p>
    </>
  );
}
