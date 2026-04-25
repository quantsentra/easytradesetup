import Link from "next/link";
import Price from "@/components/ui/Price";
import ReservationNotice from "@/components/ui/ReservationNotice";
import { OFFER_LABEL } from "@/lib/pricing";

export default function Hero() {
  return (
    <section className="relative above-bg overflow-hidden">
      <div className="grain" aria-hidden />

      <div className="container-wide relative pt-10 sm:pt-14 md:pt-16 pb-14 sm:pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
          {/* LEFT — copy column */}
          <div className="max-w-[620px]">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                background: "rgba(143, 204, 42, 0.10)",
                border: "1px solid rgba(143, 204, 42, 0.35)",
              }}
            >
              <span className="pulse-dot" aria-hidden />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-acid">
                v2.4 · {OFFER_LABEL} live
              </span>
            </div>

            <h1 className="mt-5 font-display font-semibold text-[38px] sm:text-[48px] lg:text-[58px] leading-[1.02] tracking-[-0.03em] text-ink">
              One TradingView indicator<br />
              to read the market with{" "}
              <span
                className="word-rotator"
                aria-label="structure, clarity, discipline, confidence"
              >
                <span className="word" style={{ "--word-i": 0 } as React.CSSProperties}>
                  structure
                </span>
                <span className="word" style={{ "--word-i": 1 } as React.CSSProperties}>
                  clarity
                </span>
                <span className="word" style={{ "--word-i": 2 } as React.CSSProperties}>
                  discipline
                </span>
                <span className="word" style={{ "--word-i": 3 } as React.CSSProperties}>
                  confidence
                </span>
                <svg viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden>
                  <path
                    d="M2 8 Q 100 2, 200 7 T 398 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              <br />— not noise.
            </h1>

            <p className="mt-5 max-w-[520px] text-[15px] sm:text-[16px] leading-[1.55] text-ink-60">
              Golden Indicator combines market structure, trend regime, key levels, supply /
              demand zones, pullback context, and a risk framework into one Pine v5 indicator.
              Bar-close logic. No signal service. You decide every trade.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link href="/checkout" className="btn btn-acid btn-lg">
                Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link
                href="/sample"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-60 hover:text-ink transition-colors px-2 py-2"
              >
                View free sample <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="mt-5">
              <ReservationNotice />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Stat num="6" label="Bundle items" />
              <Divider />
              <Stat num="24/5" label="Markets covered" />
              <Divider />
              <Stat num="0" label="Subscriptions" color="acid" />
            </div>
          </div>

          {/* RIGHT — terminal chart mockup */}
          <div className="relative lg:scale-[1.04] xl:scale-[1.08] origin-left">
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                inset: "-40px",
                background: "radial-gradient(circle, rgba(34,211,238,0.30), transparent 60%)",
                filter: "blur(40px)",
              }}
            />
            <div className="term-frame relative">
              <div className="term-head">
                <div className="term-lights" aria-hidden>
                  <span className="r" />
                  <span className="y" />
                  <span className="g" />
                </div>
                <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-40">
                  NIFTY 50 · 15m · Golden v2.4
                </span>
                <span className="ml-auto chip chip-acid chip-live">LIVE</span>
              </div>

              {/* Price row */}
              <div className="flex items-baseline gap-3 px-5 pt-5 pb-2">
                <span className="stat-num text-[34px] sm:text-[42px] text-ink">24,852.15</span>
                <span
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[12px] font-bold tz-num"
                  style={{
                    background: "rgba(34, 197, 94, 0.12)",
                    color: "#22C55E",
                  }}
                >
                  ▲ +0.42%
                </span>
              </div>

              {/* Chart SVG */}
              <div className="relative px-5 pb-5">
                <span
                  className="absolute top-2 right-7 chip chip-up"
                  aria-hidden
                >
                  UPTREND
                </span>
                <svg viewBox="0 0 800 320" preserveAspectRatio="none" className="w-full h-auto" aria-label="NIFTY 15-minute chart with Golden Indicator overlay">
                  <defs>
                    <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#22D3EE" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#2B7BFF" />
                      <stop offset="0.55" stopColor="#22D3EE" />
                      <stop offset="1" stopColor="#F0C05A" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="187" x2="800" y2="187" stroke="#2B7BFF" strokeOpacity=".5" strokeDasharray="4 6" strokeWidth="1.5" />
                  <line x1="0" y1="107" x2="800" y2="107" stroke="#F0C05A" strokeOpacity=".45" strokeDasharray="4 6" strokeWidth="1.5" />
                  <path
                    d="M0,240 L40,213 L80,227 L120,187 L160,200 L200,160 L240,173 L280,133 L320,147 L360,120 L400,160 L440,93 L480,107 L520,80 L560,100 L600,67 L640,87 L680,60 L720,53 L760,73 L800,40 L800,320 L0,320 Z"
                    fill="url(#hero-area)"
                  />
                  <path
                    d="M0,240 L40,213 L80,227 L120,187 L160,200 L200,160 L240,173 L280,133 L320,147 L360,120 L400,160 L440,93 L480,107 L520,80 L560,100 L600,67 L640,87 L680,60 L720,53 L760,73 L800,40"
                    stroke="url(#hero-line)"
                    strokeWidth="2.4"
                    fill="none"
                  />
                  {/* BUY marker */}
                  <g transform="translate(440, 93)">
                    <rect x="-22" y="-30" width="44" height="22" rx="4" fill="#8FCC2A" />
                    <text x="0" y="-14" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" fill="#0B0F17" textAnchor="middle">BUY</text>
                    <circle r="4" fill="#8FCC2A" />
                  </g>
                  {/* Pullback cyan dot */}
                  <circle cx="560" cy="100" r="5" fill="#22D3EE" stroke="#0B0F17" strokeWidth="2" />
                </svg>
                {/* Legend */}
                <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-40">
                  <LegendItem color="#22D3EE" label="Regime" />
                  <LegendItem color="#2B7BFF" label="Key Level" />
                  <LegendItem color="#8FCC2A" label="Entry" />
                  <LegendItem color="#F0C05A" label="Pullback" />
                </div>
              </div>
            </div>

            {/* Floating streak badge — overlaps chart bottom-right edge */}
            <div
              className="hidden sm:flex absolute -bottom-3 -right-3 lg:-right-5 items-center gap-3 px-3.5 py-2 rounded-xl bg-panel border border-rule-2 z-10"
              style={{
                boxShadow: "var(--c-shadow-term)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full grid place-items-center"
                style={{
                  background: "rgba(143, 204, 42, 0.20)",
                  color: "#8FCC2A",
                }}
                aria-hidden
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </div>
              <div>
                <div className="text-[12px] font-semibold text-ink">Bar-close only</div>
                <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-40">No repaint · no flicker</div>
              </div>
            </div>

            <p className="mt-4 text-center font-mono text-[10.5px] font-bold uppercase tracking-widest text-ink-40">
              Illustrative · Not live · Not a trade recommendation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ num, label, color }: { num: string; label: string; color?: "acid" }) {
  return (
    <div>
      <div
        className="stat-num text-[22px] sm:text-[24px]"
        style={{ color: color === "acid" ? "#8FCC2A" : "var(--c-ink)" }}
      >
        {num}
      </div>
      <div className="mt-1 font-mono text-[10.5px] font-bold uppercase tracking-widest text-ink-40">
        {label}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-8 w-px bg-rule-2" aria-hidden />;
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} aria-hidden />
      {label}
    </span>
  );
}
