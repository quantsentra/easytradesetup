import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { igTokenHealth } from "@/lib/instagram";
import InstagramAdminClient from "./InstagramAdminClient";
import CountdownCell from "./CountdownCell";

export const metadata: Metadata = {
  title: "Auto-publisher · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Row = {
  id:               string;
  day:              number;
  date:             string | null;
  format:           string;
  hook:             string;
  // IG state
  status:           string;
  ig_permalink:     string | null;
  error_message:    string | null;
  attempts:         number;
};

// Compute the next time (UTC) the cron will fire for a given hour:minute
// in UTC. If today's slot has already passed, returns tomorrow's.
function nextCronUtc(hourUtc: number, minuteUtc: number): Date {
  const now = new Date();
  const target = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hourUtc,
    minuteUtc,
    0,
    0,
  ));
  if (target.getTime() <= now.getTime()) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  return target;
}

// Build a map: row.id → ISO timestamp when its post is expected to fire.
// We use queue-position rather than the row's own date field, because the
// cron picks lowest-day pending serially regardless of the date in JSON
// (the JSON dates were only for the Sunday-batch workflow we abandoned).
//
// Position 0 (next pending) → next cron fire
// Position 1                → +1 day
// etc. publishing/published/failed rows get null (no countdown shown).
function buildEstimatedTimes(
  rows: Row[],
  field: "status",
  cronHourUtc: number,
  cronMinuteUtc: number,
): Map<string, string | null> {
  const m = new Map<string, string | null>();
  const baseFire = nextCronUtc(cronHourUtc, cronMinuteUtc);

  // Sort pending rows by day ascending — same order the cron picks.
  const pending = rows
    .filter((r) => r[field] === "pending")
    .sort((a, b) => a.day - b.day);

  pending.forEach((r, i) => {
    const fire = new Date(baseFire.getTime() + i * 86_400_000);
    m.set(r.id, fire.toISOString());
  });

  // Non-pending rows get null
  rows.forEach((r) => {
    if (!m.has(r.id)) m.set(r.id, null);
  });

  return m;
}

