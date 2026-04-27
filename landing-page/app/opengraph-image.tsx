import { ImageResponse } from "next/og";
import { OFFER_USD, OFFER_INR, RETAIL_USD, RETAIL_INR } from "@/lib/pricing";

export const runtime = "edge";
export const alt = "EasyTradeSetup — Golden Indicator · One TradingView indicator, every market";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #05070F 0%, #0E1530 60%, #0a1224 100%)",
          padding: 72,
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Aurora glow accents */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(43,123,255,0.32), transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(34,211,238,0.22), transparent 65%)",
          }}
        />

        {/* Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #2B7BFF 0%, #22D3EE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 32,
              fontWeight: 800,
              boxShadow: "0 0 0 1px rgba(43,123,255,0.4), 0 12px 32px rgba(43,123,255,0.45)",
            }}
          >
            ✓
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
              EasyTradeSetup
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#22D3EE",
              }}
            >
              Golden Indicator · Pine v5
            </span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: 56,
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: -3.5,
            lineHeight: 0.98,
            maxWidth: 1040,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <span>One TradingView</span>
          <span>
            indicator{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #2B7BFF 0%, #22D3EE 50%, #F0C05A 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              for every market.
            </span>
          </span>
        </div>

        {/* Sub */}
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: "rgba(255,255,255,0.72)",
            fontWeight: 500,
            maxWidth: 960,
            lineHeight: 1.35,
            display: "flex",
            position: "relative",
          }}
        >
          Structure · Regime · Levels · Volume — fused on one chart. Bar-close logic. No signal service. You decide every trade.
        </div>

        {/* Bottom row */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: 32,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(34,211,238,0.12)",
                border: "1px solid rgba(34,211,238,0.40)",
                color: "#22D3EE",
                fontSize: 16,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#22D3EE",
                  boxShadow: "0 0 12px #22D3EE",
                }}
              />
              Launch price · 67% off retail
            </div>
            <div
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.55)",
                fontWeight: 500,
              }}
            >
              One-time payment · Lifetime access · No subscriptions
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                color: "rgba(255,255,255,0.40)",
                fontSize: 26,
                fontWeight: 600,
                textDecoration: "line-through",
              }}
            >
              <span>${RETAIL_USD}</span>
              <span style={{ fontSize: 22 }}>·</span>
              <span>₹{RETAIL_INR.toLocaleString("en-IN")}</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                letterSpacing: -2.5,
                fontWeight: 800,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  fontSize: 84,
                  background: "linear-gradient(135deg, #2B7BFF 0%, #22D3EE 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                ${OFFER_USD}
              </span>
              <span style={{ fontSize: 38, color: "rgba(255,255,255,0.40)" }}>·</span>
              <span
                style={{
                  fontSize: 84,
                  background: "linear-gradient(135deg, #22D3EE 0%, #F0C05A 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                ₹{OFFER_INR.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
