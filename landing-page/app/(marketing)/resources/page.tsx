import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources — install guide, risk calculator, strategy library",
  description:
    "Everything around the Golden Indicator: TradingView install guide, free risk calculator, sample setups for NIFTY / BANKNIFTY / SPX / XAU / BTC, full strategy library, and daily pre-market notes.",
  keywords: [
    "TradingView Pine indicator install guide",
    "trading risk calculator",
    "position sizing calculator",
    "NIFTY pre-market notes",
    "BANKNIFTY trading strategy",
    "Pine Script v5 documentation",
    "supply demand zone strategy",
  ],
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Trading resources — install guide, risk calc, strategy library",
    description: "Docs, tools, and daily pre-market notes for Golden Indicator users.",
    url: "https://www.easytradesetup.com/resources",
  },
};

type Resource = {
  href: string;
  external?: boolean;
  title: string;
  blurb: string;
  meta: string;
  tone: "blue" | "cyan" | "gold";
  icon: React.ReactNode;
};

const resources: Resource[] = [
  {
    href: "/docs/install",
    title: "Install guide",
    blurb: "Paste the Pine v5 source, save as a script, add to chart. Step-by-step with screenshots.",
    meta: "Docs · 3 min read",
    tone: "blue",
    icon: <DocIcon />,
  },
  {
    href: "https://portal.easytradesetup.com/portal/docs/risk-calculator",
    external: true,
    title: "Risk calculator",
    blurb: "Position sizer + R-multiple tracker. Plug in your stop distance, get contract count.",
    meta: "Tool · Customer-only",
    tone: "cyan",
    icon: <CalcIcon />,
  },
  {
    href: "/sample",
    title: "Sample setups",
    blurb: "Live chart examples — Opening Range Breakout on NIFTY, trend pullback on SPX, expiry fade on BANKNIFTY.",
    meta: "Library · 8 setups",
    tone: "gold",
    icon: <ChartIcon />,
  },
  {
    href: "https://portal.easytradesetup.com/portal/docs",
    external: true,
    title: "Strategy library",
    blurb: "Eleven docs. Foundations, setups, risk framework. Each links Pine logic to trader-side decisions.",
    meta: "Customer portal · 11 entries",
    tone: "blue",
    icon: <BookIcon />,
  },
  {
    href: "https://portal.easytradesetup.com/portal/updates",
    external: true,
    title: "Daily market notes",
    blurb: "One pre-market note per session. NIFTY · BANKNIFTY · SPX · XAU · BTC. Bias, levels, plan.",
    meta: "Email + portal · daily",
    tone: "cyan",
    icon: <NoteIcon />,
  },
  {
    href: "/legal/disclaimer",
    title: "Disclaimer + legal",
    blurb: "Educational only. SEBI compliance note. Refund + privacy + terms in one place.",
    meta: "Legal",
    tone: "gold",
    icon: <ScrollIcon />,
  },
];

export default function ResourcesPage() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20">
        <div className="max-w-[640px]">
          <span className="eye">
            <span className="eye-dot" aria-hidden />
            Resources
          </span>
          <h1 className="mt-4 font-display text-[40px] sm:text-[52px] font-semibold leading-[1.04] tracking-[-0.025em] text-ink">
            Everything you need around the indicator.
          </h1>
          <p className="mt-4 text-[16px] sm:text-[17px] leading-[1.55] text-ink-60">
            Docs to wire it up. Tools to size risk. Daily notes to anchor your bias. Strategy library
            for the trader-side decisions.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => {
            const palette = palettes[r.tone];
            const inner = (
              <>
                <span
                  className="resource-icon"
                  style={{ background: palette.bg, color: palette.fg, borderColor: palette.border }}
                  aria-hidden
                >
                  {r.icon}
                </span>
                <div>
                  <h3 className="font-display text-[16px] font-semibold tracking-[-0.01em] text-ink">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.5] text-ink-60">{r.blurb}</p>
                  <div className="mt-3 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-ink-40">
                    {r.meta}
                  </div>
                </div>
              </>
            );
            return r.external ? (
              <a
                key={r.href}
                href={r.href}
                target="_blank"
                rel="noopener"
                className="resource-card"
              >
                {inner}
              </a>
            ) : (
              <Link key={r.href} href={r.href} className="resource-card">
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const palettes = {
  blue: {
    bg: "rgba(43,123,255,0.10)",
    fg: "#2B7BFF",
    border: "rgba(43,123,255,0.28)",
  },
  cyan: {
    bg: "rgba(34,211,238,0.12)",
    fg: "#0fa9c9",
    border: "rgba(34,211,238,0.30)",
  },
  gold: {
    bg: "rgba(240,192,90,0.16)",
    fg: "#9a6e1f",
    border: "rgba(240,192,90,0.40)",
  },
};

function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
      <path d="M14 3v6h6M9 13h6M9 17h6" />
    </svg>
  );
}
function CalcIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-7" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5zM4 19h14" />
    </svg>
  );
}
function NoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M9 10h7M9 14h7M9 18h4" />
    </svg>
  );
}
function ScrollIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 5H8a3 3 0 00-3 3v9a3 3 0 003 3h11V8a3 3 0 00-3-3z" />
      <path d="M5 8h3M9 12h6M9 16h4" />
    </svg>
  );
}
