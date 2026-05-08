import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import queueData from "@/admin-assets/content/14-day-queue.json";

export const runtime = "edge";

// Dynamic brand-styled image for an Instagram post. Meta's media-create
// endpoint fetches the URL once per publish, so this route just needs to
// return a deterministic 1080x1350 PNG given a day number (and optional
// slide index for carousel posts). No state, no DB read.
//
// URLs:
//   /api/og/post/1            — single image for day 1 (static / hook)
//   /api/og/post/2?slide=0    — carousel slide 0 of day 2
//
// 4:5 portrait (1080x1350) is the IG slot that takes the most feed space
// without being clipped — the safest single canvas for static + carousel
// posts. Reels are 1080x1920 but Opus Clip handles those.

const POSTS = (queueData as { queue: Array<{
  day: number;
  hook: string;
  format: string;
  caption: string;
  cta: string;
  keyword_target: string;
  slide_outline?: string[];
}> }).queue;

const C = {
  bg:      "#05070F",
  surface: "#0E1530",
  blue:    "#2B7BFF",
  cyan:    "#22D3EE",
  gold:    "#F0C05A",
  ink:     "rgba(255,255,255,0.92)",
  ink60:   "rgba(255,255,255,0.60)",
  ink40:   "rgba(255,255,255,0.40)",
} as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ day: string }> },
) {
  const { day: dayStr } = await params;
  const day = parseInt(dayStr, 10);
  const post = POSTS.find((p) => p.day === day);
  if (!post) {
    return new Response(`Post day ${dayStr} not found`, { status: 404 });
  }

  const slideStr = req.nextUrl.searchParams.get("slide");
  const slide = slideStr !== null ? parseInt(slideStr, 10) : null;

  // Headline source: hook for static; slide outline line for carousel.
  // Strip the "Slide N — " prefix that the JSON uses for outlines.
  let headline = post.hook;
  let eyebrow = "EasyTradeSetup · Free chart sample";
  if (slide !== null && post.slide_outline?.[slide]) {
    headline = post.slide_outline[slide].replace(/^Slide\s+\d+\s*[—-]\s*/i, "").replace(/^[^:]*:\s*/, "");
    eyebrow = `Slide ${slide + 1} of ${post.slide_outline.length}`;
  }

  const isHook = slide === null || slide === 0;

  return new ImageResponse(
    (
      <div
        style={{
          width:  "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${C.bg} 0%, ${C.surface} 55%, #0a1224 100%)`,
          padding: 80,
          fontFamily: "sans-serif",
          color: C.ink,
          position: "relative",
        }}
      >
        {/* Soft glow accent */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 700,
            borderRadius: 9999,
            background: "radial-gradient(ellipse, rgba(43,123,255,0.22), transparent 65%)",
          }}
        />

        {/* Brand row — top-left */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.blue} 0%, ${C.cyan} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <svg
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4 10-11" />
            </svg>
          </div>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>
            EasyTradeSetup
          </span>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            marginTop: 80,
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(34,211,238,0.12)",
            border: "1px solid rgba(34,211,238,0.40)",
            color: C.cyan,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            alignSelf: "flex-start",
          }}
        >
          {eyebrow}
        </div>

        {/* Headline — main visual element */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: isHook ? 88 : 72,
              fontWeight: 800,
              letterSpacing: -2.5,
              lineHeight: 1.05,
              color: "#fff",
              maxWidth: 920,
            }}
          >
            {headline}
          </div>

          {slide === null && (
            <div
              style={{
                marginTop: 36,
                fontSize: 26,
                color: C.ink60,
                fontWeight: 500,
                lineHeight: 1.4,
                maxWidth: 880,
              }}
            >
              {post.cta}
            </div>
          )}
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.10)",
            color: C.ink40,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <span>easytradesetup.com</span>
          <span style={{ color: C.gold }}>Educational. Not advice.</span>
        </div>
      </div>
    ),
    {
      width:  1080,
      height: 1350,
      headers: {
        // 5min cache so Meta's fetcher doesn't hit us repeatedly during a
        // single publish, but a re-publish gets fresh content quickly.
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  );
}
