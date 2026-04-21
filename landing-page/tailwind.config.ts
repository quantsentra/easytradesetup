import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0a",
          soft: "#141414",
          card: "#1a1a1a",
          border: "#262626",
        },
        cream: {
          DEFAULT: "#f5f0e8",
          muted: "#b8b2a8",
          dim: "#7a746a",
        },
        gold: {
          DEFAULT: "#d4a648",
          bright: "#f0c05a",
          deep: "#8a6d2a",
        },
        signal: {
          up: "#3ecf8e",
          down: "#ff5d5d",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 9vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      animation: {
        "ticker": "ticker 40s linear infinite",
        "grain": "grain 8s steps(10) infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s ease-out forwards",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "30%": { transform: "translate(3%, -15%)" },
          "50%": { transform: "translate(-10%, 5%)" },
          "70%": { transform: "translate(15%, 10%)" },
          "90%": { transform: "translate(5%, -5%)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.7" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "grid-fade": "linear-gradient(180deg, rgba(212,166,72,0.04) 0%, transparent 100%)",
        "gold-gradient": "linear-gradient(135deg, #f0c05a 0%, #d4a648 50%, #8a6d2a 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
