import Link from "next/link";

const signals = [
  { label: "Trend", value: "UP", tone: "up" as const },
  { label: "RSI", value: "62.4", tone: "neutral" as const },
  { label: "Volume", value: "HIGH", tone: "neutral" as const },
];

const stats = [
  { k: "8", v: "Built-in tools" },
  { k: "Any", v: "Symbol / TF" },
  { k: "₹2,499", v: "One-time" },
  { k: "∞", v: "Lifetime" },
];

export default function Hero() {
  return (
    <section className="relative bg-page overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70"
        style={{
          background:
            "radial-gradient(1200px 400px at 50% 0%, rgba(0,113,227,0.08), transparent 60%)",
        }}
      />

      <div className="container-wide relative pt-12 sm:pt-16 md:pt-24 pb-10 sm:pb-14 md:pb-20 text-center">
        <p className="text-micro font-semibold text-blue-link uppercase tracking-wider">
          Golden Indicator
        </p>

        <h1 className="mt-3 sm:mt-4 h-hero max-w-[20ch] sm:max-w-3xl mx-auto">
          One indicator. Eight tools.<br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>Every market.
        </h1>

        <p className="mt-4 sm:mt-5 text-body-lg text-muted max-w-xl mx-auto px-2 sm:px-0">
          A proprietary TradingView Pine Script engineered for NSE F&amp;O,
          and just as sharp on global markets.
        </p>

        <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5 text-body">
          <Link
            href="/checkout"
            className="order-1 sm:order-2 inline-flex items-center justify-center rounded-lg bg-blue text-white px-5 py-2 text-body font-normal hover:brightness-110 transition-all w-full sm:w-auto"
          >
            Buy ₹2,499
          </Link>
          <Link
            href="/product"
            className="order-2 sm:order-1 link-apple chevron"
          >
            Learn more
          </Link>
        </div>

        <p className="mt-3 text-caption text-muted-faint">
          Instant delivery · One-time · Lifetime access
        </p>

        <div className="mt-10 sm:mt-14 md:mt-20 relative mx-auto max-w-[880px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 sm:-inset-10 rounded-[32px] opacity-60"
            style={{
              background:
                "radial-gradient(600px 200px at 50% 100%, rgba(0,113,227,0.18), transparent 70%)",
            }}
          />

          <figure className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-surface shadow-card">
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-rule">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="text-nano sm:text-micro text-muted-faint truncate px-3">
                NIFTY 50 · 5m · TradingView
              </div>
              <div className="w-8 sm:w-12" aria-hidden />
            </div>

            <div className="relative aspect-[16/9] bg-surface-alt">
              <svg
                viewBox="0 0 800 450"
                role="img"
                aria-label="Illustrative chart showing an uptrend on NIFTY 50 five-minute timeframe"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="hfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0071e3" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    x2="800"
                    y1={90 + i * 70}
                    y2={90 + i * 70}
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth="1"
                  />
                ))}

                <path
                  d="M 0,340 L 60,320 L 120,330 L 180,290 L 240,270 L 300,285 L 360,240 L 420,220 L 480,195 L 540,210 L 600,175 L 660,160 L 720,145 L 800,130 L 800,450 L 0,450 Z"
                  fill="url(#hfill)"
                />
                <path
                  d="M 0,340 L 60,320 L 120,330 L 180,290 L 240,270 L 300,285 L 360,240 L 420,220 L 480,195 L 540,210 L 600,175 L 660,160 L 720,145 L 800,130"
                  stroke="#0071e3"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {[
                  [90, 320, 308],
                  [200, 285, 278],
                  [310, 280, 270],
                  [420, 215, 210],
                  [560, 205, 198],
                  [680, 155, 148],
                ].map(([x, yH, yL], i) => (
                  <line
                    key={i}
                    x1={x}
                    x2={x}
                    y1={yH}
                    y2={yL + 20}
                    stroke="#2da44e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                ))}

                <circle cx="800" cy="130" r="5" fill="#0071e3" />
                <circle cx="800" cy="130" r="10" fill="#0071e3" fillOpacity="0.2">
                  <animate attributeName="r" values="5;14;5" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite" />
                </circle>
              </svg>

              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2 text-nano sm:text-micro">
                {signals.map((s) => (
                  <span
                    key={s.label}
                    className="bg-surface/95 backdrop-blur px-2 py-1 rounded-md text-ink border border-rule shadow-soft"
                  >
                    {s.label} ·{" "}
                    <span
                      className={
                        s.tone === "up"
                          ? "text-[#2da44e] font-semibold"
                          : "font-semibold"
                      }
                    >
                      {s.value}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <figcaption className="sr-only">
              Illustrative TradingView chart. Not a trade recommendation.
            </figcaption>
          </figure>

          <p className="mt-3 text-micro text-muted-faint">
            Illustrative. Not a trade recommendation.
          </p>
        </div>

        <dl className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule rounded-2xl overflow-hidden border border-rule max-w-2xl mx-auto">
          {stats.map(({ k, v }) => (
            <div key={v} className="bg-page px-3 sm:px-4 py-4 text-center">
              <dt className="sr-only">{v}</dt>
              <dd>
                <span className="block text-display-tile font-semibold text-ink">{k}</span>
                <span className="block mt-0.5 text-caption text-muted-faint">{v}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
