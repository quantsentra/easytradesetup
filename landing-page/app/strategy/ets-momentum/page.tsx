import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'ETS Momentum Setup — Nifty & BankNifty Intraday Strategy | EasyTradeSetup',
  description:
    'A 3-confirmation rule-based intraday system for Nifty & BankNifty. EMA + Supertrend + RSI. TradingView Pine Script + Strategy PDF. Starting ₹999.',
  alternates: { canonical: 'https://www.easytradesetup.com/strategy/ets-momentum' },
}

const forList = [
  'You trade Nifty or BankNifty intraday',
  'You use (or are open to) TradingView',
  'You want exact rules, not more theory',
  'You are on the 15-min or 5-min chart',
  'You struggle with inconsistent entries',
]

const notForList = [
  'You want a guaranteed profit system',
  'You scalp on 1-min or 3-min charts',
  'You trade stocks, crypto, or forex',
  'You want us to send you signals daily',
  'You are not willing to follow rules strictly',
]

const rules = [
  {
    num: '01',
    condition: 'EMA 9 must be ABOVE EMA 21',
    meaning: 'Market is in a bullish trend. Only take long trades.',
    color: 'accent-blue',
  },
  {
    num: '02',
    condition: 'Supertrend must flip GREEN',
    meaning: 'Entry timing confirmed. The trend has just shifted in your favour.',
    color: 'accent-green',
  },
  {
    num: '03',
    condition: 'RSI must be between 45 and 70',
    meaning: 'Momentum is healthy — not exhausted, not overextended.',
    color: 'accent-orange',
  },
]

const included = [
  { icon: '📘', name: 'Strategy PDF Guide', desc: '18+ pages. Entry rules, exit rules, chart examples, risk framework.' },
  { icon: '📊', name: 'Pine Script v5', desc: 'Copy, paste into TradingView. BUY/SELL labels appear immediately.' },
  { icon: '✅', name: 'Pre-Trade Checklist', desc: 'One page. 5 checks. Under 60 seconds every morning.' },
  { icon: '📋', name: 'Installation Guide', desc: 'Step-by-step: TradingView setup in under 5 minutes.' },
]

