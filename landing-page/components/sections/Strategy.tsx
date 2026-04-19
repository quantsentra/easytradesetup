const indicators = [
  {
    num: '01',
    name: 'EMA 9 / 21',
    subtitle: 'Trend Direction',
    desc: 'When the fast EMA (9) is above the slow EMA (21), the market is in a bullish trend. Only trade in the direction the market is already moving.',
    color: 'text-accent-blue',
    border: 'border-accent-blue/20',
    bg: 'bg-accent-blue/5',
  },
  {
    num: '02',
    name: 'Supertrend',
    subtitle: 'Entry Timing',
    desc: 'Flips green for long entries, red for short entries. When it flips, the entry signal fires. No subjective interpretation — just a colour change.',
    color: 'text-accent-green',
    border: 'border-accent-green/20',
    bg: 'bg-accent-green/5',
  },
  {
    num: '03',
    name: 'RSI Filter',
    subtitle: 'Momentum Check',
    desc: 'RSI between 45–70 confirms long momentum. RSI between 30–55 confirms short. Keeps you out of weak, exhausted, or overextended moves.',
    color: 'text-accent-orange',
    border: 'border-accent-orange/20',
    bg: 'bg-accent-orange/5',
  },
]

export default function Strategy() {
  return (
    <section id="strategy" className="py-24 bg-bg-surface/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">The ETS Momentum Setup</h2>
          <p className="mt-3 text-ink-muted max-w-md mx-auto">
            Three confirmations. One clear signal. All three must agree before the script generates a BUY or SELL label.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {indicators.map(({ num, name, subtitle, desc, color, border, bg }) => (
            <div
              key={num}
              className={`relative rounded-card p-6 border ${border} ${bg} hover:shadow-card transition-all duration-300`}
            >
              <div className={`text-5xl font-black ${color} opacity-30 leading-none mb-4`}>{num}</div>
              <div className={`text-lg font-bold ${color}`}>{name}</div>
              <div className="text-xs text-ink-muted font-medium uppercase tracking-widest mb-3">{subtitle}</div>
              <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Signal flow */}
        <div className="mt-10 rounded-card border border-border bg-bg-surface p-6 text-center">
          <p className="text-sm text-ink-muted">Signal logic</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20">EMA 9 &gt; EMA 21</span>
            <span className="text-ink-faint">+</span>
            <span className="px-3 py-1.5 rounded-lg bg-accent-green/10 text-accent-green border border-accent-green/20">Supertrend GREEN</span>
            <span className="text-ink-faint">+</span>
            <span className="px-3 py-1.5 rounded-lg bg-accent-orange/10 text-accent-orange border border-accent-orange/20">RSI 45–70</span>
            <span className="text-ink-faint">=</span>
            <span className="px-4 py-1.5 rounded-lg bg-accent-green text-black font-bold border border-accent-green/20">BUY</span>
          </div>
        </div>
      </div>
    </section>
  )
}
