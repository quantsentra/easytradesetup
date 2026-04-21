import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        page: "#f5f5f7",
        surface: "#ffffff",
        "surface-alt": "#fafafc",
        "surface-active": "#ededf2",
        "rule": "rgba(0, 0, 0, 0.08)",
        blue: {
          DEFAULT: "#0071e3",
          link: "#0066cc",
          bright: "#2997ff",
        },
        muted: {
          DEFAULT: "rgba(0, 0, 0, 0.8)",
          soft: "rgba(0, 0, 0, 0.56)",
          faint: "rgba(0, 0, 0, 0.48)",
        },
      },
      fontFamily: {
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "var(--font-inter)",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        text: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "var(--font-inter)",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-hero": ["clamp(2.5rem, 5.5vw, 3.5rem)", { lineHeight: "1.07", letterSpacing: "-0.005em" }],
        "display-section": ["clamp(2rem, 4vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.003em" }],
        "display-tile": ["1.75rem", { lineHeight: "1.14", letterSpacing: "0.007em" }],
        "card-title": ["1.3125rem", { lineHeight: "1.19", letterSpacing: "0.011em" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.47", letterSpacing: "-0.022em" }],
        "body": ["1.0625rem", { lineHeight: "1.47", letterSpacing: "-0.022em" }],
        "caption": ["0.875rem", { lineHeight: "1.29", letterSpacing: "-0.016em" }],
        "micro": ["0.75rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
        "nano": ["0.625rem", { lineHeight: "1.47", letterSpacing: "-0.008em" }],
      },
      borderRadius: {
        pill: "980px",
      },
      boxShadow: {
        card: "rgba(0, 0, 0, 0.22) 3px 5px 30px 0px",
        soft: "rgba(0, 0, 0, 0.08) 0px 2px 12px 0px",
      },
    },
  },
  plugins: [],
};

export default config;
