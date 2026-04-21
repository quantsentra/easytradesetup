import FadeIn from '../ui/FadeIn'

const items = [
  'Golden Indicator Pine Script v5 — TradingView',
  'Multi-layer signal engine (trend, momentum, levels, volume, session timing)',
  'Trade Logic PDF — entry rules, exit rules, real chart examples',
  'Risk Calculator — position size, R:R, risk % (free forever)',
  'Daily AI-powered market updates — email & Telegram',
  'Works on any symbol, any timeframe, any market globally',
  'Lifetime access — one-time payment, no subscription ever',
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-32 border-t border-[rgba(255,255,255,0.07)]">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">

        <FadeIn className="mb-14 text-center">
          <span className="label text-ink-faint">Pricing</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-[-0.03em]">One Product. Everything Included.</h2>
          <p className="mt-2 text-ink-muted text-[15px]">One-time payment · Instant delivery · No subscription · Ever</p>
          <div className="mt-4 inline-flex items-center gap-2 border border-[rgba(255,255,255,0.07)] rounded-full px-4 py-1.5 bg-bg-surface">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-soft" />
            <span className="text-[11px] font-mono text-ink-muted">Payment live soon — get notified below</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="max-w-md mx-auto">
          <div className="rounded-2xl border border-gold/25 bg-bg-surface overflow-hidden shadow-gold">

            {/* Header */}
            <div className="border-b border-[rgba(255,255,255,0.07)] px-8 pt-8 pb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold">Golden Indicator Pack</span>
                <span className="text-[10px] font-mono text-ink-faint">★ v7</span>
              </div>
              <div className="flex items-end gap-2 mt-4">
                <span className="text-5xl font-black font-mono text-ink tracking-tight">₹2,499</span>
                <span className="text-ink-muted text-sm mb-1.5">one-time</span>
              </div>
              <p className="text-[13px] text-ink-muted mt-1.5">Pay once. Use forever.</p>
            </div>

            {/* Item list */}
            <div className="px-8 py-6 space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[13px] text-ink-muted leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-8 pb-8">
              <a
                href="/contact"
                className="block w-full text-center bg-gold text-black font-bold text-[15px] py-4 rounded-xl hover:bg-gold-light transition-colors duration-150 tracking-tight"
              >
                Get Notified When We Launch →
              </a>
              <p className="mt-3 text-center text-[11px] font-mono text-ink-faint">
                UPI · Net Banking · Cards · All Indian payment methods
              </p>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  )
}
