'use client'
import { useState, useEffect } from 'react'

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.65)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-bg-surface/98 backdrop-blur-md border-t border-[rgba(255,255,255,0.08)] px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono text-ink-faint">Golden Indicator Pack</div>
          <div className="text-[13px] font-black text-ink font-mono">₹2,499 · One-time</div>
        </div>
        <a
          href="#pricing"
          className="flex-shrink-0 bg-gold text-black text-[13px] font-bold px-5 py-2.5 rounded-lg hover:bg-gold-light transition-colors duration-150"
        >
          Get Notified →
        </a>
      </div>
    </div>
  )
}
