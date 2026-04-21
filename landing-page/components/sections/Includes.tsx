import FadeIn from '../ui/FadeIn'

const extras = [
  {
    icon: '📘',
    title: 'Trade Logic PDF',
    desc: 'Entry rules, exit rules, SL placement, real chart examples. Everything in writing — no guesswork.',
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
    desc: 'Web portal — position size, R:R ratio, risk % per trade. Free forever for customers.',
  },
]

const markets = ['NIFTY', 'BANKNIFTY', 'NSE Stocks', 'Forex', 'Crypto', 'US Stocks']

export default function Includes() {
  return (
    <section id="strategy" className="py-20 sm:py-32 border-t border-[rgba(255,255,255,0.07)]">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">

        <FadeIn className="mb-14">
          <span className="label text-ink-faint">What&apos;s Included</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-[-0.03em]">Everything You Get</h2>
          <p className="mt-2 text-ink-muted text-[15px]">One pack. Script + strategy + tools. No upsells. Ever.</p>
        </FadeIn>

        {/* Featured: Golden Indicator Script */}
        <FadeIn delay={0.05}>
          <div className="rounded-xl border border-[rgba(255,255,255,0.09)] bg-bg-surface p-7 mb-4 relative overflow-hidden">
            {/* Gold left border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold rounded-l-xl" />

            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">🥇</span>
                  <h3 className="font-bold text-ink text-lg tracking-tight">Golden Indicator Script</h3>
                  <span className="label text-gold/70 bg-gold-faint border border-gold/15 rounded-full px-2.5 py-0.5">Pine Script v5</span>
                </div>
                <p className="text-[14px] text-ink-muted leading-[1.7] max-w-xl">
                  Proprietary multi-layer signal engine. Copy and paste into TradingView — BUY/SELL
                  signals appear instantly. Covers trend, momentum, key levels, session timing, and
                  volume. Works on any symbol, any timeframe, globally.
                </p>
              </div>

              <div className="flex-shrink-0 sm:pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {markets.map(t => (
                    <span key={t} className="text-[11px] font-mono text-ink-faint bg-bg-raised border border-[rgba(255,255,255,0.07)] rounded-md px-2.5 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Extra items */}
        <div className="grid sm:grid-cols-3 gap-3">
          {extras.map(({ icon, title, tag, desc }, i) => (
            <FadeIn key={title} delay={0.08 + i * 0.06}>
              <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-bg-surface p-6 h-full hover:border-[rgba(255,255,255,0.13)] hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-base mb-3">{icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-ink text-[14px]">{title}</h3>
                  {tag && (
                    <span className="text-[9px] font-bold font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-signal-up/10 text-signal-up border border-signal-up/20">
                      {tag}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-ink-muted leading-[1.7]">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.28} className="mt-4 rounded-lg border border-[rgba(255,255,255,0.07)] bg-bg-raised px-5 py-3.5 text-center">
          <p className="text-[13px] text-ink-muted font-mono">
            Works on free TradingView · Any timeframe · Any symbol worldwide · Instant delivery via email
          </p>
        </FadeIn>

      </div>
    </section>
  )
}
