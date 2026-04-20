'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    num: '01',
    title: 'Buy & Download',
    time: '2 minutes',
    desc: 'Complete payment once. Receive an email instantly with your Pine Script file, Strategy PDF, and Quick-Start Checklist.',
    detail: 'No waiting. No manual approval. Delivered automatically.',
    color: 'accent-blue',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Add to TradingView',
    time: '5 minutes',
    desc: 'Open TradingView (free account works). Copy the Pine Script, open the Pine Editor, paste and save. BUY/SELL labels appear on your chart immediately.',
    detail: 'Step-by-step install guide included in your pack.',
    color: 'accent-green',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M7 10l3 3 7-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Follow the Signal',
    time: 'Every trading day',
    desc: 'Before each trade, check 3 conditions. If EMA, Supertrend, and RSI all agree — take the trade. If any one fails — skip it. No exceptions.',
    detail: 'The checklist takes under 60 seconds to run.',
    color: 'accent-orange',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
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
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Up and Running in 10 Minutes</h2>
          <p className="mt-3 text-ink-muted max-w-md mx-auto">
            No complicated setup. No learning curve. If you can open TradingView, you can use this system today.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden sm:block absolute top-10 left-[calc(33.33%+12px)] right-[calc(33.33%+12px)] h-px bg-gradient-to-r from-accent-blue/30 via-accent-green/30 to-accent-orange/30" />

          {steps.map(({ num, title, time, desc, detail, color, icon }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-bg-surface border border-border rounded-card p-6 hover:border-border/80 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Step number bubble */}
              <div className={`absolute -top-3.5 left-6 w-7 h-7 rounded-full bg-bg-primary border border-${color}/40 flex items-center justify-center`}>
                <span className={`text-[10px] font-black text-${color}`}>{num}</span>
              </div>

              {/* Icon */}
              <div className={`text-${color} mb-5 mt-2`}>{icon}</div>

              {/* Content */}
              <div className={`text-[10px] font-bold uppercase tracking-widest text-${color} mb-1`}>{time}</div>
              <h3 className="text-lg font-black text-ink mb-3">{title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-3">{desc}</p>
              <p className={`text-xs text-${color} font-medium`}>{detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-bg-surface border border-border rounded-full px-5 py-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-sm text-ink-muted">Total setup time: <span className="text-ink font-semibold">under 10 minutes</span></span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
