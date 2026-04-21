import Image from 'next/image'

const stats = [
  { value: '8',      label: 'tools built-in' },
  { value: 'Any',    label: 'symbol / TF' },
  { value: '₹2,499', label: 'one-time' },
  { value: '∞',      label: 'lifetime access' },
]

function ChartMockup() {
  return (
    <div className="relative w-full animate-fade-up [animation-delay:280ms]">
      <div className="rounded-2xl overflow-hidden shadow-hero bg-white">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-subtle">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(0,0,0,0.12)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(0,0,0,0.12)]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[rgba(0,0,0,0.12)]" />
          </div>
          <div className="flex-1 mx-3 bg-white border border-line rounded-md px-3 py-1 text-[10px] text-ink-faint font-mono truncate">
            tradingview.com · NIFTY 50 · 5m · SANSETO Trade Master v7
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-up animate-pulse-soft" />
            <span className="text-[9px] text-up font-mono font-medium">LIVE</span>
          </div>
        </div>

        {/* Chart image */}
        <div className="relative bg-[#131722] aspect-[4/3] overflow-hidden">
          <Image
            src="/chart.png"
            alt="SANSETO Trade Master v7 — Nifty 50 live chart"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden bg-white">
      {/* Subtle warm gradient at top */}
      <div className="absolute inset-0 hero-gradient pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 py-20 lg:py-28 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-16">

          {/* Left: text */}
          <div className="flex-[1.1] w-full text-center lg:text-left">

            <div className="animate-fade-down">
              <span className="label">TradingView · NSE F&amp;O · Global Markets</span>
            </div>

            <h1 className="mt-5 text-[44px] sm:text-5xl lg:text-[60px] font-black tracking-[-0.04em] leading-[1.04] animate-fade-up [animation-delay:60ms] text-ink">
              One Indicator.<br />
              <span className="text-gradient">Golden Edge.</span><br />
              Every Trade.
            </h1>

            <p className="mt-5 text-[16px] text-ink-muted leading-[1.7] max-w-lg mx-auto lg:mx-0 animate-fade-up [animation-delay:130ms]">
              The <span className="text-ink font-semibold">Golden Indicator</span> — a proprietary
              TradingView Pine Script built from years of live trading. Tells you exactly when to
              enter, wait, and exit. Any symbol. Any timeframe.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 animate-fade-up [animation-delay:190ms]">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 bg-[#0D0D0D] text-white font-bold text-[15px] px-7 py-3.5 rounded-xl hover:bg-[#2A2A2A] transition-colors duration-150 tracking-tight"
              >
                Get the Golden Indicator — ₹2,499
              </a>
              <a
                href="#strategy"
                className="inline-flex items-center gap-1.5 text-ink-muted text-[14px] px-4 py-3.5 hover:text-ink transition-colors duration-150"
              >
                See what&apos;s inside ↓
              </a>
            </div>

            <p className="mt-3 text-[11px] font-mono text-ink-faint animate-fade-up [animation-delay:240ms] text-center lg:text-left">
              Instant delivery · One-time payment · No subscription ever
            </p>

            {/* Stats bar */}
            <div className="mt-10 grid grid-cols-4 divide-x divide-line rounded-xl overflow-hidden border border-line animate-fade-up [animation-delay:300ms]">
              {stats.map(({ value, label }) => (
                <div key={label} className="bg-subtle px-3 py-4 text-center hover:bg-raised transition-colors duration-150">
                  <div className="text-[17px] font-black text-ink font-mono">{value}</div>
                  <div className="text-[10px] text-ink-faint mt-0.5 tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: chart */}
          <div className="flex-1 w-full max-w-[520px] mx-auto lg:mx-0">
            <ChartMockup />
          </div>

        </div>
      </div>
    </section>
  )
}
