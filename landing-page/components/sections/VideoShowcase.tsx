'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

// Paste your YouTube video ID here once you have a demo video
const YOUTUBE_VIDEO_ID = ''

export default function VideoShowcase() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [playing, setPlaying] = useState(false)

  return (
    <section className="py-24 bg-bg-surface/40 border-b border-border overflow-hidden" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <span className="px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold uppercase tracking-widest">
            Strategy Walkthrough
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">Watch It Work</h2>
          <p className="mt-3 text-ink-muted max-w-md mx-auto">
            See a complete trade setup from signal to exit on a live BankNifty chart.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-card border border-border overflow-hidden bg-bg-surface aspect-video"
        >
          {YOUTUBE_VIDEO_ID && playing ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-bg-primary">
              {/* Decorative chart background */}
              <div className="absolute inset-0 opacity-5">
                <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
                  <polyline points="0,180 40,160 80,170 120,120 160,130 200,80 240,90 280,50 320,60 360,30 400,40"
                    fill="none" stroke="#58A6FF" strokeWidth="2" />
                  <polyline points="0,180 40,160 80,170 120,120 160,130 200,80 240,90 280,50 320,60 360,30 400,40"
                    fill="url(#grad)" stroke="none" />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#58A6FF" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#58A6FF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {YOUTUBE_VIDEO_ID ? (
                <button
                  onClick={() => setPlaying(true)}
                  className="relative w-16 h-16 rounded-full bg-accent-blue flex items-center justify-center shadow-glow hover:scale-105 transition-transform duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-black ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              ) : (
                <div className="relative text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-bg-raised border border-border flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7 text-ink-muted">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                  <p className="text-ink-muted text-sm">Demo video coming soon</p>
                  <p className="text-ink-faint text-xs mt-1">Paste your YouTube video ID in VideoShowcase.tsx</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
