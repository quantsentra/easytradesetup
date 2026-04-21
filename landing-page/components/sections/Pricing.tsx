import FadeIn from '../ui/FadeIn'

const features = [
  { icon: '🥇', text: 'Golden Indicator Pine Script v5 (TradingView)' },
  { icon: '📐', text: 'Multi-layer signal engine — trend, momentum, levels, session timing, volume' },
  { icon: '📘', text: 'Trade Logic PDF — entry rules, exit rules, real chart examples' },
  { icon: '🧮', text: 'Risk Calculator — web portal, free forever' },
  { icon: '📡', text: 'Free Daily Market Updates — AI-powered pre/post market analysis via email & Telegram' },
  { icon: '🌐', text: 'Works on any symbol, any timeframe, any market globally' },
  { icon: '♾️', text: 'Lifetime access · one-time payment · no subscription ever' },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-14 sm:py-24 border-y border-border relative overflow-hidden">
      <div className="absolute inset-0 aurora-purple opacity-60 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

        <FadeIn className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-accent-purple/80 mb-3">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">One Product. Everything Included.</h2>
          <p className="mt-3 text-ink-muted">One-time payment · Instant delivery · No subscription · Ever</p>
          <div className="mt-4 inline-flex items-center gap-2 glass rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            <span className="text-xs text-accent-blue font-medium">Payment coming soon — get notified when we launch</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} className="max-w-lg mx-auto">
          {/* Border beam wrapper */}
          <div className="border-beam rounded-[20px] animate-glow-pulse">
            <div className="glass rounded-[20px] p-8 flex flex-col relative overflow-hidden">

              {/* Top badge */}
              <div className="absolute -top-px left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-b-lg bg-gradient-to-r from-accent-blue via-accent-purple to-accent-green text-black text-xs font-black tracking-wide">
                  ★ Golden Indicator Pack
                </span>
              </div>

              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/[0.03] via-accent-purple/[0.03] to-accent-green/[0.03] rounded-[20px] pointer-events-none" />

              <div className="text-center mb-8 mt-4 relative">
                <div className="flex items-end justify-center gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-ink">₹2,499</span>
                  <span className="text-ink-faint text-sm mb-3">one-time</span>
                </div>
                <p className="text-ink-muted text-sm mt-1">Pay once. Use forever.</p>
              </div>

              <ul className="space-y-3.5 mb-10 relative">
                {features.map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm">
                    <span className="text-base flex-shrink-0 leading-tight mt-0.5">{icon}</span>
                    <span className="text-ink-muted leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/contact"
                className="relative block text-center py-4 px-8 rounded-xl font-bold text-base transition-all duration-200
                  bg-accent-green text-black hover:bg-accent-green/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-green/25
                  shadow-glow-green"
              >
                Get Notified When We Launch →
              </a>

              <p className="mt-4 text-center text-xs text-ink-faint relative">
                UPI · Net Banking · Cards · All Indian payment methods · Instant delivery via email
              </p>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
