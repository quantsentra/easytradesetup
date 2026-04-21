import Image from 'next/image'

const stats = [
  { value: '8',      label: 'tools built-in' },
  { value: 'Any',    label: 'symbol / timeframe' },
  { value: '₹2,499', label: 'one-time payment' },
  { value: '∞',      label: 'lifetime access' },
]

function ChartMockup() {
  return (
    <div className="relative w-full animate-fade-up [animation-delay:280ms]">
      {/* Browser frame */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.09)] overflow-hidden bg-bg-surface shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
        {/* Chrome bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] bg-bg-raised">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
          </div>
          <div className="flex-1 mx-3 bg-bg-base border border-[rgba(255,255,255,0.06)] rounded-md px-3 py-1 text-[10px] text-ink-faint font-mono truncate">
            tradingview.com · NIFTY 50 · 5m · SANSETO Trade Master v7
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-signal-up animate-pulse-soft" />
            <span className="text-[9px] text-signal-up font-mono">LIVE</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative bg-[#131722] overflow-hidden aspect-[4/3]">
          <Image
            src="/chart.png"
            alt="SANSETO Trade Master v7 — Nifty 50 live chart"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Gold corner accent */}
      <div className="absolute -top-px -right-px w-16 h-16 border-t-2 border-r-2 border-gold/40 rounded-tr-xl pointer-events-none" />
      <div className="absolute -bottom-px -left-px w-16 h-16 border-b-2 border-l-2 border-gold/20 rounded-bl-xl pointer-events-none" />
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-grid pt-14 overflow-hidden">
      {/* Single faint radial behind headline area */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 py-20 lg:py-28 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-16">

          {/* Left */}
          <div className="flex-[1.1] w-full text-center lg:text-left">
            {/* Eyebrow */}
            <div className="animate-fade-down">
              <span className="label text-gold/70">TradingView · NSE F&amp;O · Global Markets</span>
            </div>

            {/* Headline */}
            <h1 className="mt-5 text-[42px] sm:text-5xl lg:text-[56px] font-black tracking-[-0.04em] leading-[1.05] animate-fade-up [animation-delay:60ms]">
              One Indicator.<br />
              <span className="text-gradient">Golden Edge.</span><br />
              Every Trade.
            </h1>

            <p className="mt-5 text-[15px] text-ink-muted max-w-lg mx-auto lg:mx-0 leading-[1.7] animate-fade-up [animation-delay:140ms]">
              The <span className="text-ink font-semibold">Golden Indicator</span> — a proprietary
              TradingView script built from years of live trading. Tells you exactly when to enter,
              wait, and exit. Any symbol. Any timeframe.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 animate-fade-up [animation-delay:200ms]">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 bg-gold text-black font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-gold-light transition-colors duration-150 tracking-tight"
              >
                Get the Golden Indicator — ₹2,499 →
              </a>
              <a
                href="#strategy"
                className="inline-flex items-center gap-2 text-ink-muted text-sm px-5 py-3.5 hover:text-ink transition-colors duration-150"
              >
                See what&apos;s inside ↓
              </a>
            </div>

            <p className="mt-3 text-[11px] text-ink-faint font-mono animate-fade-up [animation-delay:260ms] text-center lg:text-left">
              Instant delivery · One-time · No subscription · Free daily market updates
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-4 gap-px rounded-xl overflow-hidden border border-[rgba(255,255,255,0.07)] animate-fade-up [animation-delay:320ms]">
              {stats.map(({ value, label }, i) => (
                <div key={label} className={`bg-bg-surface px-3 py-4 text-center ${i < 3 ? 'border-r border-[rgba(255,255,255,0.07)]' : ''}`}>
                  <div className="text-base sm:text-lg font-black text-ink font-mono">{value}</div>
                  <div className="text-[10px] text-ink-faint mt-0.5 leading-tight tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 w-full max-w-[520px] mx-auto lg:mx-0">
            <ChartMockup />
          </div>

        </div>
      </div>
    </section>
  )
}
