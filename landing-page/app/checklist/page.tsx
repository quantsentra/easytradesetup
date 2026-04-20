'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'

const CHECKS = [
  { id: 'gap',    label: 'Checked Gift Nifty / SGX cues',         detail: 'Global sentiment — bullish or bearish open?' },
  { id: 'levels', label: 'Marked key S/R levels on 15-min chart',  detail: 'Nearest support below, resistance above.' },
  { id: 'sl',     label: 'Pre-set SL and target before entering',   detail: 'Write it before you enter — not after.' },
  { id: 'max',    label: 'Set max loss for today',                  detail: 'If you hit it, stop trading. No debate.' },
  { id: 'ema',    label: 'Confirmed all 3 ETS conditions agree',    detail: 'EMA + Supertrend + RSI — all must align.' },
]

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const key = `ets-checklist-${getTodayKey()}`
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}')
      setChecked(saved)
    } catch { /* ignore */ }
  }, [])

  function toggle(id: string) {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem(`ets-checklist-${getTodayKey()}`, JSON.stringify(next))
      return next
    })
  }

  const doneCount = CHECKS.filter(c => checked[c.id]).length
  const allDone = doneCount === CHECKS.length

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg-primary text-ink pt-20 pb-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-10 pt-8">
            <div className="inline-flex items-center gap-2 bg-accent-green/10 border border-accent-green/20 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs font-medium text-accent-green">Resets daily at market open</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">ETS Pre-Trade Checklist</h1>
            <p className="mt-2 text-ink-muted text-sm">Run through this before every trade. Under 60 seconds.</p>
          </div>

          {/* Progress */}
          <div className="bg-bg-surface border border-border rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-widest">Today&apos;s progress</span>
              <span className="text-sm font-bold text-ink">{doneCount} / {CHECKS.length}</span>
            </div>
            <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-green rounded-full transition-all duration-500"
                style={{ width: `${(doneCount / CHECKS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Checks */}
          <div className="bg-bg-surface border border-border rounded-card overflow-hidden mb-6">
            {CHECKS.map(({ id, label, detail }, i) => (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={`w-full flex items-start gap-4 p-5 text-left transition-colors duration-150 hover:bg-bg-raised ${
                  i < CHECKS.length - 1 ? 'border-b border-border' : ''
                } ${checked[id] ? 'bg-accent-green/5' : ''}`}
              >
                {/* Checkbox */}
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  checked[id]
                    ? 'bg-accent-green border-accent-green'
                    : 'border-ink-faint'
                }`}>
                  {checked[id] && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-semibold transition-colors duration-200 ${
                    checked[id] ? 'text-ink-faint line-through' : 'text-ink'
                  }`}>{label}</div>
                  <div className="text-xs text-ink-faint mt-0.5 leading-relaxed">{detail}</div>
                </div>
              </button>
            ))}
          </div>

          {/* All done state */}
          {allDone && (
            <div className="bg-accent-green/10 border border-accent-green/25 rounded-2xl p-5 text-center mb-6 animate-fade-up">
              <div className="text-2xl mb-2">✓</div>
              <div className="font-bold text-accent-green mb-1">Ready to trade</div>
              <p className="text-sm text-ink-muted">All checks clear. Now wait for the signal — don&apos;t chase.</p>
            </div>
          )}

          {/* CTA */}
          <div className="bg-bg-surface border border-border rounded-2xl p-5 text-center">
            <p className="text-xs text-ink-faint mb-3 uppercase tracking-widest font-semibold">Want the full system?</p>
            <p className="text-sm text-ink-muted mb-4 leading-relaxed">
              The ETS pack includes the TradingView Pine Script that shows exactly when all 3 conditions align — so you never miss the signal.
            </p>
            <a
              href="/#pricing"
              className="inline-flex items-center justify-center gap-2 bg-accent-green text-black font-bold text-sm px-6 py-3 rounded-xl hover:bg-accent-green/90 transition-colors shadow-glow-green"
            >
              See the pack — from ₹999 →
            </a>
          </div>

          <p className="mt-6 text-center text-[11px] text-ink-faint">
            Bookmark this page for daily use · Resets at midnight IST
          </p>
        </div>
      </main>
    </>
  )
}
