'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const pains = [
  'You watch charts for hours but never know the right time to enter.',
  'You enter too early or too late and get stopped out every time.',
  "You've bought courses that gave theory but zero clear rules.",
  'You are profitable some weeks, then give it all back the next.',
]

export default function Pain() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 border-t border-border" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Sound Familiar?</h2>
          <p className="mt-3 text-ink-muted">Every F&amp;O trader has been here.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {pains.map((pain, i) => (
            <motion.div
              key={pain}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-3 items-start bg-bg-surface border border-border rounded-card p-5 hover:border-accent-red/30 transition-colors duration-200"
            >
              <span className="mt-0.5 text-accent-red font-bold text-lg leading-none flex-shrink-0">✕</span>
              <p className="text-ink-muted text-sm leading-relaxed">{pain}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-center text-base font-semibold text-ink"
        >
          You don&apos;t need more knowledge.{' '}
          <span className="text-accent-blue">You need a repeatable system.</span>
        </motion.p>
      </div>
    </section>
  )
}
