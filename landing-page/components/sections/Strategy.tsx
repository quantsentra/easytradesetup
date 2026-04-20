const results = [
  {
    label: 'NIFTY 50 · 15min',
    outcome: '+127 pts',
    tag: 'Long Trade',
    tagColor: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    note: 'Signal fired at open. Target hit before noon.',
  },
  {
    label: 'BANKNIFTY · 15min',
    outcome: '+310 pts',
    tag: 'Long Trade',
    tagColor: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    note: 'Clean trend day. No re-entries needed.',
  },
  {
    label: 'NIFTY 50 · 15min',
    outcome: '+94 pts',
    tag: 'Short Trade',
    tagColor: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    note: 'Gap-down session. Signal confirmed, SL untouched.',
  },
  {
    label: 'BANKNIFTY · 5min',
    outcome: '+180 pts',
    tag: 'Long Trade',
    tagColor: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    note: 'Pre-market level held. Momentum entry triggered.',
  },
]

function ChartCard({ label, outcome, tag, tagColor, note }: typeof results[0]) {
  return (
    <div className="rounded-card border border-border bg-bg-surface overflow-hidden hover:border-accent-blue/30 transition-colors duration-200 group">
      {/* Chart area */}
      <div className="relative aspect-video bg-bg-raised flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-green/5" />
        {/* Fake candle chart lines */}
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 200" preserveAspectRatio="none">
          <polyline points="0,160 30,155 60,140 90,130 120,110 150,100 180,85 210,70 240,65 270,55 300,50 330,45 360,38 400,30"
            fill="none" stroke="#6572f8" strokeWidth="2" />
          <polyline points="0,180 30,175 60,168 90,155 120,148 150,138 180,125 210,112 240,105 270,95 300,90 330,82 360,75 400,65"
            fill="none" stroke="#00d1b2" strokeWidth="1.5" strokeDasharray="5,3" />
          {/* Entry marker */}
          <circle cx="150" cy="138" r="5" fill="#22c55e" opacity="0.8" />
          <line x1="150" y1="120" x2="150" y2="155" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.6" />
          {/* Target marker */}
          <circle cx="330" cy="82" r="5" fill="#6572f8" opacity="0.8" />
        </svg>
        <div className="relative z-10 text-center">
          <div className="text-2xl font-black text-accent-green">{outcome}</div>
          <div className="text-xs text-ink-faint mt-1">Chart visible after purchase</div>
        </div>
        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-end p-3">
          <span className="text-xs text-ink-faint/50">🔒 Full chart included in pack</span>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-ink-muted">{label}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tagColor}`}>{tag}</span>
        </div>
        <p className="text-sm text-ink-faint">{note}</p>
      </div>
    </div>
  )
}

export default function Strategy() {
  return (
    <section id="strategy" className="py-24 bg-bg-surface/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">The Results Speak.</h2>
          <p className="mt-3 text-ink-muted max-w-md mx-auto">
            Real trades. Real charts. The indicator tells you exactly when to enter and when to exit —
            no guesswork, no noise.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {results.map((r) => (
            <ChartCard key={r.label + r.outcome} {...r} />
          ))}
        </div>

        <div className="mt-10 rounded-card border border-border bg-bg-surface p-6 text-center">
          <p className="text-sm text-ink-muted mb-1">
            Full trade examples with annotated charts are included in the pack.
          </p>
          <p className="text-xs text-ink-faint">
            How the indicator works stays between you and your chart. No one else needs to know.
          </p>
          <a
            href="#pricing"
            className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-semibold hover:bg-accent-blue/20 transition-colors"
          >
            Get the Golden Indicator →
          </a>
        </div>
      </div>
    </section>
  )
}
