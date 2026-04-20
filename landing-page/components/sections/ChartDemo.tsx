'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const candles = [
  { o: 60, h: 72, l: 55, c: 68, bull: true },
  { o: 68, h: 75, l: 64, c: 71, bull: true },
  { o: 71, h: 73, l: 62, c: 63, bull: false },
  { o: 63, h: 66, l: 57, c: 59, bull: false },
  { o: 59, h: 63, l: 55, c: 61, bull: true },
  { o: 61, h: 70, l: 59, c: 69, bull: true },
  { o: 69, h: 78, l: 67, c: 76, bull: true },  // BUY signal
  { o: 76, h: 82, l: 74, c: 80, bull: true },
  { o: 80, h: 85, l: 77, c: 83, bull: true },
  { o: 83, h: 86, l: 79, c: 81, bull: false },
  { o: 81, h: 83, l: 74, c: 75, bull: false },
  { o: 75, h: 77, l: 68, c: 70, bull: false }, // SELL signal
  { o: 70, h: 72, l: 63, c: 65, bull: false },
  { o: 65, h: 68, l: 61, c: 66, bull: true },
]

const MIN = 50, MAX = 90, RANGE = MAX - MIN

function scaleY(v: number, h: number) {
  return h - ((v - MIN) / RANGE) * h
}

const BUY_IDX = 6
const SELL_IDX = 11

export default function ChartDemo() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleCount(i)
      if (i >= candles.length) clearInterval(interval)
    }, 120)
    return () => clearInterval(interval)
  }, [inView])

  const W = 560, H = 140
  const candleW = 28, gap = 12
  const totalW = candles.length * (candleW + gap)
  const offsetX = (W - totalW) / 2

  return (
    <section className="py-14 sm:py-24 border-b border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
          ref={ref}
        >
          <span className="px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-semibold uppercase tracking-widest">
            Live Signal Demo
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
            See the System in Action
          </h2>
          <p className="mt-3 text-ink-muted max-w-md mx-auto">
            BUY and SELL labels appear automatically when all 3 indicators align.
          </p>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-card border border-border bg-bg-surface overflow-hidden"
        >
          {/* Chart header bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-ink-faint font-mono">BANKNIFTY · 15m · ETS Momentum v1.0</span>
            <span className="ml-auto text-xs text-accent-green font-mono">● LIVE</span>
          </div>

          <div className="px-4 py-6 overflow-x-auto">
            <svg width="100%" viewBox={`0 0 ${W} ${H + 60}`} className="min-w-[400px]">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const y = scaleY(MIN + t * RANGE, H)
                return (
                  <line key={t} x1={0} y1={y} x2={W} y2={y}
                    stroke="#30363D" strokeWidth={0.5} strokeDasharray="4 4" />
                )
              })}

              {/* EMA line (simplified) */}
              <polyline
                points={candles.slice(0, visibleCount).map((c, i) => {
                  const x = offsetX + i * (candleW + gap) + candleW / 2
                  const y = scaleY((c.o + c.c) / 2 + 3, H)
                  return `${x},${y}`
                }).join(' ')}
                fill="none" stroke="#58A6FF" strokeWidth={1.5} opacity={0.5}
              />

              {/* Candles */}
              {candles.slice(0, visibleCount).map((c, i) => {
                const x = offsetX + i * (candleW + gap)
                const cx = x + candleW / 2
                const top = scaleY(Math.max(c.o, c.c), H)
                const bot = scaleY(Math.min(c.o, c.c), H)
                const bodyH = Math.max(bot - top, 2)
                const wickTop = scaleY(c.h, H)
                const wickBot = scaleY(c.l, H)
                const col = c.bull ? '#00C853' : '#F44336'

                return (
                  <g key={i}>
                    <line x1={cx} y1={wickTop} x2={cx} y2={wickBot} stroke={col} strokeWidth={1.5} />
                    <rect x={x} y={top} width={candleW} height={bodyH} fill={col} rx={2} opacity={0.85} />
                  </g>
                )
              })}

              {/* BUY signal */}
              {visibleCount > BUY_IDX && (() => {
                const x = offsetX + BUY_IDX * (candleW + gap) + candleW / 2
                const y = scaleY(candles[BUY_IDX].l, H) + 18
                return (
                  <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, type: 'spring' }}>
                    <text x={x} y={y} textAnchor="middle" fontSize="9" fontWeight="bold"
                      fill="#00C853">▲ BUY</text>
                  </motion.g>
                )
              })()}

              {/* SELL signal */}
              {visibleCount > SELL_IDX && (() => {
                const x = offsetX + SELL_IDX * (candleW + gap) + candleW / 2
                const y = scaleY(candles[SELL_IDX].h, H) - 10
                return (
                  <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, type: 'spring' }}>
                    <text x={x} y={y} textAnchor="middle" fontSize="9" fontWeight="bold"
                      fill="#F44336">▼ SELL</text>
                  </motion.g>
                )
              })()}
            </svg>
          </div>

          {/* Indicator bar */}
          <div className="flex items-center gap-4 px-4 py-3 border-t border-border flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-ink-faint">
              <span className="w-3 h-0.5 bg-accent-blue/60 inline-block rounded" /> EMA 9/21
            </span>
            <span className="flex items-center gap-1.5 text-xs text-accent-green">
              <span className="w-2.5 h-2.5 rounded-sm bg-accent-green/20 border border-accent-green/40 inline-block" /> Supertrend GREEN
            </span>
            <span className="flex items-center gap-1.5 text-xs text-accent-orange">
              <span className="w-2.5 h-2.5 rounded-sm bg-accent-orange/20 border border-accent-orange/40 inline-block" /> RSI 45–70
            </span>
            <span className="ml-auto text-xs text-ink-faint font-mono">Simulated · Not financial advice</span>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '~65%', label: 'Signal Accuracy', color: 'text-accent-green' },
            { value: '1:1.5', label: 'Avg Risk:Reward', color: 'text-accent-blue' },
            { value: '15 min', label: 'Ideal Timeframe', color: 'text-accent-orange' },
            { value: '< 5 min', label: 'Setup Time', color: 'text-ink' },
          ].map(({ value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-card border border-border bg-bg-surface p-4 text-center"
            >
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-xs text-ink-muted mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
