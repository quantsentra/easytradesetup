import Badge from '../ui/Badge'
import Button from '../ui/Button'

const stats = [
  { value: '8',       label: 'Tools Built-in' },
  { value: 'Any',     label: 'Symbol / TF' },
  { value: '₹2,499',  label: 'One-Time' },
  { value: '∞',       label: 'Lifetime Access' },
]

function ChartMockup() {
  type Candle = { x: number; o: number; h: number; l: number; c: number; bull: boolean }
  const candles: Candle[] = [
    { x: 30,  o: 68, h: 72, l: 65, c: 70, bull: true },
    { x: 58,  o: 70, h: 74, l: 68, c: 69, bull: false },
    { x: 86,  o: 69, h: 71, l: 64, c: 65, bull: false },
    { x: 114, o: 65, h: 67, l: 60, c: 62, bull: false },
    { x: 142, o: 62, h: 68, l: 61, c: 67, bull: true },
    { x: 170, o: 67, h: 73, l: 66, c: 72, bull: true },
    { x: 198, o: 72, h: 78, l: 71, c: 76, bull: true },
    { x: 226, o: 76, h: 82, l: 75, c: 80, bull: true },
    { x: 254, o: 80, h: 84, l: 77, c: 79, bull: false },
    { x: 282, o: 79, h: 81, l: 74, c: 76, bull: false },
    { x: 310, o: 76, h: 78, l: 70, c: 72, bull: false },
    { x: 338, o: 72, h: 74, l: 67, c: 73, bull: true },
    { x: 366, o: 73, h: 80, l: 72, c: 79, bull: true },
    { x: 394, o: 79, h: 86, l: 78, c: 85, bull: true },
    { x: 422, o: 85, h: 90, l: 84, c: 88, bull: true },
    { x: 450, o: 88, h: 92, l: 84, c: 86, bull: false },
  ]

  const scaleY = (v: number) => 160 - ((v - 55) / 45) * 130

  return (
    <div className="relative w-full max-w-[580px] mx-auto lg:mx-0 animate-fade-up [animation-delay:320ms]">
      {/* Glow behind mockup */}
      <div className="absolute inset-0 -inset-x-8 bg-accent-blue/[0.08] blur-[60px] rounded-full pointer-events-none" />

      {/* Browser frame */}
      <div className="relative rounded-2xl border border-border bg-bg-surface shadow-2xl shadow-black/40 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-raised">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 mx-3 bg-bg-surface border border-border rounded-md px-3 py-1 text-[10px] text-ink-faint font-mono">
            tradingview.com · NIFTY 50 · 15m
          </div>
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
        </div>

        {/* Chart area */}
        <div className="bg-[#0d1117] p-4">
          {/* Top bar: symbol + timeframes */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink">NIFTY 50</span>
              <span className="text-[10px] text-ink-faint">·</span>
              <span className="text-[10px] text-accent-blue font-semibold">15</span>
              {['5','1H','4H','D'].map(t => (
                <span key={t} className="text-[10px] text-ink-faint hover:text-ink cursor-pointer">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="px-2 py-0.5 rounded bg-accent-blue/15 border border-accent-blue/25 text-[9px] text-accent-blue font-bold">
                Golden Indicator v2
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            </div>
          </div>

          {/* SVG Chart */}
          <svg viewBox="0 0 480 170" className="w-full" style={{ height: '180px' }}>
            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
              <line key={i} x1="0" y1={170 * t} x2="480" y2={170 * t}
                stroke="#ffffff08" strokeWidth="1" />
            ))}

            {/* EMA line */}
            <polyline
              points={candles.map(({ x, c }) => `${x},${scaleY(c)}`).join(' ')}
              fill="none" stroke="#6572f8" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.5"
            />

            {/* Candles */}
            {candles.map(({ x, o, h, l, c, bull }, i) => {
              const top = scaleY(Math.max(o, c))
              const bot = scaleY(Math.min(o, c))
              const height = Math.max(bot - top, 2)
              const color = bull ? '#22c55e' : '#ef4444'
              return (
                <g key={i}>
                  <line x1={x} y1={scaleY(h)} x2={x} y2={scaleY(l)}
                    stroke={color} strokeWidth="1" opacity="0.7" />
                  <rect x={x - 8} y={top} width="16" height={height}
                    fill={color} opacity={bull ? '0.85' : '0.75'} rx="1" />
                </g>
              )
            })}

            {/* Buy signal at candle index 6 (x=198) */}
            <g>
              <polygon points="198,148 193,158 203,158" fill="#22c55e" opacity="0.95" />
              <text x="198" y="168" textAnchor="middle" fontSize="7" fill="#22c55e" fontWeight="bold">BUY</text>
            </g>

            {/* Buy signal at candle index 13 (x=394) */}
            <g>
              <polygon points="394,118 389,128 399,128" fill="#22c55e" opacity="0.95" />
              <text x="394" y="138" textAnchor="middle" fontSize="7" fill="#22c55e" fontWeight="bold">BUY</text>
            </g>

            {/* Exit signal at candle index 15 (x=450) */}
            <g>
              <polygon points="450,55 445,46 455,46" fill="#6572f8" opacity="0.95" />
              <text x="450" y="44" textAnchor="middle" fontSize="7" fill="#6572f8" fontWeight="bold">EXIT</text>
            </g>

            {/* Profit annotation */}
            <rect x="310" y="10" width="80" height="20" rx="4" fill="#22c55e" opacity="0.15" />
            <rect x="310" y="10" width="80" height="20" rx="4" fill="none" stroke="#22c55e" strokeWidth="0.5" opacity="0.4" />
            <text x="350" y="23" textAnchor="middle" fontSize="8" fill="#22c55e" fontWeight="bold">+127 pts ↑</text>
          </svg>

          {/* Bottom stats bar */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            {[
              { label: 'Signal', value: 'LONG', color: 'text-accent-green' },
              { label: 'Trend', value: 'Bullish', color: 'text-accent-green' },
              { label: 'Momentum', value: 'Strong', color: 'text-accent-blue' },
              { label: 'Level', value: 'Near S1', color: 'text-ink-muted' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className={`text-[10px] font-bold ${color}`}>{value}</div>
                <div className="text-[9px] text-ink-faint mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badge: signal card */}
      <div className="absolute -bottom-4 -left-4 bg-bg-surface border border-border rounded-xl px-3 py-2 shadow-xl shadow-black/30 animate-float-slow [animation-delay:1s]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent-green/20 border border-accent-green/30 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-bold text-ink">Signal Confirmed</div>
            <div className="text-[9px] text-ink-faint">3/3 conditions met</div>
          </div>
        </div>
      </div>

      {/* Floating badge: accuracy */}
      <div className="absolute -top-3 -right-3 bg-bg-surface border border-border rounded-xl px-3 py-2 shadow-xl shadow-black/30 animate-float [animation-delay:2s]">
        <div className="text-[10px] font-bold text-accent-blue">+310 pts</div>
        <div className="text-[9px] text-ink-faint">BankNifty · Today</div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-grid pt-16 overflow-hidden">
      {/* Floating glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2">
          <div className="w-[600px] h-[600px] rounded-full bg-accent-blue/[0.07] blur-[140px] animate-float" />
        </div>
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] rounded-full bg-accent-green/[0.05] blur-[90px] animate-float-slow [animation-delay:2.5s]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="animate-fade-down inline-block">
              <Badge variant="blue">TradingView · Any Symbol · NSE F&amp;O · Global Markets</Badge>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] animate-fade-up [animation-delay:80ms]">
              One Indicator.<br />
              <span className="text-gradient">Every Edge</span><br />
              You Need.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-up [animation-delay:180ms]">
              The <strong className="text-ink">Golden Indicator</strong> — a proprietary TradingView script
              built from years of live trading. Tells you exactly when to enter, wait, and exit.
              Any symbol. Any timeframe.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 animate-fade-up [animation-delay:280ms]">
              <Button href="#pricing" size="lg">
                Get the Golden Indicator — ₹2,499 →
              </Button>
              <Button href="#strategy" variant="secondary" size="lg">
                See What&apos;s Inside
              </Button>
            </div>

            <p className="mt-4 text-xs text-ink-faint animate-fade-up [animation-delay:360ms] text-center lg:text-left">
              Instant delivery · One-time payment · Yours forever · Free daily market updates included
            </p>

            {/* Stats grid */}
            <div className="mt-10 grid grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border animate-fade-up [animation-delay:440ms]">
              {stats.map(({ value, label }) => (
                <div key={label} className="bg-bg-surface px-3 sm:px-4 py-4 text-center group hover:bg-bg-raised transition-colors duration-200">
                  <div className="text-lg sm:text-xl font-black text-accent-blue group-hover:scale-110 transition-transform duration-200 inline-block">{value}</div>
                  <div className="text-[10px] sm:text-xs text-ink-muted mt-1 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: chart mockup */}
          <div className="flex-1 w-full lg:w-auto">
            <ChartMockup />
          </div>

        </div>
      </div>
    </section>
  )
}
