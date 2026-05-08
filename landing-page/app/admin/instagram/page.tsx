import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import InstagramAdminClient from "./InstagramAdminClient";

export const metadata: Metadata = {
  title: "Instagram auto-publisher · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Row = {
  id:           string;
  day:          number;
  date:         string | null;
  format:       string;
  hook:         string;
  status:       string;
  ig_media_id:  string | null;
  ig_permalink: string | null;
  error_message: string | null;
  attempts:     number;
  published_at: string | null;
};

export default async function InstagramAdminPage() {
  const sb = createSupabaseAdmin();
  const { data, error } = await sb
    .from("content_posts")
    .select("id, day, date, format, hook, status, ig_media_id, ig_permalink, error_message, attempts, published_at")
    .order("day", { ascending: true });

  const rows: Row[] = data ?? [];
  const counts = {
    pending:    rows.filter((r) => r.status === "pending").length,
    publishing: rows.filter((r) => r.status === "publishing").length,
    published:  rows.filter((r) => r.status === "published").length,
    failed:     rows.filter((r) => r.status === "failed").length,
    skipped:    rows.filter((r) => r.status === "skipped").length,
  };

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Instagram auto-publisher.</h1>
          <div className="tz-topbar-sub">
            Daily Vercel cron picks the next pending post → renders branded image → POSTs to Instagram Graph API.
            Reels handled separately by Opus Clip.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/content-queue" className="tz-btn">↗ Source queue</Link>
          <a href="/api/og/post/1" target="_blank" rel="noopener" className="tz-btn">↗ Preview Day 1 image</a>
        </div>
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

      {/* Counts */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <CountCard label="Pending" value={counts.pending} color="var(--tz-cyan, #22D3EE)" />
        <CountCard label="Publishing" value={counts.publishing} color="var(--tz-amber, #FFB341)" />
        <CountCard label="Published" value={counts.published} color="var(--tz-up, #22C55E)" />
        <CountCard label="Failed" value={counts.failed} color="var(--tz-loss, #FF4D4F)" />
        <CountCard label="Skipped" value={counts.skipped} color="var(--tz-ink-mute)" />
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
              <Th>Date</Th>
              <Th>Format</Th>
              <Th>Hook</Th>
              <Th>Status</Th>
              <Th>Try #</Th>
              <Th>Result</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <Td><strong>{r.day}</strong></Td>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>{r.date ?? "—"}</span></Td>
                <Td><span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>{r.format}</span></Td>
                <Td>{r.hook}</Td>
                <Td><StatusPill value={r.status} /></Td>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>{r.attempts}</span></Td>
                <Td>
                  {r.ig_permalink ? (
                    <a href={r.ig_permalink} target="_blank" rel="noopener" className="font-mono text-[11px]" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
                      ↗ live
                    </a>
                  ) : r.error_message ? (
                    <span className="font-mono text-[11px]" style={{ color: "var(--tz-loss, #FF4D4F)" }}>{r.error_message.slice(0, 60)}{r.error_message.length > 60 ? "…" : ""}</span>
                  ) : (
                    <span style={{ color: "var(--tz-ink-mute)" }}>—</span>
                  )}
                </Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "var(--tz-ink-mute)" }}>
                  No posts in DB yet. Click <strong>Sync from JSON</strong> above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.6 }}>
        Source · 14-day-queue.json · Cron 03:30 UTC daily (09:00 IST) · Reels excluded — handled by Opus Clip
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
