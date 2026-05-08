import type { Metadata } from "next";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import PostCard from "./PostCard";

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
            Sunday batch: hit Quick-copy buttons → paste into MBS Planner → schedule. ~5min for 7 posts.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/seo-keywords" className="tz-btn">↗ SEO keywords</Link>
          <a href="https://business.facebook.com/latest/content_calendar/" target="_blank" rel="noopener" className="tz-btn">↗ MBS Planner</a>
          <a href="https://studio.youtube.com/" target="_blank" rel="noopener" className="tz-btn">↗ YT Studio</a>
        </div>
      </div>

      {/* Workflow callout — pinned to top so the user sees the pattern every visit */}
      <div
        className="tz-card mb-4"
        style={{
          padding: 18,
          background: "linear-gradient(135deg, rgba(43,123,255,0.10), rgba(34,211,238,0.04))",
          borderColor: "rgba(43,123,255,0.30)",
        }}
      >
        <h3 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
          Sunday workflow · ~5min for 7 posts
        </h3>
        <ol className="text-[13px]" style={{ color: "var(--tz-ink)", margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          <li>Open Meta Business Suite Planner (button top-right ↗)</li>
          <li>For each post: hit <strong>Full caption</strong> → paste · hit <strong>Hashtags</strong> → paste at end</li>
          <li>Drop a chart screenshot or generate visual from <strong>Visual brief</strong> → Canva</li>
          <li>Set publish date → Schedule. Done.</li>
          <li>Reels / YT Shorts: feed long-form to Opus Clip → it auto-publishes both platforms</li>
        </ol>
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
        14-day queue · click Quick copy → paste in scheduler
      </h2>

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr" }}>
        {data.queue.map((p) => (
          <PostCard key={p.day} p={p} hashtagPool={data.hashtag_pool} />
        ))}
      </div>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.6 }}>
        Source · landing-page/admin-assets/content/14-day-queue.json · Regenerate weekly with Claude using the SEO keyword research as input · Re-runs idempotent
      </p>
    </>
  );
}
