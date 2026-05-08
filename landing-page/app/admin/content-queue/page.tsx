import type { Metadata } from "next";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const metadata: Metadata = {
  title: "Content queue · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Post = {
  day: number;
  date: string;
  platform: "instagram" | "youtube_shorts";
  format: "carousel" | "reel" | "short" | "static";
  slides?: number;
  duration_seconds?: number;
  keyword_target: string;
  hook: string;
  slide_outline?: string[];
  script?: string[];
  caption: string;
  image_prompt: string;
  cta: string;
};

type Queue = {
  generated: string;
  horizon_days: number;
  platforms: string[];
  cadence: string;
  voice_rules: string[];
  hashtag_pool: string[];
  queue: Post[];
};

async function loadQueue(): Promise<Queue> {
  const file = path.join(process.cwd(), "admin-assets", "content", "14-day-queue.json");
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as Queue;
}

function PlatformPill({ value }: { value: Post["platform"] }) {
  const map = {
    instagram:       { bg: "rgba(232,67,147,0.15)", fg: "#FF6B9D", label: "Instagram" },
    youtube_shorts:  { bg: "rgba(255,77,79,0.15)",  fg: "#FF6B6B", label: "YT Short" },
  } as const;
  const { bg, fg, label } = map[value];
  return (
    <span
      className="font-mono"
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: bg,
        color: fg,
        borderRadius: 4,
        fontSize: 11,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function FormatPill({ value }: { value: Post["format"] }) {
  return (
    <span
      className="font-mono"
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: "rgba(255,255,255,0.04)",
        color: "var(--tz-ink-mute)",
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

export default async function ContentQueuePage() {
  const data = await loadQueue();

  const igCount = data.queue.filter((p) => p.platform === "instagram").length;
  const ytCount = data.queue.filter((p) => p.platform === "youtube_shorts").length;

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Content queue.</h1>
          <div className="tz-topbar-sub">
            14 days · {igCount} Instagram + {ytCount} YouTube Shorts · drafted from SEO keyword research.
            Sunday 30min: review, paste captions to Meta Business Suite + YT Studio, schedule.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/seo-keywords" className="tz-btn">↗ SEO keywords</Link>
          <a href="https://business.facebook.com/" target="_blank" rel="noopener" className="tz-btn">↗ Meta Business Suite</a>
          <a href="https://studio.youtube.com/" target="_blank" rel="noopener" className="tz-btn">↗ YT Studio</a>
        </div>
      </div>

      {/* Cadence + voice rules */}
      <div className="tz-card mb-4" style={{ padding: 18 }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 2fr" }}>
          <div>
            <h3 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-ink-mute)" }}>
              Cadence
            </h3>
            <p className="text-[13px]" style={{ color: "var(--tz-ink)", margin: 0, lineHeight: 1.6 }}>
              {data.cadence}
            </p>
            <p className="text-[11.5px] font-mono mt-3" style={{ color: "var(--tz-ink-mute)", margin: "12px 0 0" }}>
              Generated {data.generated} · Horizon {data.horizon_days} days
            </p>
          </div>
          <div>
            <h3 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-ink-mute)" }}>
              Voice rules
            </h3>
            <ul className="text-[12.5px]" style={{ color: "var(--tz-ink-mute)", margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              {data.voice_rules.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Hashtag pool */}
      <div className="tz-card mb-4" style={{ padding: 18 }}>
        <h3 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-ink-mute)" }}>
          Hashtag pool · pick 5–8 per post
        </h3>
        <p className="font-mono text-[12px]" style={{ color: "var(--tz-ink)", lineHeight: 1.7, margin: 0 }}>
          {data.hashtag_pool.join("  ·  ")}
        </p>
      </div>

      {/* Posts */}
      <h2 className="text-[13px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--tz-ink-mute)" }}>
        14-day queue · paste straight into your scheduler
      </h2>

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr" }}>
        {data.queue.map((p) => (
          <div key={p.day} className="tz-card" style={{ padding: 18 }}>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="font-mono"
                style={{
                  display: "inline-block",
                  padding: "2px 10px",
                  background: "rgba(43,123,255,0.18)",
                  color: "var(--tz-cyan, #22D3EE)",
                  borderRadius: 4,
                  fontSize: 11,
                  letterSpacing: "0.04em",
                }}
              >
                DAY {p.day} · {p.date}
              </span>
              <PlatformPill value={p.platform} />
              <FormatPill value={p.format} />
              {p.slides && (
                <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
                  {p.slides} slides
                </span>
              )}
              {p.duration_seconds && (
                <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
                  {p.duration_seconds}s
                </span>
              )}
            </div>

            <h3 className="text-[15px] font-semibold mb-1" style={{ color: "var(--tz-ink)", lineHeight: 1.35 }}>
              {p.hook}
            </h3>
            <p className="font-mono text-[11px] mb-3" style={{ color: "var(--tz-ink-mute)", margin: "0 0 14px" }}>
              keyword target: <code>{p.keyword_target}</code>  ·  cta: <code>{p.cta}</code>
            </p>

            {/* Outline / script */}
            {(p.slide_outline || p.script) && (
              <div style={{ marginBottom: 14 }}>
                <h4 className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--tz-ink-mute)" }}>
                  {p.slide_outline ? "Slide outline" : "Script"}
                </h4>
                <ul className="text-[12.5px]" style={{ color: "var(--tz-ink)", margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                  {(p.slide_outline ?? p.script ?? []).map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              </div>
            )}

            {/* Caption — copy-pasteable */}
            <div style={{ marginBottom: 14 }}>
              <h4 className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--tz-ink-mute)" }}>
                Caption
              </h4>
              <pre
                className="text-[12.5px]"
                style={{
                  margin: 0,
                  padding: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
                  borderRadius: 6,
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  color: "var(--tz-ink)",
                  lineHeight: 1.55,
                }}
              >
{p.caption}
              </pre>
            </div>

            {/* Image / video brief */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--tz-ink-mute)" }}>
                Visual brief · paste into Canva / Midjourney / Opus prompt
              </h4>
              <p className="text-[12.5px]" style={{ color: "var(--tz-ink-mute)", margin: 0, lineHeight: 1.55 }}>
                {p.image_prompt}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.6 }}>
        Source · landing-page/admin-assets/content/14-day-queue.json · Regenerate weekly with Claude using the SEO keyword research as input · Re-runs idempotent
      </p>
    </>
  );
}
