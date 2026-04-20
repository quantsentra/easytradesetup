'use client'
import { useState } from 'react'

type Tab = 'today' | 'yesterday' | 'archive'

const sampleUpdate = {
  date: 'Monday, 21 April 2025',
  symbol: 'NIFTY 50',
  preMarket: {
    time: '9:00 AM IST',
    view: 'Bullish bias. Price opened above CPR and Lifeline EMA. ADR upper band acting as first resistance at 22,450. Watching for momentum candle confirmation above 22,380 for long entries. R1 pivot at 22,510 is the first target.',
    chartLabel: 'Pre-Market Chart',
  },
  postMarket: {
    time: '3:45 PM IST',
    view: 'Pre-market view played out exactly. Momentum candle formed at 9:30 AM above 22,385. Price touched R1 at 22,510 by 11:15 AM. Afternoon session consolidated near TC pivot. Closed at 22,480 — strong bullish day. MTF daily high remains unbroken.',
    chartLabel: 'Post-Market Chart',
  },
  result: 'win' as const,
  move: '+95 pts',
}

function ChartPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative aspect-video rounded-xl border border-border bg-bg-raised flex items-center justify-center overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-green/5" />
      <div className="text-center z-10">
        <div className="text-3xl mb-2">📊</div>
        <div className="text-xs text-ink-faint">{label}</div>
        <div className="text-xs text-ink-faint/60 mt-1">Published daily at 9:00 AM &amp; 4:00 PM IST</div>
      </div>
      {/* Fake chart lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 225" preserveAspectRatio="none">
        <polyline points="0,180 40,160 80,150 120,130 160,120 200,100 240,90 280,70 320,80 360,60 400,50"
          fill="none" stroke="#6572f8" strokeWidth="2" />
        <polyline points="0,200 40,190 80,185 120,170 160,165 200,140 240,130 280,115 320,120 360,100 400,90"
          fill="none" stroke="#00d1b2" strokeWidth="1.5" strokeDasharray="4,4" />
      </svg>
    </div>
  )
}

function UpdateCard() {
  const u = sampleUpdate
  return (
    <div className="rounded-card border border-border bg-bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-bg-raised">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-ink-muted uppercase tracking-widest">{u.symbol}</span>
          <span className="text-xs text-ink-faint">{u.date}</span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          u.result === 'win' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-orange/10 text-accent-orange'
        }`}>
          {u.result === 'win' ? '✓' : '—'} {u.move}
        </span>
      </div>

      {/* Charts */}
      <div className="grid sm:grid-cols-2 gap-4 p-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent-blue" />
            <span className="text-xs font-semibold text-ink">Pre-Market View</span>
            <span className="text-xs text-ink-faint ml-auto">{u.preMarket.time}</span>
          </div>
          <ChartPlaceholder label={u.preMarket.chartLabel} />
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">{u.preMarket.view}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent-green" />
            <span className="text-xs font-semibold text-ink">Post-Market Analysis</span>
            <span className="text-xs text-ink-faint ml-auto">{u.postMarket.time}</span>
          </div>
          <ChartPlaceholder label={u.postMarket.chartLabel} />
          <p className="mt-3 text-sm text-ink-muted leading-relaxed">{u.postMarket.view}</p>
        </div>
      </div>
    </div>
  )
}

function ComingSoonCard() {
  return (
    <div className="rounded-card border border-border border-dashed bg-bg-surface/50 p-12 text-center">
      <div className="text-4xl mb-3">📡</div>
      <p className="font-semibold text-ink">Live updates start at launch</p>
      <p className="text-ink-muted text-sm mt-2 max-w-xs mx-auto">
        Every trading day we publish pre-market AI predictions and post-market analysis with real chart screenshots.
      </p>
      <a
        href="#pricing"
        className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-semibold hover:bg-accent-blue/20 transition-colors"
      >
        Get Notified at Launch →
      </a>
    </div>
  )
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'archive', label: 'Archive' },
]

export default function MarketUpdates() {
  const [active, setActive] = useState<Tab>('today')

  return (
    <section id="market-updates" className="py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent-green/10 border border-accent-green/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-xs text-accent-green font-medium">Free for all customers · Updated daily</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Daily Market Updates</h2>
          <p className="mt-3 text-ink-muted max-w-lg mx-auto">
            Every trading day — AI-powered pre-market prediction with chart screenshots and post-market analysis.
            Delivered to your email and Telegram. Included free, forever.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-bg-raised border border-border rounded-xl p-1 max-w-xs mx-auto mb-8">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                active === id
                  ? 'bg-bg-surface text-ink shadow-sm border border-border'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {active === 'today' && <UpdateCard />}
        {active === 'yesterday' && <ComingSoonCard />}
        {active === 'archive' && <ComingSoonCard />}

        <div className="mt-8 rounded-card border border-border bg-bg-surface/60 p-4 grid sm:grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-bold text-ink">Pre-Market</div>
            <div className="text-ink-muted text-xs mt-1">Published by 9:00 AM IST every trading day</div>
          </div>
          <div className="border-x border-border">
            <div className="font-bold text-ink">AI-Powered</div>
            <div className="text-ink-muted text-xs mt-1">GPT-4o analysis using the Golden Indicator</div>
          </div>
          <div>
            <div className="font-bold text-ink">Post-Market</div>
            <div className="text-ink-muted text-xs mt-1">Published by 4:00 PM IST with what happened</div>
          </div>
        </div>
      </div>
    </section>
  )
}
