import Image from 'next/image'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

const stats = [
  { value: '8',       label: 'Tools Built-in' },
  { value: 'Any',     label: 'Symbol / TF' },
  { value: '₹2,499',  label: 'One-Time' },
  { value: '∞',       label: 'Lifetime Access' },
]

function ChartMockup() {
  return (
    <div className="relative w-full max-w-[600px] mx-auto lg:mx-0 animate-fade-up [animation-delay:320ms]">
      {/* Glow behind mockup */}
      <div className="absolute -inset-4 bg-accent-blue/[0.08] blur-[70px] rounded-full pointer-events-none" />

      {/* Browser frame */}
      <div className="relative rounded-2xl shadow-2xl shadow-black/60 overflow-hidden glass">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-bg-raised">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 mx-3 bg-bg-surface border border-border rounded-md px-3 py-1 text-[10px] text-ink-faint font-mono truncate">
            tradingview.com · NIFTY 50 · 5m · SANSETO Trade Master v7
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[9px] text-accent-green font-medium">LIVE</span>
          </div>
        </div>

        {/* Real chart image */}
        <div className="relative bg-white overflow-hidden">
          <Image
            src="/chart.png"
            alt="SANSETO Trade Master v7 — Nifty 50 live chart showing Big Buyer Zone, resistance levels, and trend signals"
            width={1204}
            height={896}
            className="w-full h-auto block"
            priority
          />
          {/* Subtle overlay gradient at bottom for blending */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-surface/30 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Floating badge: Big Buyer Zone signal */}
      <div className="absolute -bottom-4 -left-3 sm:-left-5 glass rounded-xl px-3 py-2 shadow-xl shadow-black/40 animate-float-slow [animation-delay:1s]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent-green/20 border border-accent-green/30 flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-bold text-ink">Big Buyer Zone Active</div>
            <div className="text-[9px] text-ink-faint">Support held · +179 pts</div>
          </div>
        </div>
      </div>

      {/* Floating badge: live price */}
      <div className="absolute -top-3 -right-3 sm:-right-5 glass rounded-xl px-3 py-2 shadow-xl shadow-black/40 animate-float [animation-delay:2s]">
        <div className="text-[10px] font-bold text-accent-green">24,557.80 ▲</div>
        <div className="text-[9px] text-ink-faint">NIFTY · +14.20 today</div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center aurora-bg bg-grid pt-16 overflow-hidden">
      {/* Floating glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2">
          <div className="w-[600px] h-[600px] rounded-full bg-accent-blue/[0.06] blur-[140px] animate-float" />
        </div>
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] rounded-full bg-accent-green/[0.04] blur-[90px] animate-float-slow [animation-delay:2.5s]" />
        <div className="absolute top-1/4 right-1/3 w-[250px] h-[250px] rounded-full bg-accent-purple/[0.04] blur-[80px] animate-float [animation-delay:4s]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="animate-fade-down inline-block">
              <Badge variant="blue">TradingView · Any Symbol · NSE F&amp;O · Global Markets</Badge>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] animate-fade-up [animation-delay:80ms]">
              One Indicator.<br />
              <span className="text-gradient">Every Edge</span><br />
              You Need.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-up [animation-delay:180ms]">
              The <strong className="text-ink">Golden Indicator</strong> — a proprietary TradingView script
              built from years of live trading. Tells you exactly when to enter, wait, and exit.
              Any symbol. Any timeframe.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 animate-fade-up [animation-delay:280ms]">
              <Button href="#pricing" size="lg">
                Get the Golden Indicator — ₹2,499 →
              </Button>
              <Button href="#strategy" variant="secondary" size="lg">
                See What&apos;s Inside
              </Button>
            </div>

            <p className="mt-4 text-xs text-ink-faint animate-fade-up [animation-delay:360ms] text-center lg:text-left">
              Instant delivery · One-time payment · Yours forever · Free daily market updates included
            </p>

            {/* Stats grid */}
            <div className="mt-10 grid grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border animate-fade-up [animation-delay:440ms]">
              {stats.map(({ value, label }) => (
                <div key={label} className="bg-bg-surface px-3 sm:px-4 py-4 text-center group hover:bg-bg-raised transition-colors duration-200">
                  <div className="text-lg sm:text-xl font-black text-accent-blue group-hover:scale-110 transition-transform duration-200 inline-block">{value}</div>
                  <div className="text-[10px] sm:text-xs text-ink-muted mt-1 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: chart mockup */}
          <div className="flex-1 w-full lg:w-auto">
            <ChartMockup />
          </div>

        </div>
      </div>
    </section>
  )
}
