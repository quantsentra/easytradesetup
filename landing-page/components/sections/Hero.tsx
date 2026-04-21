import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b pointer-events-none" />
      <div className="container-x relative pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 lg:col-span-8">
            <div className="inline-flex items-center gap-2 mb-8 font-mono text-xs uppercase tracking-[0.2em] text-gold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
              </span>
              Live — April 2026 · NSE / Global
            </div>

            <h1 className="font-display text-display-xl text-balance">
              One indicator.
              <br />
              <span className="italic text-gold">Eight</span> tools.
              <br />
              <span className="text-cream-muted">Every market.</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-cream-muted leading-relaxed max-w-xl text-balance">
              Golden Indicator replaces your stack of TradingView add-ons with a single proprietary Pine Script —
              engineered for NSE F&O, and just as sharp on global markets.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button variant="gold" size="lg" href="/checkout">
                Get it — ₹2,499 <span aria-hidden>→</span>
              </Button>
              <Button variant="secondary" size="lg" href="/product">
                See the 8 tools
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-mono text-cream-dim">
              <span>✓ Instant email delivery</span>
              <span>✓ Any timeframe</span>
              <span>✓ Lifetime access</span>
              <span>✓ One-time payment</span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="relative aspect-[3/4] rounded-2xl border border-ink-border bg-ink-soft/60 overflow-hidden gold-border">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-cream-dim">
                <span>NIFTY · 5m</span>
                <span className="text-gold animate-shimmer">● LIVE</span>
              </div>
              <svg
                viewBox="0 0 300 400"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a648" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#d4a648" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,300 L 30,280 L 60,290 L 90,260 L 120,240 L 150,250 L 180,220 L 210,200 L 240,180 L 270,190 L 300,160 L 300,400 L 0,400 Z"
                  fill="url(#chartFill)"
                />
                <path
                  d="M 0,300 L 30,280 L 60,290 L 90,260 L 120,240 L 150,250 L 180,220 L 210,200 L 240,180 L 270,190 L 300,160"
                  stroke="#d4a648"
                  strokeWidth="1.5"
                  fill="none"
                />
                {([
                  [50, 280, 270, "#3ecf8e"],
                  [110, 245, 240, "#3ecf8e"],
                  [180, 215, 210, "#3ecf8e"],
                  [240, 175, 175, "#ff5d5d"],
                ] as Array<[number, number, number, string]>).map(([x, yH, yL, c], i) => (
                  <line
                    key={i}
                    x1={x}
                    x2={x}
                    y1={yH}
                    y2={yL + 20}
                    stroke={c}
                    strokeWidth="3"
                  />
                ))}
              </svg>
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="glass-card px-2 py-1.5">
                  <div className="text-cream-dim">TREND</div>
                  <div className="text-signal-up">UP</div>
                </div>
                <div className="glass-card px-2 py-1.5">
                  <div className="text-cream-dim">RSI</div>
                  <div className="text-cream">62.4</div>
                </div>
                <div className="glass-card px-2 py-1.5">
                  <div className="text-cream-dim">VOL</div>
                  <div className="text-gold">HIGH</div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs font-mono text-cream-dim">
              Illustrative. Not a trade recommendation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
