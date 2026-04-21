import FadeIn from '../ui/FadeIn'

export default function Includes() {
  return (
    <section className="py-14 sm:py-24 border-b border-border relative overflow-hidden">
      <div className="absolute inset-0 aurora-purple opacity-50 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

        <FadeIn className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-accent-purple/80 mb-3">What&apos;s Included</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Everything You Get</h2>
          <p className="mt-3 text-ink-muted">One pack. Script + strategy + daily updates + tools. No upsells ever.</p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          <FadeIn delay={0.08} className="lg:col-span-2">
            <div className="glass rounded-xl p-6 h-full group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent-blue/8
              transition-all duration-300 cursor-default relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-blue/[0.04] rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center mb-4
                  group-hover:scale-110 group-hover:bg-accent-blue/20 transition-all duration-300">
                  <span className="text-xl">🥇</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-ink text-lg group-hover:text-accent-blue transition-colors duration-200">Golden Indicator Script</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">Pine Script v5</span>
                </div>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Proprietary multi-layer signal engine. Copy, paste into TradingView — signals appear instantly.
                  Covers trend, momentum, key levels, session timing, and volume. Works on any symbol, any timeframe, globally.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['NIFTY','BANKNIFTY','NSE Stocks','Forex','Crypto','US Stocks'].map(t => (
                    <span key={t} className="text-[10px] text-ink-faint bg-bg-raised border border-border rounded-full px-2.5 py-1">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <div className="glass rounded-xl p-6 h-full group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent-purple/8
              transition-all duration-300 cursor-default relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-purple/[0.05] rounded-full blur-2xl pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mb-4
                group-hover:scale-110 transition-all duration-300">
                <span className="text-xl">📘</span>
              </div>
              <h3 className="font-bold text-ink mb-2 group-hover:text-accent-purple transition-colors duration-200">Trade Logic PDF</h3>
              <p className="text-ink-muted text-sm leading-relaxed">Entry rules, exit rules, real chart examples, and risk management — all in writing. Reference it any time.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.20}>
            <div className="glass rounded-xl p-6 h-full group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent-green/8
              transition-all duration-300 cursor-default relative overflow-hidden">
              <div className="absolute top-0 left-0 w-36 h-36 bg-accent-green/[0.04] rounded-full blur-2xl pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mb-4
                group-hover:scale-110 transition-all duration-300">
                <span className="text-xl">📡</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-ink group-hover:text-accent-green transition-colors duration-200">Daily Market Updates</h3>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green">FREE</span>
              </div>
              <p className="text-ink-muted text-sm leading-relaxed">AI-powered pre-market prediction + post-market analysis every trading day. Email &amp; Telegram.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.26} className="lg:col-span-2">
            <div className="glass rounded-xl p-6 h-full group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-500/5
              transition-all duration-300 cursor-default relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-500/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4
                    group-hover:scale-110 transition-all duration-300">
                    <span className="text-xl">🧮</span>
                  </div>
                  <h3 className="font-bold text-ink mb-2 group-hover:text-orange-400 transition-colors duration-200">Risk Calculator</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">Web portal — position size, risk per trade, R:R ratio. Free forever for customers.</p>
                </div>
                <div className="flex-shrink-0 self-center sm:self-start">
                  <div className="glass-light rounded-xl p-4 text-center min-w-[150px]">
                    <div className="text-2xl font-black text-gradient mb-1">∞</div>
                    <div className="text-[11px] text-ink-faint mb-3">Lifetime access</div>
                    {['Position sizing','R:R calculator','Risk % per trade'].map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-[10px] text-ink-muted mb-1">
                        <span className="w-1 h-1 rounded-full bg-accent-green flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>

        <FadeIn delay={0.36} className="mt-5 glass-light rounded-xl p-4 text-center">
          <p className="text-sm text-ink-muted">
            Works on <span className="text-ink font-medium">free TradingView</span> ·{' '}
            <span className="text-ink font-medium">Any timeframe</span> ·{' '}
            <span className="text-ink font-medium">Any symbol worldwide</span> ·{' '}
            <span className="text-ink font-medium">Instant delivery via email</span>
          </p>
        </FadeIn>

      </div>
    </section>
  )
}
