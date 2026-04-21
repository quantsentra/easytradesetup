import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-page">
      <div className="container-wide pt-16 md:pt-24 pb-12 md:pb-16 text-center">
        <p className="text-micro font-semibold text-blue-link uppercase tracking-wider">
          Golden Indicator
        </p>
        <h1 className="mt-4 h-hero max-w-3xl mx-auto">
          One indicator. Eight tools.<br />Every market.
        </h1>
        <p className="mt-5 text-body-lg text-muted max-w-xl mx-auto">
          A proprietary TradingView Pine Script engineered for NSE F&amp;O,
          and just as sharp on global markets.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-body">
          <Link href="/product" className="link-apple chevron">
            Learn more
          </Link>
          <Link
            href="/checkout"
            className="link-pill border border-blue-link px-5 py-1.5 hover:bg-blue-link/5"
          >
            Buy ₹2,499
          </Link>
        </div>

        <div className="mt-14 md:mt-20 relative mx-auto max-w-[880px]">
          <div className="rounded-[22px] overflow-hidden bg-surface shadow-card">
            <div className="flex items-center justify-between px-5 py-3 border-b border-rule">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="text-micro text-muted-faint">NIFTY 50 · 5m · TradingView</div>
              <div className="w-12" />
            </div>
            <div className="relative aspect-[16/9] bg-surface-alt">
              <svg
                viewBox="0 0 800 450"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="hfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0071e3" stopOpacity="0.15" />
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
                  strokeWidth="2"
                  fill="none"
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
                  />
                ))}
              </svg>
              <div className="absolute top-4 left-4 flex gap-2 text-micro">
                <span className="bg-surface/95 px-2 py-1 rounded text-ink border border-rule">
                  Trend · <span className="text-[#2da44e] font-semibold">UP</span>
                </span>
                <span className="bg-surface/95 px-2 py-1 rounded text-ink border border-rule">
                  RSI · 62.4
                </span>
                <span className="bg-surface/95 px-2 py-1 rounded text-ink border border-rule">
                  Vol · HIGH
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-micro text-muted-faint">
            Illustrative. Not a trade recommendation.
          </p>
        </div>
      </div>
    </section>
  );
}
