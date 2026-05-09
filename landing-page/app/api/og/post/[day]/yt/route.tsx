import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import queueData from "@/admin-assets/content/100-day-queue.json";

export const runtime = "edge";

// Vertical 1080x1920 (9:16) variant of the post image — used by the
// YouTube cron pipeline. Cloudinary turns this PNG into a 5-second MP4
// that uploads as a YouTube Short.
//
// Larger headline, fewer chrome elements than the 4:5 IG variant — the
// 9:16 frame fits less horizontal text but more vertical room, so layout
// stacks bigger.

const POSTS = (queueData as { queue: Array<{
  day: number;
  hook: string;
  format: string;
  caption: string;
  cta: string;
  keyword_target: string;
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
  _req: NextRequest,
  { params }: { params: Promise<{ day: string }> },
) {
  const { day: dayStr } = await params;
  const day = parseInt(dayStr, 10);
  const post = POSTS.find((p) => p.day === day);
  if (!post) {
    return new Response(`Post day ${dayStr} not found`, { status: 404 });
  }

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
            top: -300,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1100,
            height: 900,
            borderRadius: 9999,
            background: "radial-gradient(ellipse, rgba(43,123,255,0.28), transparent 65%)",
          }}
        />

        {/* Brand row — top */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.blue} 0%, ${C.cyan} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <svg
              width={36}
              height={36}
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
          <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>
            EasyTradeSetup
          </span>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            marginTop: 120,
            padding: "12px 22px",
            borderRadius: 999,
            background: "rgba(34,211,238,0.14)",
            border: "1px solid rgba(34,211,238,0.40)",
            color: C.cyan,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            alignSelf: "flex-start",
          }}
        >
          {post.keyword_target}
        </div>

        {/* Headline — biggest visual */}
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
              fontSize: 110,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.05,
              color: "#fff",
              maxWidth: 920,
            }}
          >
            {post.hook}
          </div>

          <div
            style={{
              marginTop: 50,
              fontSize: 32,
              color: C.ink60,
              fontWeight: 500,
              lineHeight: 1.4,
              maxWidth: 880,
            }}
          >
            {post.cta}
          </div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 36,
            borderTop: "1px solid rgba(255,255,255,0.10)",
            color: C.ink40,
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          <span>easytradesetup.com</span>
          <span style={{ color: C.gold }}>#Shorts</span>
        </div>
      </div>
    ),
    {
      width:  1080,
      height: 1920,
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  );
}
