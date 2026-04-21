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
      <div className="bg-white/96 backdrop-blur-md border-t border-line px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono text-ink-faint">Golden Indicator Pack</div>
          <div className="text-[13px] font-black text-ink font-mono">₹2,499 · One-time</div>
        </div>
        <a
          href="#pricing"
          className="flex-shrink-0 bg-[#0D0D0D] text-white text-[13px] font-bold px-5 py-2.5 rounded-lg hover:bg-[#2A2A2A] transition-colors duration-150"
        >
          Get Notified →
        </a>
      </div>
    </div>
  )
}
