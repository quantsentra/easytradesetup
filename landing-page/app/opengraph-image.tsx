import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EasyTradeSetup — Golden Indicator";
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
            "linear-gradient(135deg, #f5f5f7 0%, #ffffff 55%, #e4ecff 100%)",
          padding: 80,
          fontFamily: "sans-serif",
          color: "#1d1d1f",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            fontWeight: 600,
            color: "#0071e3",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#0071e3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            ₹
          </div>
          <span>EasyTradeSetup · Golden Indicator</span>
        </div>

        <div
          style={{
            marginTop: 60,
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.05,
            maxWidth: 1020,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>One indicator.</span>
          <span style={{ color: "#0071e3" }}>Eight tools.</span>
          <span>Every market.</span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 28,
              color: "rgba(0,0,0,0.7)",
              fontWeight: 500,
            }}
          >
            <span>Proprietary TradingView Pine Script</span>
            <span style={{ fontSize: 22, marginTop: 8, color: "rgba(0,0,0,0.55)" }}>
              Lifetime access · One-time payment · NSE F&O + global markets
            </span>
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
                fontSize: 80,
                fontWeight: 800,
                color: "#0071e3",
                letterSpacing: -2,
              }}
            >
              ₹2,499
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 3,
                color: "rgba(0,0,0,0.45)",
              }}
            >
              One-time
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
