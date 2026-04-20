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
      {/* Floating glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[700px] h-[700px] rounded-full bg-accent-blue/[0.07] blur-[140px] animate-float" />
        </div>
        <div className="absolute bottom-10 left-1/4 w-[350px] h-[350px] rounded-full bg-accent-green/[0.05] blur-[90px] animate-float-slow [animation-delay:2.5s]" />
        <div className="absolute top-1/4 right-1/5 w-[200px] h-[200px] rounded-full bg-accent-blue/[0.04] blur-[70px] animate-float [animation-delay:4s] [animation-duration:8s]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        {/* Badge */}
        <div className="animate-fade-down inline-block">
          <Badge variant="blue">TradingView · Works on Any Symbol · NSE F&amp;O · Global Markets</Badge>
        </div>

        {/* Headline */}
        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] animate-fade-up [animation-delay:80ms]">
          One Indicator.<br />
          <span className="text-gradient">Every Edge</span><br />
          You Need.
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed animate-fade-up [animation-delay:180ms]">
          The <strong className="text-ink">Golden Indicator</strong> is a proprietary TradingView script built from years of
          live trading. It tells you exactly when to enter, when to wait, and when to exit —
          on any symbol, any timeframe, anywhere in the world.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up [animation-delay:280ms]">
          <Button href="#pricing" size="lg">
            Get the Golden Indicator — ₹2,499 →
          </Button>
          <Button href="#strategy" variant="secondary" size="lg">
            See What&apos;s Inside
          </Button>
        </div>

        {/* Trust line */}
        <p className="mt-4 text-xs text-ink-faint animate-fade-up [animation-delay:360ms]">
          Instant delivery · One-time payment · Yours forever · Free daily market updates included
        </p>

        {/* Stats grid */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border animate-fade-up [animation-delay:440ms]">
          {stats.map(({ value, label }) => (
            <div key={label} className="bg-bg-surface px-4 sm:px-6 py-5 text-center group hover:bg-bg-raised transition-colors duration-200">
              <div className="text-xl sm:text-2xl font-black text-accent-blue group-hover:scale-110 transition-transform duration-200 inline-block">{value}</div>
              <div className="text-xs text-ink-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
