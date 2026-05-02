import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import TaskCheckbox from "@/components/admin/TaskCheckbox";

export const metadata = {
  title: "Marketing checklist · Admin",
  robots: { index: false, follow: false },
};

type Task = {
  slug: string;
  tier: string;
  position: number;
  title: string;
  detail: string | null;
  link: string | null;
  done: boolean;
  done_at: string | null;
  done_by: string | null;
  note: string | null;
};

const TIER_META: Record<string, { label: string; color: string; rationale: string }> = {
  M0: { label: "Foundation",              color: "#d93b3b", rationale: "One-time wiring that gates the rest. Stripe live, email DKIM, uptime cron, Search Console, founder photo." },
  M1: { label: "AI content factory",      color: "#2B7BFF", rationale: "YouTube + Instagram only. One weekend: channels, Meta Business Suite, prompt library, first batch queued — then it runs itself." },
  M2: { label: "Automated distribution",  color: "#22D3EE", rationale: "Weekly 30min IG batch + 1 YT short (repurposed reel). Monthly long-form YT. Low-touch, compounds. No X / LinkedIn / Reddit." },
  M3: { label: "SEO autopilot",           color: "#F0C05A", rationale: "Programmatic /indicator pages + AI blog + Resend nurture drips. Set up once, harvests organic traffic for years." },
  M4: { label: "Measure + iterate",       color: "#8B5CF6", rationale: "Lightweight check 1x/week on Clarity + Search Console. Double down on winners, no A/B until you have signal." },
};

async function loadTasks(): Promise<Task[]> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("marketing_tasks")
      .select("slug,tier,position,title,detail,link,done,done_at,done_by,note")
      .order("tier", { ascending: true })
      .order("position", { ascending: true });
    return (data as Task[]) || [];
  } catch {
    return [];
  }
}

export default async function MarketingChecklistPage() {
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
  const tierOrder = ["M0", "M1", "M2", "M3", "M4"];

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Marketing checklist.</h1>
          <div className="tz-topbar-sub">
            Solo + AI-first motion. Free tools only. M0 first — nothing in M1+ matters until it&apos;s clean.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/checklist" className="tz-btn">MVP checklist</Link>
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
            Run <code>025_marketing_tasks_simplified.sql</code> then <code>026_marketing_tasks_yt_ig.sql</code> in Supabase SQL editor.
            Migrations live at <code>landing-page/supabase/migrations/</code>.
          </p>
        </div>
      )}

      {/* Progress hero */}
      {total > 0 && (
        <div className="tz-card mb-6" style={{
          background: "radial-gradient(circle at 100% 0%, rgba(34,211,238,0.08), transparent 55%), var(--tz-surface)",
          padding: 24,
        }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.16em]" style={{ color: "var(--tz-ink-mute)" }}>
                Marketing motion · post-launch
              </div>
              <h2 style={{ font: "700 24px var(--tz-display)", letterSpacing: "-0.02em", margin: "8px 0 4px" }}>
                {done} of {total} done
                <span style={{ color: "var(--tz-cyan-dim)" }}> · {pct}%</span>
              </h2>
              <p className="text-[13.5px]" style={{ color: "var(--tz-ink-dim)", maxWidth: 600 }}>
                Pick top of M0, ship, tick. Don&apos;t skip ahead — M0 items unblock everything below.
              </p>
            </div>
            <div style={{ minWidth: 200 }}>
              <div style={{
                height: 10, background: "var(--tz-surface-3)",
                borderRadius: 999, overflow: "hidden",
              }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  background: "linear-gradient(90deg, var(--tz-cyan), var(--tz-acid))",
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
                    link={task.link}
                    initialDone={task.done}
                    initialNote={task.note}
                    doneAt={task.done_at}
                    doneBy={task.done_by}
                    kind="marketing"
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
        Run 025 + 026 migrations to seed · Toggle + notes persist in Supabase · Edit task copy via new migration only
      </p>
    </>
  );
}
