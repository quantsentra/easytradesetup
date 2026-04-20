const tools = [
  {
    num: '01',
    name: 'Lifeline EMA',
    subtitle: 'Dynamic Trend Line',
    desc: 'A custom smoothed EMA that hugs price tightly in trends and reacts slowly to noise. Your primary bias filter — price above = bullish, below = bearish.',
    color: 'text-accent-blue',
    border: 'border-accent-blue/20',
    bg: 'bg-accent-blue/5',
  },
  {
    num: '02',
    name: 'EMA 200',
    subtitle: 'Market Direction',
    desc: 'The long-term trend anchor. Know whether you are trading with or against the market. Never fight the 200 EMA.',
    color: 'text-accent-green',
    border: 'border-accent-green/20',
    bg: 'bg-accent-green/5',
  },
  {
    num: '03',
    name: 'ADR CD Zones',
    subtitle: 'Daily Range Bands',
    desc: 'Average Daily Range bands (5-day and 10-day) plotted from the daily open. Shows where price is likely to exhaust — and where breakouts carry conviction.',
    color: 'text-accent-orange',
    border: 'border-accent-orange/20',
    bg: 'bg-accent-orange/5',
  },
  {
    num: '04',
    name: 'CPR Pivots',
    subtitle: 'Central Pivot Range',
    desc: 'Daily Pivot, TC, BC, and R1–R4 / S1–S4 auto-plotted. The most respected intraday support and resistance levels used by institutional traders.',
    color: 'text-accent-blue',
    border: 'border-accent-blue/20',
    bg: 'bg-accent-blue/5',
  },
  {
    num: '05',
    name: 'Momentum Candles',
    subtitle: 'High-Conviction Entries',
    desc: 'Candles where the body is ≥70% of the true range — pure momentum, no indecision. Blue for bullish, black for bearish.',
    color: 'text-accent-green',
    border: 'border-accent-green/20',
    bg: 'bg-accent-green/5',
  },
  {
    num: '06',
    name: 'MTF High / Low',
    subtitle: 'Multi-Timeframe Levels',
    desc: 'Previous Daily, Weekly, and Monthly highs and lows plotted as lines. These are the levels institutions watch — respect them.',
    color: 'text-accent-orange',
    border: 'border-accent-orange/20',
    bg: 'bg-accent-orange/5',
  },
  {
    num: '07',
    name: 'Careful Candle',
    subtitle: 'Volume Divergence Alert',
    desc: 'Detects candles where volume direction contradicts price direction — a warning sign that smart money is absorbed. Highlighted in yellow with a flag.',
    color: 'text-accent-blue',
    border: 'border-accent-blue/20',
    bg: 'bg-accent-blue/5',
  },
  {
    num: '08',
    name: 'Indian Market Timings',
    subtitle: 'Session Highlights',
    desc: 'First and last 5-minute sessions highlighted. Previous day last-5min H/L lines auto-plotted. Optimised for 9:15 AM – 3:30 PM NSE sessions.',
    color: 'text-accent-green',
    border: 'border-accent-green/20',
    bg: 'bg-accent-green/5',
  },
]

export default function Strategy() {
  return (
    <section id="strategy" className="py-24 bg-bg-surface/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">8 Tools. One Indicator.</h2>
          <p className="mt-3 text-ink-muted max-w-lg mx-auto">
            Every tool in the Golden Indicator has a specific job. No clutter. No redundancy.
            Each layer confirms what the others are saying.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map(({ num, name, subtitle, desc, color, border, bg }) => (
            <div
              key={num}
              className={`relative rounded-card p-5 border ${border} ${bg} hover:shadow-card transition-all duration-300`}
            >
              <div className={`text-4xl font-black ${color} opacity-20 leading-none mb-3`}>{num}</div>
              <div className={`text-base font-bold ${color}`}>{name}</div>
              <div className="text-xs text-ink-muted font-medium uppercase tracking-widest mb-3">{subtitle}</div>
              <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-card border border-border bg-bg-surface p-6 text-center">
          <p className="text-sm text-ink-muted mb-3">Works on any symbol and timeframe</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            {['Nifty 50', 'BankNifty', 'RELIANCE', 'BTCUSDT', 'EURUSD', 'Gold', 'Any NSE Stock', 'Any Crypto'].map((sym) => (
              <span key={sym} className="px-3 py-1.5 rounded-lg bg-bg-raised border border-border text-ink-muted">{sym}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
