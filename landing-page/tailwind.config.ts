import type { Config } from "tailwindcss";

const appleStack = [
  "-apple-system",
  "BlinkMacSystemFont",
  "SF Pro Display",
  "SF Pro Text",
  "Inter",
  "Helvetica Neue",
  "Helvetica",
  "Arial",
  "sans-serif",
];

const monoStack = [
  "ui-monospace",
  "SFMono-Regular",
  "SF Mono",
  "Menlo",
  "Monaco",
  "Consolas",
  "Liberation Mono",
  "monospace",
];

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surface
        bg: "#05070F",
        "bg-2": "#080C1A",
        "bg-3": "#0C1224",
        panel: "#0E1530",
        "panel-2": "#131A36",

        // Text
        ink: "#EDF1FA",
        "ink-60": "rgba(237, 241, 250, 0.62)",
        "ink-40": "rgba(237, 241, 250, 0.42)",
        "ink-20": "rgba(237, 241, 250, 0.20)",

        // Borders
        rule: "rgba(255, 255, 255, 0.06)",
        "rule-2": "rgba(255, 255, 255, 0.10)",
        "rule-3": "rgba(255, 255, 255, 0.16)",

        // Accent — signature blue + brand gold
        blue: {
          DEFAULT: "#2B7BFF",
          soft: "#4E9AFF",
          link: "#4E9AFF",   // alias for back-compat
          bright: "#2997FF", // alias for back-compat
          deep: "#1254D2",
        },
        cyan: "#22D3EE",
        gold: {
          DEFAULT: "#F0C05A",
          deep: "#D4A648",
          dim: "#8A6D2A",
        },
        violet: "#8B5CF6",

        // Semantic (trading)
        up: "#22C55E",
        dn: "#EF4444",

        // Back-compat so existing pages don't break while we retheme
        page: "#05070F",
        surface: "#0E1530",
        "surface-alt": "#131A36",
        "surface-active": "#1A2550",
        muted: {
          DEFAULT: "rgba(237, 241, 250, 0.80)",
          soft: "rgba(237, 241, 250, 0.56)",
          faint: "rgba(237, 241, 250, 0.42)",
        },
      },
      fontFamily: {
        display: appleStack,
        text: appleStack,
        mono: monoStack,
      },
      fontSize: {
        "display-hero":    ["clamp(2.75rem, 7vw, 5.5rem)",   { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-section": ["clamp(2.125rem, 4.8vw, 3.625rem)", { lineHeight: "1.05", letterSpacing: "-0.028em" }],
        "display-tile":    ["clamp(1.5rem, 2.6vw, 2.25rem)", { lineHeight: "1.1",  letterSpacing: "-0.025em" }],
        "card-title":      ["1.3125rem", { lineHeight: "1.19", letterSpacing: "-0.015em" }],
        "body-lg":         ["1.125rem",  { lineHeight: "1.55", letterSpacing: "-0.011em" }],
        "body":            ["1rem",      { lineHeight: "1.55", letterSpacing: "-0.008em" }],
        "caption":         ["0.875rem",  { lineHeight: "1.5",  letterSpacing: "-0.005em" }],
        "micro":           ["0.75rem",   { lineHeight: "1.3",  letterSpacing: "0.06em" }],
        "nano":            ["0.6875rem", { lineHeight: "1.3",  letterSpacing: "0.08em" }],
      },
      borderRadius: {
        pill: "980px",
      },
      boxShadow: {
        glass:
          "0 0 0 1px rgba(255,255,255,.04) inset, 0 30px 80px -20px rgba(0,0,0,.8), 0 12px 40px -10px rgba(43,123,255,.15)",
        card:
          "0 20px 60px -20px rgba(43,123,255,.35), 0 8px 24px -8px rgba(0,0,0,.5)",
        cta:
          "0 0 0 1px rgba(255,255,255,.08) inset, 0 6px 18px -4px rgba(43,123,255,.55), 0 2px 4px rgba(0,0,0,.3)",
        "cta-hover":
          "0 0 0 1px rgba(255,255,255,.12) inset, 0 10px 24px -4px rgba(43,123,255,.65), 0 2px 4px rgba(0,0,0,.4)",
        soft: "0 4px 16px -4px rgba(0,0,0,.5)",
      },
      backgroundImage: {
        "grad-brand":
          "linear-gradient(135deg, #4E9AFF 0%, #22D3EE 50%, #F0C05A 100%)",
        "grad-cta": "linear-gradient(180deg, #3A88FF 0%, #1E6AF2 100%)",
        "grad-promo":
          "linear-gradient(90deg, #1A3DD4 0%, #2B7BFF 50%, #7B3BFF 100%)",
        "grad-icon": "linear-gradient(135deg, #2B7BFF 0%, #22D3EE 100%)",
        "grad-gold": "linear-gradient(135deg, #F0C05A 0%, #D4A648 100%)",
        "grad-cta-band":
          "radial-gradient(60% 80% at 0% 50%, rgba(43,123,255,.3), transparent 70%), radial-gradient(50% 80% at 100% 50%, rgba(139,92,246,.3), transparent 70%), linear-gradient(180deg, #0E1530, #080C1A)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(.28,.11,.32,1)",
      },
    },
  },
  plugins: [],
};

export default config;
