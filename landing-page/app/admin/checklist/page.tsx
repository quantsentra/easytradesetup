import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import TaskCheckbox from "@/components/admin/TaskCheckbox";

export const metadata = {
  title: "MVP checklist · Admin",
  robots: { index: false, follow: false },
};

type Task = {
  slug: string;
  tier: string;
  position: number;
  title: string;
  detail: string | null;
  done: boolean;
  done_at: string | null;
  done_by: string | null;
  note: string | null;
};

const TIER_META: Record<string, { label: string; color: string; rationale: string }> = {
  P0: { label: "Unblocks revenue",  color: "#d93b3b", rationale: "Ship-blocking. Nothing else matters until these land." },
  P1: { label: "Marketing motion",  color: "#2B7BFF", rationale: "Compounds organic traffic and trust signals once P0 is done." },
  P2: { label: "SEO compounding",   color: "#22D3EE", rationale: "Long-tail surface area. Each page earns over months." },
  P3: { label: "Admin polish",      color: "#F0C05A", rationale: "Faster decisions for you. Won't move revenue alone." },
  P4: { label: "Durability",        color: "#8B5CF6", rationale: "Insurance. Ship before scale, not before launch." },
  P5: { label: "Scale prep",        color: "#888",    rationale: "Wait for signal. Don't pay for capacity you don't need." },
};

async function loadTasks(): Promise<Task[]> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("mvp_tasks")
      .select("slug,tier,position,title,detail,done,done_at,done_by,note")
      .order("tier", { ascending: true })
      .order("position", { ascending: true });
    return (data as Task[]) || [];
  } catch {
    return [];
  }
}

export default async function ChecklistPage() {
  const tasks = await loadTasks();
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Group by tier
  const byTier: Record<string, Task[]> = {};
  for (const t of tasks) {
    if (!byTier[t.tier]) byTier[t.tier] = [];
    byTier[t.tier].push(t);
  }
  const tierOrder = ["P0", "P1", "P2", "P3", "P4", "P5"];

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">MVP checklist.</h1>
          <div className="tz-topbar-sub">
            Frozen P0–P5 backlog. Pick top of P0, ship, tick. No additions until launch.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/architecture" className="tz-btn">Architecture</Link>
          <Link href="/admin" className="tz-btn tz-btn-primary">← Overview</Link>
        </div>
      </div>

      {/* Empty-state hint when migration hasn't run */}
      {total === 0 && (
        <div className="tz-card mb-6" style={{
          borderColor: "rgba(180,114,22,0.35)",
          background: "linear-gradient(135deg, rgba(180,114,22,0.05) 0%, transparent 60%), var(--tz-surface)",
        }}>
          <h2 style={{ font: "600 16px var(--tz-display)", color: "var(--tz-amber)", margin: "0 0 6px" }}>
            Migration pending
          </h2>
          <p className="text-[13.5px]" style={{ color: "var(--tz-ink-dim)" }}>
            Run <code>007_mvp_tasks.sql</code> in Supabase SQL editor to seed this checklist. The migration
            file lives at <code>landing-page/supabase/migrations/007_mvp_tasks.sql</code>.
          </p>
        </div>
      )}

      {/* Progress hero */}
      {total > 0 && (
        <div className="tz-card mb-6" style={{
          background: "radial-gradient(circle at 100% 0%, rgba(43,123,255,0.08), transparent 55%), var(--tz-surface)",
          padding: 24,
        }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.16em]" style={{ color: "var(--tz-ink-mute)" }}>
                MVP focus · frozen scope
              </div>
              <h2 style={{ font: "700 24px var(--tz-display)", letterSpacing: "-0.02em", margin: "8px 0 4px" }}>
                {done} of {total} shipped
                <span style={{ color: "var(--tz-acid-dim)" }}> · {pct}%</span>
              </h2>
              <p className="text-[13.5px]" style={{ color: "var(--tz-ink-dim)", maxWidth: 600 }}>
                Discipline rule: don't add to this list until everything in P0 + P1 is done.
                New ideas → write them in the note of an existing task, or a sticky note off-system.
              </p>
            </div>
            <div style={{ minWidth: 200 }}>
              <div style={{
                height: 10, background: "var(--tz-surface-3)",
                borderRadius: 999, overflow: "hidden",
              }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  background: "linear-gradient(90deg, var(--tz-acid), var(--tz-cyan))",
                  transition: "width .4s",
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tier sections */}
      {tierOrder.map((tier) => {
        const items = byTier[tier];
        if (!items || items.length === 0) return null;
        const meta = TIER_META[tier];
        const tierDone = items.filter((i) => i.done).length;
        const tierPct = Math.round((tierDone / items.length) * 100);

        return (
          <section key={tier} className="tz-card mb-4" style={{ borderLeft: `3px solid ${meta.color}` }}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold" style={{
                  fontSize: 14, color: meta.color, letterSpacing: ".06em",
                }}>
                  {tier}
                </span>
                <h3 className="font-display font-semibold" style={{
                  fontSize: 17, margin: 0, color: "var(--tz-ink)",
                }}>
                  {meta.label}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
                  {tierDone} / {items.length}
                </span>
                <div style={{
                  width: 80, height: 5, background: "var(--tz-surface-3)",
                  borderRadius: 999, overflow: "hidden",
                }}>
                  <div style={{
                    width: `${tierPct}%`, height: "100%",
                    background: meta.color, transition: "width .3s",
                  }} />
                </div>
              </div>
            </div>
            <p className="text-[12.5px]" style={{ color: "var(--tz-ink-mute)", margin: "2px 0 14px" }}>
              {meta.rationale}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {items.map((task) => (
                <li key={task.slug} style={{
                  paddingTop: 12,
                  borderTop: "1px solid var(--tz-border)",
                }}>
                  <TaskCheckbox
                    slug={task.slug}
                    title={task.title}
                    detail={task.detail}
                    initialDone={task.done}
                    initialNote={task.note}
                    doneAt={task.done_at}
                    doneBy={task.done_by}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
        Frozen scope · Edit seed in landing-page/supabase/migrations/007_mvp_tasks.sql · No app-side row inserts allowed
      </p>
    </>
  );
}
