import Badge from '../ui/Badge'
import Button from '../ui/Button'

const stats = [
  { value: '8',       label: 'Tools Built-in' },
  { value: 'Any',     label: 'Symbol / TF' },
  { value: '₹2,499',  label: 'One-Time' },
  { value: '∞',       label: 'Lifetime Access' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-grid pt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-blue/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-accent-green/4 blur-[80px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        <Badge variant="blue">TradingView · Works on Any Symbol · NSE F&amp;O · Global Markets</Badge>

        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05]">
          One Indicator.<br />
          <span className="text-gradient">Every Edge</span><br />
          You Need.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
          The <strong className="text-ink">Golden Indicator</strong> combines 8 precision tools — Lifeline EMA, ADR CD Zones, CPR Pivots,
          Momentum Candles, MTF High/Low levels, and Careful Candle detection — into one clean TradingView script.
          Works on any symbol, any timeframe, anywhere in the world.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="#pricing" size="lg">
            Get the Golden Indicator — ₹2,499 →
          </Button>
          <Button href="#strategy" variant="secondary" size="lg">
            See What&apos;s Inside
          </Button>
        </div>

        <p className="mt-4 text-xs text-ink-faint">
          Instant delivery · One-time payment · Yours forever · Free daily market updates included
        </p>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {stats.map(({ value, label }) => (
            <div key={label} className="bg-bg-surface px-6 py-5 text-center">
              <div className="text-2xl font-black text-accent-blue">{value}</div>
              <div className="text-xs text-ink-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
