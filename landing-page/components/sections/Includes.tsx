const items = [
  {
    icon: '📘',
    title: 'Strategy PDF Guide',
    desc: '18+ pages. Entry rules, exit rules, real chart examples, risk management framework.',
  },
  {
    icon: '📊',
    title: 'Pine Script v5 (TradingView)',
    desc: 'Copy, paste, see BUY/SELL labels on your chart the same day. Free TradingView account works.',
  },
  {
    icon: '✅',
    title: 'Quick-Start Checklist',
    desc: 'Your complete pre-trade routine on a single page. Under 60 seconds to run through.',
  },
  {
    icon: '📋',
    title: 'Installation Guide',
    desc: 'Step-by-step: how to add the script to TradingView in under 5 minutes.',
  },
]

export default function Includes() {
  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Everything You Get</h2>
          <p className="mt-3 text-ink-muted">One pack. Everything you need to start trading the system today.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {items.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 bg-bg-surface border border-border rounded-card p-5 hover:border-accent-blue/30 transition-colors duration-200"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
              <div>
                <div className="font-semibold text-ink">{title}</div>
                <div className="text-ink-muted text-sm mt-1 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-card border border-border bg-bg-surface/60 p-4 text-center max-w-xl mx-auto">
          <p className="text-sm text-ink-muted">
            Works on <span className="text-ink">free TradingView</span> ·
            <span className="text-ink"> 15-min charts</span> ·
            <span className="text-ink"> Nifty &amp; BankNifty</span>
          </p>
        </div>
      </div>
    </section>
  )
}
