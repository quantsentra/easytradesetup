import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import queueData from "@/admin-assets/content/100-day-queue.json";

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
//
// Themes: each post in the JSON declares a `theme` value that selects
// background + accent + ink colors below. Five variants give the feed
// visual variety so it doesn't look like one designer's same template
// 100 times in a row.

type ThemeName = "dark-cyan" | "dark-gold" | "light-clean" | "gradient" | "chart";

type Theme = {
  bg:        string;
  accent:    string;
  ink:       string;
  ink60:     string;
  ink40:     string;
  glow:      string;
  showChart: boolean;
};

const THEMES: Record<ThemeName, Theme> = {
  "dark-cyan": {
    bg:        "linear-gradient(135deg, #05070F 0%, #0E1530 55%, #0a1224 100%)",
    accent:    "#22D3EE",
    ink:       "rgba(255,255,255,0.92)",
    ink60:     "rgba(255,255,255,0.60)",
    ink40:     "rgba(255,255,255,0.40)",
    glow:      "rgba(43,123,255,0.22)",
    showChart: false,
  },
  "dark-gold": {
    bg:        "linear-gradient(135deg, #05070F 0%, #1a1208 55%, #0a1224 100%)",
    accent:    "#F0C05A",
    ink:       "rgba(255,255,255,0.92)",
    ink60:     "rgba(255,255,255,0.60)",
    ink40:     "rgba(255,255,255,0.40)",
    glow:      "rgba(240,192,90,0.18)",
    showChart: false,
  },
  "light-clean": {
    bg:        "linear-gradient(135deg, #f8f7f3 0%, #ffffff 55%, #eef0f5 100%)",
    accent:    "#2B7BFF",
    ink:       "rgba(5,7,15,0.92)",
    ink60:     "rgba(5,7,15,0.60)",
    ink40:     "rgba(5,7,15,0.35)",
    glow:      "rgba(43,123,255,0.10)",
    showChart: false,
  },
  "gradient": {
    bg:        "linear-gradient(135deg, #2B7BFF 0%, #22D3EE 55%, #F0C05A 100%)",
    accent:    "#ffffff",
    ink:       "#ffffff",
    ink60:     "rgba(255,255,255,0.78)",
    ink40:     "rgba(255,255,255,0.50)",
    glow:      "rgba(255,255,255,0.20)",
    showChart: false,
  },
  "chart": {
    bg:        "linear-gradient(135deg, #05070F 0%, #0E1530 55%, #0a1224 100%)",
    accent:    "#22D3EE",
    ink:       "rgba(255,255,255,0.92)",
    ink60:     "rgba(255,255,255,0.60)",
    ink40:     "rgba(255,255,255,0.40)",
    glow:      "rgba(43,123,255,0.22)",
    showChart: true,
  },
};

const POSTS = (queueData as { queue: Array<{
  day: number;
  hook: string;
  format: string;
  theme?: string;
  caption: string;
  cta: string;
  keyword_target: string;
  slide_outline?: string[];
}> }).queue;

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

  const themeName = (post.theme as ThemeName) ?? "dark-cyan";
  const t = THEMES[themeName] ?? THEMES["dark-cyan"];

  // Headline source: hook for static; slide outline line for carousel.
  // Strip the "Slide N — " prefix that the JSON uses for outlines.
  let headline = post.hook;
  let eyebrow = "EasyTradeSetup · Free chart sample";
  if (slide !== null && post.slide_outline?.[slide]) {
    headline = post.slide_outline[slide].replace(/^Slide\s+\d+\s*[—-]\s*/i, "").replace(/^[^:]*:\s*/, "");
    eyebrow = `Slide ${slide + 1} of ${post.slide_outline.length}`;
  }

  const isHook = slide === null || slide === 0;
  const isLight = themeName === "light-clean";

  return new ImageResponse(
    (
      <div
        style={{
          width:  "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: t.bg,
          padding: 80,
          fontFamily: "sans-serif",
          color: t.ink,
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
            background: `radial-gradient(ellipse, ${t.glow}, transparent 65%)`,
          }}
        />

        {/* Optional chart-pattern overlay for chart theme */}
        {t.showChart && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), " +
                "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        )}

        {/* Brand row — top-left */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: themeName === "gradient"
                ? "rgba(255,255,255,0.20)"
                : `linear-gradient(135deg, #2B7BFF 0%, #22D3EE 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              border: themeName === "gradient" ? "2px solid rgba(255,255,255,0.6)" : "none",
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
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, color: t.ink }}>
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
            background: isLight
              ? "rgba(43,123,255,0.08)"
              : themeName === "gradient"
              ? "rgba(255,255,255,0.20)"
              : "rgba(34,211,238,0.12)",
            border: `1px solid ${isLight ? "rgba(43,123,255,0.40)" : themeName === "gradient" ? "rgba(255,255,255,0.55)" : "rgba(34,211,238,0.40)"}`,
            color: t.accent,
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
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: isHook ? 88 : 72,
              fontWeight: 800,
              letterSpacing: -2.5,
              lineHeight: 1.05,
              color: t.ink,
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
                color: t.ink60,
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
            borderTop: `1px solid ${isLight ? "rgba(5,7,15,0.10)" : themeName === "gradient" ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.10)"}`,
            color: t.ink40,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <span>easytradesetup.com</span>
          <span style={{ color: themeName === "dark-gold" ? "#F0C05A" : t.accent }}>Educational. Not advice.</span>
        </div>
      </div>
    ),
    {
      width:  1080,
      height: 1350,
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  );
}
