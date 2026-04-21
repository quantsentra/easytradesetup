import FadeIn from '../ui/FadeIn'

const extras = [
  {
    icon: '📘',
    title: 'Trade Logic PDF',
    desc: 'Entry rules, exit rules, SL placement, real chart examples — everything in writing.',
  },
  {
    icon: '📡',
    title: 'Daily Market Updates',
    tag: 'Free',
    desc: 'AI-powered pre-market prediction + post-market analysis every trading day. Email & Telegram.',
  },
  {
    icon: '🧮',
    title: 'Risk Calculator',
    desc: 'Position size, R:R ratio, risk % per trade. Web portal, free forever for customers.',
  },
]

const markets = ['NIFTY', 'BANKNIFTY', 'NSE Stocks', 'Forex', 'Crypto', 'US Stocks']

export default function Includes() {
  return (
    <section id="strategy" className="py-20 sm:py-32 border-t border-line bg-subtle">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">

        <FadeIn className="mb-14">
          <span className="label">What&apos;s Included</span>
          <h2 className="mt-3 text-3xl sm:text-[40px] font-black tracking-[-0.03em] text-ink">Everything You Get</h2>
          <p className="mt-2 text-[15px] text-ink-muted">One pack. Script + strategy + tools. No upsells. Ever.</p>
        </FadeIn>

        {/* Featured card */}
        <FadeIn delay={0.05}>
          <div className="rounded-2xl bg-white shadow-card border-l-2 border-gold p-7 mb-4 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-xl">🥇</span>
                  <h3 className="font-bold text-[18px] text-ink tracking-tight">Golden Indicator Script</h3>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold-bg text-gold border border-gold-border">
                    Pine Script v5
                  </span>
                </div>
                <p className="text-[14px] text-ink-muted leading-[1.75] max-w-lg">
                  Proprietary multi-layer signal engine. Copy and paste into TradingView — BUY/SELL
                  signals appear instantly. Covers trend, momentum, key levels, session timing, and
                  volume. Works on any symbol, any timeframe, globally.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="flex flex-wrap gap-1.5">
                  {markets.map(t => (
                    <span key={t} className="text-[11px] font-mono text-ink-muted bg-subtle border border-line rounded-md px-2.5 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 3-col extras */}
        <div className="grid sm:grid-cols-3 gap-3">
          {extras.map(({ icon, title, tag, desc }, i) => (
            <FadeIn key={title} delay={0.07 + i * 0.06}>
              <div className="card card-hover p-6 h-full">
                <div className="text-[18px] mb-3">{icon}</div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-semibold text-[14px] text-ink">{title}</h3>
                  {tag && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-up/8 text-up border border-up/20">
                      {tag}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-ink-muted leading-[1.7]">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.28}>
          <div className="mt-4 rounded-xl border border-line bg-white px-5 py-3.5 text-center">
            <p className="text-[13px] text-ink-muted font-mono">
              Works on free TradingView · Any timeframe · Any symbol worldwide · Instant delivery via email
            </p>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
