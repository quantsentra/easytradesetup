'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const items = [
  {
    icon: '🥇',
    title: 'Golden Indicator Script',
    desc: 'Proprietary Pine Script v5. Copy, paste into TradingView — signals appear on your chart instantly. Works on any symbol, any timeframe.',
  },
  {
    icon: '📘',
    title: 'Trade Logic PDF',
    desc: 'The full strategy in writing — entry rules, exit rules, real chart examples, and risk management. Reference it any time.',
  },
  {
    icon: '📡',
    title: 'Daily Market Updates (Free)',
    desc: 'Every trading day: AI-powered pre-market prediction + post-market analysis with real chart screenshots. Delivered via email & Telegram.',
  },
  {
    icon: '🧮',
    title: 'Risk Calculator (Web Portal)',
    desc: 'Calculate position size, risk per trade, and R:R ratio. Web-based, always accessible, free forever for customers.',
  },
]

export default function Includes() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 border-b border-border" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Everything You Get</h2>
          <p className="mt-3 text-ink-muted">One pack. Script + strategy + daily updates + tools. No upsells.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {items.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-4 bg-bg-surface border border-border rounded-card p-5 hover:border-accent-blue/30 transition-colors duration-200"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
              <div>
                <div className="font-semibold text-ink">{title}</div>
                <div className="text-ink-muted text-sm mt-1 leading-relaxed">{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 rounded-card border border-border bg-bg-surface/60 p-4 text-center max-w-xl mx-auto"
        >
          <p className="text-sm text-ink-muted">
            Works on <span className="text-ink">free TradingView</span> ·
            <span className="text-ink"> Any timeframe</span> ·
            <span className="text-ink"> Any symbol worldwide</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