export default async function PublisherAdminPage() {
  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("content_posts")
    .select("id, day, date, format, hook, status, ig_permalink, error_message, attempts")
    .order("day", { ascending: true });

  const rows: Row[] = data ?? [];

  // Live IG token/connection health — surfaces the root cause (missing env,
  // expired token, permission) without attempting a publish.
  const igHealth = await igTokenHealth();

  const ig = {
    pending:    rows.filter((r) => r.status === "pending").length,
    publishing: rows.filter((r) => r.status === "publishing").length,
    published:  rows.filter((r) => r.status === "published").length,
    failed:     rows.filter((r) => r.status === "failed").length,
  };

  // Cron schedule from vercel.json:  IG: 30 3 * * *  (03:30 UTC = 09:00 IST)
  const igTimes = buildEstimatedTimes(rows, "status", 3, 30);

  // Top-of-page banner: countdown to the very next IG run.
  const nextIgFire = nextCronUtc(3, 30).toISOString();

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Auto-publisher.</h1>
          <div className="tz-topbar-sub">
            Daily Vercel cron picks the next pending row → renders branded image → posts to Instagram.
            Per-row countdowns below show when each one will fire.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/content-queue" className="tz-btn">↗ Source queue</Link>
          <a href="/api/og/post/1" target="_blank" rel="noopener" className="tz-btn">↗ IG preview</a>
        </div>
      </div>

      {/* IG connection health */}
      <div
        className="tz-card mb-4"
        style={{
          padding: 16,
          borderColor: igHealth.ok ? "rgba(34,197,94,0.45)" : "rgba(255,77,79,0.55)",
          background: igHealth.ok ? "rgba(34,197,94,0.06)" : "rgba(255,77,79,0.06)",
        }}
      >
        <div className="font-mono text-[10.5px] uppercase tracking-widest mb-1" style={{ color: igHealth.ok ? "var(--tz-up, #22C55E)" : "var(--tz-loss, #FF4D4F)" }}>
          {igHealth.ok ? "● Instagram connected" : "✕ Instagram NOT publishing"}
        </div>
        {igHealth.ok ? (
          <p className="text-[12.5px]" style={{ color: "var(--tz-ink-dim)", margin: 0, lineHeight: 1.55 }}>
            Token valid · posting as <strong>@{igHealth.username}</strong> (user id {igHealth.userId}).
            The daily cron can publish.
          </p>
        ) : (
          <p className="text-[12.5px]" style={{ color: "var(--tz-ink-dim)", margin: 0, lineHeight: 1.55 }}>
            <strong style={{ color: "var(--tz-loss, #FF4D4F)" }}>{igHealth.error}</strong>
            <br />
            Fix: set/refresh <code>INSTAGRAM_LONG_TOKEN</code> + <code>INSTAGRAM_USER_ID</code> in Vercel
            env (Production), then redeploy. Long-lived tokens last ~60 days; regenerate via Meta /
            Graph API Explorer if expired.
          </p>
        )}
      </div>

      {error ? (
        <div className="tz-card mb-4" style={{ padding: 18, borderColor: "rgba(255,77,79,0.5)" }}>
          <h3 className="text-[13px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--tz-loss, #FF4D4F)" }}>
            DB read failed
          </h3>
          <p className="text-[12.5px]" style={{ color: "var(--tz-ink-mute)", margin: 0 }}>
            {error.message}. Apply migration <code>027_content_posts.sql</code> first, then click <strong>Sync from JSON</strong>.
          </p>
        </div>
      ) : null}

      {/* Counts — IG row */}
      <div className="mb-4">
        <h2 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "#FF6B9D", display: "flex", alignItems: "center", gap: 12 }}>
          <span>Instagram · cron 09:00 IST daily</span>
          <span style={{ color: "var(--tz-ink-mute)" }}>·</span>
          <span style={{ color: "var(--tz-cyan, #22D3EE)", textTransform: "none", letterSpacing: 0 }}>
            next run <CountdownCell target={nextIgFire} />
          </span>
        </h2>
        <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          <CountCard label="Pending" value={ig.pending} color="var(--tz-cyan, #22D3EE)" />
          <CountCard label="Publishing" value={ig.publishing} color="var(--tz-amber, #FFB341)" />
          <CountCard label="Published" value={ig.published} color="var(--tz-up, #22C55E)" />
          <CountCard label="Failed" value={ig.failed} color="var(--tz-loss, #FF4D4F)" />
        </div>
      </div>

      {/* Actions (client) */}
      <InstagramAdminClient />

      {/* Rows */}
      <h2 className="text-[13px] font-mono uppercase tracking-widest mt-6 mb-3" style={{ color: "var(--tz-ink-mute)" }}>
        Posts · {rows.length} total
      </h2>

      <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--tz-border, rgba(255,255,255,0.08))", background: "rgba(255,255,255,0.02)" }}>
              <Th>Day</Th>
              <Th>Format</Th>
              <Th>Hook</Th>
              <Th>IG</Th>
              <Th>IG ETA</Th>
              <Th>IG result</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <Td><strong>{r.day}</strong></Td>
                <Td><span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>{r.format}</span></Td>
                <Td>{r.hook}</Td>
                <Td><StatusPill value={r.status} /></Td>
                <Td>
                  <CountdownCell target={igTimes.get(r.id) ?? null} />
                </Td>
                <Td>
                  {r.ig_permalink ? (
                    <a href={r.ig_permalink} target="_blank" rel="noopener" className="font-mono text-[11px]" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
                      ↗ live
                    </a>
                  ) : r.error_message ? (
                    <span
                      title={r.error_message}
                      className="font-mono text-[11px] cursor-help"
                      style={{ color: "var(--tz-loss, #FF4D4F)" }}
                    >
                      {r.error_message.slice(0, 50)}{r.error_message.length > 50 ? "…" : ""}
                    </span>
                  ) : (
                    <span style={{ color: "var(--tz-ink-mute)" }}>—</span>
                  )}
                </Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "var(--tz-ink-mute)" }}>
                  No posts in DB yet. Click <strong>Sync from JSON</strong> above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.6 }}>
        Source · 100-day-queue.json · IG cron 03:30 UTC (09:00 IST) · ETA = serial position × daily cron tick
      </p>
    </>
  );
}

function CountCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="tz-card" style={{ padding: 14 }}>
      <div className="font-mono text-[10.5px] uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, marginTop: 4, lineHeight: 1.1 }}>{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="font-mono text-[10.5px] uppercase tracking-widest"
      style={{ textAlign: "left", padding: "10px 14px", color: "var(--tz-ink-mute)", fontWeight: 500 }}
    >
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ padding: "10px 14px", color: "var(--tz-ink)", verticalAlign: "top" }}>
      {children}
    </td>
  );
}

function StatusPill({ value }: { value: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    pending:    { bg: "rgba(34,211,238,0.16)",  fg: "#22D3EE" },
    publishing: { bg: "rgba(255,179,65,0.16)",  fg: "#FFB341" },
    published:  { bg: "rgba(34,197,94,0.16)",   fg: "#22C55E" },
    failed:     { bg: "rgba(255,77,79,0.16)",   fg: "#FF4D4F" },
    skipped:    { bg: "rgba(255,255,255,0.06)", fg: "rgba(255,255,255,0.55)" },
  };
  const s = map[value] ?? { bg: "rgba(255,255,255,0.06)", fg: "rgba(255,255,255,0.55)" };
  return (
    <span
      className="font-mono"
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: s.bg,
        color: s.fg,
        borderRadius: 4,
        fontSize: 11,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {value}
    </span>
  );
}
