import Badge from '../ui/Badge'
import Button from '../ui/Button'

const stats = [
  { value: '3',      label: 'Confirmations' },
  { value: '15min',  label: 'Timeframe' },
  { value: '1:1.5',  label: 'Risk Reward' },
  { value: '100%',   label: 'Rule-based' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-grid pt-16 overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-blue/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-accent-green/4 blur-[80px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        <Badge variant="blue">Nifty &amp; BankNifty · Intraday · TradingView</Badge>

        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05]">
          Stop Guessing.<br />
          <span className="text-gradient">Start Trading</span><br />
          With a System.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
          The ETS Intraday Momentum Pack gives Nifty &amp; BankNifty traders a
          3-confirmation system with a TradingView script that shows exactly
          when to buy and sell.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="#pricing" size="lg">
            Get the Pack — ₹999 →
          </Button>
          <Button href="#strategy" variant="secondary" size="lg">
            See How It Works
          </Button>
        </div>

        <p className="mt-4 text-xs text-ink-faint">
          Instant delivery · No subscription · Yours forever
        </p>

        {/* Stats row */}
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
