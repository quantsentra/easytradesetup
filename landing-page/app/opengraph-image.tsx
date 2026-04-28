import { ImageResponse } from "next/og";
import { OFFER_USD, OFFER_INR, RETAIL_USD, RETAIL_INR } from "@/lib/pricing";

export const runtime = "edge";
export const alt =
  "EasyTradeSetup — Golden Indicator · One TradingView Pine v5 indicator for every market";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Designed for THUMBNAIL legibility (WhatsApp / iMessage / X / Slack render
// at ~200–400px wide). Big headline, big price, minimal chrome.
export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #05070F 0%, #0E1530 55%, #0a1224 100%)",
          padding: 80,
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Single soft glow accent — too much aurora muddies the thumbnail */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 600,
            borderRadius: 9999,
            background:
              "radial-gradient(ellipse, rgba(43,123,255,0.22), transparent 65%)",
          }}
        />

        {/* Brand row — small, top */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "absolute",
            top: 48,
            left: 56,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "linear-gradient(135deg, #2B7BFF 0%, #22D3EE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            ETS
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: -0.4,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            EasyTradeSetup
          </span>
        </div>

        {/* Eyebrow — top right */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 56,
            right: 56,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(34,211,238,0.12)",
            border: "1px solid rgba(34,211,238,0.40)",
            color: "#22D3EE",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Pine v5 · No repaint
        </div>

        {/* Headline — single line each, no gradient (poor contrast at thumb) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: -5,
            lineHeight: 0.95,
            color: "#ffffff",
          }}
        >
          <span>One indicator.</span>
          <span
            style={{
              background:
                "linear-gradient(90deg, #2B7BFF 0%, #22D3EE 50%, #F0C05A 100%)",
              backgroundClip: "text",
              color: "transparent",
              marginTop: 6,
            }}
          >
            Every market.
          </span>
        </div>

        {/* Price block — biggest single element, drives the click */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 24,
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -3,
              color: "#ffffff",
            }}
          >
            <span>${OFFER_USD}</span>
            <span
              style={{
                fontSize: 44,
                color: "rgba(255,255,255,0.40)",
                fontWeight: 600,
              }}
            >
              ·
            </span>
            {/* "INR" prefix instead of ₹ — the rupee glyph triggers a
                runtime dynamic-font fetch in @vercel/og that intermittently
                fails with a 400. ASCII keeps the OG render deterministic. */}
            <span>INR {OFFER_INR.toLocaleString("en-IN")}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              marginTop: 8,
              fontSize: 22,
              color: "rgba(255,255,255,0.45)",
              fontWeight: 500,
              textDecoration: "line-through",
            }}
          >
            <span>${RETAIL_USD}</span>
            <span>·</span>
            <span>INR {RETAIL_INR.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Footer strip — bottom */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 48,
            left: 0,
            right: 0,
            justifyContent: "center",
            fontSize: 22,
            color: "rgba(255,255,255,0.62)",
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          One-time payment · Lifetime access · 67% off retail
        </div>
      </div>
    ),
    { ...size },
  );
}
