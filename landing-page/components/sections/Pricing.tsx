'use client'

const features = [
  { icon: '🥇', text: 'Golden Indicator Pine Script v7 (TradingView v5)' },
  { icon: '📐', text: 'Proprietary multi-layer signal engine — covers trend, momentum, levels, session timing, and volume' },
  { icon: '📘', text: 'Trade Logic PDF — entry rules, exit rules, real chart examples' },
  { icon: '🧮', text: 'Risk Calculator — web portal, free forever' },
  { icon: '📡', text: 'Free Daily Market Updates — AI-powered pre/post market analysis, delivered via email & Telegram' },
  { icon: '🌐', text: 'Works on any symbol, any timeframe, any market globally' },
  { icon: '♾️', text: 'Lifetime access · one-time payment · no subscription ever' },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-bg-surface/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">One Product. Everything Included.</h2>
          <p className="mt-3 text-ink-muted">One-time payment · Instant delivery · No subscription · Ever</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            <span className="text-xs text-accent-blue font-medium">Payment coming soon — get notified when we launch</span>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative rounded-card border-glow bg-bg-surface shadow-glow p-8 flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-accent-blue text-black text-xs font-bold tracking-wide">
                ★ Golden Indicator Pack
              </span>
            </div>

            <div className="text-center mb-8 mt-2">
              <div className="flex items-end justify-center gap-2">
                <span className="text-6xl font-black text-ink">₹2,499</span>
                <span className="text-ink-faint text-sm mb-2">one-time</span>
              </div>
              <p className="text-ink-muted text-sm mt-2">Pay once. Use forever.</p>
            </div>

            <ul className="space-y-4 mb-10">
              {features.map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <span className="text-lg flex-shrink-0 leading-tight">{icon}</span>
                  <span className="text-ink-muted leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            <a
              href="/contact"
              className="block text-center py-4 px-8 rounded-xl font-bold text-base transition-all duration-200 bg-accent-green text-black hover:bg-accent-green/90 shadow-glow-green"
            >
              Get Notified When We Launch →
            </a>

            <p className="mt-4 text-center text-xs text-ink-faint">
              UPI · Net Banking · Cards · All Indian payment methods · Instant delivery via email
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