export default function ETSMomentumPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg-primary text-ink pt-16">

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          <nav className="text-xs text-ink-faint flex items-center gap-1.5">
            <a href="/" className="hover:text-ink transition-colors">Home</a>
            <span>/</span>
            <span className="text-ink-muted">ETS Momentum Setup</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="py-12 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full px-3 py-1 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue">ETS Basic Strategy</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08]">
                  ETS Momentum Setup
                </h1>
                <p className="mt-4 text-base text-ink-muted max-w-xl leading-relaxed">
                  A 3-confirmation intraday entry system for Nifty &amp; BankNifty. Rule-based. No interpretation.
                  All three indicators must agree before the script generates a BUY or SELL label.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Nifty & BankNifty','15-Min Chart','TradingView v5','Rule-Based','No Signal Service'].map(tag => (
                    <span key={tag} className="text-[11px] font-medium text-ink-faint bg-bg-surface border border-border rounded-full px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — sticky CTA card */}
              <div className="lg:sticky lg:top-24 bg-bg-surface border border-glow rounded-card p-6 shadow-glow">
                <div className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Basic Pack</div>
                <div className="text-4xl font-black text-ink mb-1">₹999</div>
                <div className="text-xs text-ink-faint mb-6">One-time · Instant delivery via email</div>
                <a
                  href="/#pricing"
                  className="block text-center py-3 px-6 rounded-xl font-bold text-sm bg-accent-green text-black hover:bg-accent-green/90 transition-colors shadow-glow-green mb-4"
                >
                  Get Notified When Live →
                </a>
                <ul className="space-y-2">
                  {included.map(({ icon, name }) => (
                    <li key={name} className="flex items-center gap-2 text-xs text-ink-muted">
                      <span>{icon}</span><span>{name}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[10px] text-ink-faint text-center">
                  Free TradingView account works · No subscription
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For / Not For */}
        <section className="py-16 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black tracking-tight mb-8">Is This For You?</h2>
            <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
              <div className="bg-accent-green/5 border border-accent-green/20 rounded-card p-6">
                <div className="text-xs font-bold text-accent-green uppercase tracking-widest mb-4">This IS for you if…</div>
                <ul className="space-y-3">
                  {forList.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span className="text-accent-green mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-ink-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-accent-red/5 border border-accent-red/20 rounded-card p-6">
                <div className="text-xs font-bold text-accent-red uppercase tracking-widest mb-4">This is NOT for you if…</div>
                <ul className="space-y-3">
                  {notForList.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span className="text-accent-red mt-0.5 flex-shrink-0 font-bold">✕</span>
                      <span className="text-ink-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The 3 Rules */}
        <section className="py-16 border-b border-border bg-bg-surface/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-black tracking-tight mb-2">The 3 Entry Rules — Exact</h2>
              <p className="text-ink-muted text-sm mb-8">
                All 3 must be true simultaneously. If even one fails, you skip the trade — no exceptions, no overrides.
              </p>
              <div className="space-y-4">
                {rules.map(({ num, condition, meaning, color }) => (
                  <div key={num} className={`flex gap-5 bg-bg-surface border border-${color}/20 rounded-card p-5`}>
                    <div className={`text-3xl font-black text-${color} opacity-30 leading-none flex-shrink-0 w-10`}>{num}</div>
                    <div>
                      <div className={`font-mono text-sm font-bold text-${color} mb-1`}>{condition}</div>
                      <div className="text-sm text-ink-muted leading-relaxed">{meaning}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Signal logic */}
              <div className="mt-6 bg-bg-surface border border-border rounded-card p-5">
                <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-semibold">Signal logic</p>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1.5 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/20">EMA 9 &gt; EMA 21</span>
                  <span className="text-ink-faint font-sans">+</span>
                  <span className="px-3 py-1.5 rounded-lg bg-accent-green/10 text-accent-green border border-accent-green/20">Supertrend GREEN</span>
                  <span className="text-ink-faint font-sans">+</span>
                  <span className="px-3 py-1.5 rounded-lg bg-accent-orange/10 text-accent-orange border border-accent-orange/20">RSI 45–70</span>
                  <span className="text-ink-faint font-sans">=</span>
                  <span className="px-4 py-1.5 rounded-lg bg-accent-green text-black font-bold">BUY ▲</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Management */}
        <section className="py-16 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-black tracking-tight mb-8">Risk Management Rules</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Stop Loss', value: '1 ATR below entry', note: 'Built into the Pine Script automatically' },
                  { label: 'Minimum Target', value: '1.5R', note: 'Risk ₹1 to make ₹1.50 — minimum' },
                  { label: 'Max Trades / Session', value: '1 trade', note: 'Quality over quantity. One clean setup.' },
                  { label: 'Best Sessions', value: '9:30–11:00 AM', note: 'Also 1:30–2:30 PM. Avoid 11–1 PM chop.' },
                ].map(({ label, value, note }) => (
                  <div key={label} className="bg-bg-surface border border-border rounded-card p-5">
                    <div className="text-[10px] font-bold text-ink-faint uppercase tracking-widest mb-1">{label}</div>
                    <div className="text-xl font-black text-ink mb-1">{value}</div>
                    <div className="text-xs text-ink-muted">{note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Realistic outcomes */}
        <section className="py-16 border-b border-border bg-bg-surface/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black tracking-tight mb-4">Realistic Expectations</h2>
              <div className="bg-bg-surface border border-border rounded-card p-6 space-y-4">
                <p className="text-sm text-ink-muted leading-relaxed">
                  <span className="text-ink font-semibold">This system will not make you profitable every day.</span>{' '}
                  No system does. Markets have losing days — that&apos;s normal.
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  What EasyTradeSetup gives you: <span className="text-ink">a consistent process you can repeat, measure, and improve.</span>{' '}
                  When you follow the same rules every day, you can track what&apos;s working and what isn&apos;t —
                  something impossible when you trade on gut feel.
                </p>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Our recommendation: trade it on paper for 2 weeks first. Log every signal. Measure your results
                  against the 3-confirmation rules. <span className="text-ink">Then trade with real capital when you trust the process.</span>
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-ink-faint">
                    EasyTradeSetup is an educational product. We are not SEBI-registered advisors.
                    Past performance does not guarantee future results. Trading involves significant financial risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black tracking-tight mb-8">Everything in the Pack</h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
              {included.map(({ icon, name, desc }) => (
                <div key={name} className="flex gap-4 bg-bg-surface border border-border rounded-card p-5 hover:border-accent-blue/30 transition-colors">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <div className="font-semibold text-ink text-sm">{name}</div>
                    <div className="text-ink-muted text-xs mt-1 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Ready to trade with a system?</h2>
            <p className="text-ink-muted text-sm mb-8">Get notified the moment payment goes live.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button href="/#pricing" size="lg">Get Notified — ₹999 →</Button>
              <Button href="/checklist" variant="secondary" size="lg">Try Free Checklist</Button>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
