import type { Metadata } from "next";
import Link from "next/link";
import queueData from "@/admin-assets/content/100-day-queue.json";
import ContentPreviewClient from "./ContentPreviewClient";

export const metadata: Metadata = {
  title: "Content preview · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Post = {
  day: number;
  date: string;
  format: string;
  theme?: string;
  hook: string;
  caption: string;
  keyword_target: string;
  cta: string;
  slide_outline?: string[];
};

export default function ContentPreviewPage() {
  const queue = (queueData as { queue: Post[] }).queue;

  // Theme + format counts for the summary strip
  const themeCounts = queue.reduce<Record<string, number>>((acc, p) => {
    const t = p.theme ?? "dark-cyan";
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});
  const formatCounts = queue.reduce<Record<string, number>>((acc, p) => {
    acc[p.format] = (acc[p.format] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Content preview.</h1>
          <div className="tz-topbar-sub">
            Visual gallery — every post from the 100-day queue. Click any tile to expand both IG (4:5) and YT (9:16) variants. Filter by theme or format above.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/content-queue" className="tz-btn">↗ Source queue</Link>
          <Link href="/admin/instagram" className="tz-btn">↗ Auto-publisher</Link>
        </div>
      </div>

      {/* Summary strip — counts by theme + format */}
      <div className="tz-card mb-4" style={{ padding: 18 }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <h3 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-ink-mute)" }}>
              By theme · {queue.length} total
            </h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {Object.entries(themeCounts).map(([theme, count]) => (
                <ThemeChip key={theme} theme={theme} count={count} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-ink-mute)" }}>
              By format
            </h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {Object.entries(formatCounts).map(([fmt, count]) => (
                <span
                  key={fmt}
                  className="font-mono"
                  style={{
                    padding: "4px 10px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
                    borderRadius: 6,
                    fontSize: 11,
                    color: "var(--tz-ink)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {fmt} · {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ContentPreviewClient posts={queue} />

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.6 }}>
        Tiles render via /api/og/post/[day] (4:5 IG) and /api/og/post/[day]/yt (9:16 YT) — the same edge route the cron uses to publish · Lazy-loaded
      </p>
    </>
  );
}

function ThemeChip({ theme, count }: { theme: string; count: number }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    "dark-cyan":   { bg: "rgba(34,211,238,0.16)",  fg: "#22D3EE", label: "Dark · Cyan" },
    "dark-gold":   { bg: "rgba(240,192,90,0.16)",  fg: "#F0C05A", label: "Dark · Gold" },
    "light-clean": { bg: "rgba(255,255,255,0.08)", fg: "rgba(255,255,255,0.85)", label: "Light · Clean" },
    "gradient":    { bg: "linear-gradient(135deg, rgba(43,123,255,0.20), rgba(34,211,238,0.18), rgba(240,192,90,0.16))", fg: "#fff", label: "Gradient" },
    "chart":       { bg: "rgba(43,123,255,0.16)",  fg: "#22D3EE", label: "Chart" },
  };
  const s = map[theme] ?? { bg: "rgba(255,255,255,0.04)", fg: "rgba(255,255,255,0.7)", label: theme };
  return (
    <span
      className="font-mono"
      style={{
        padding: "4px 10px",
        background: s.bg,
        color: s.fg,
        borderRadius: 6,
        fontSize: 11,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {s.label} · {count}
    </span>
  );
}
