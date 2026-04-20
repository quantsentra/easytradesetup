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
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <div className="bg-bg-primary/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-ink-faint truncate">ETS Intraday Momentum Pack</div>
          <div className="text-sm font-black text-ink">from ₹999</div>
        </div>
        <a
          href="#pricing"
          className="flex-shrink-0 bg-accent-green text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-accent-green/90 transition-colors duration-200"
        >
          Get Notified →
        </a>
      </div>
    </div>
  )
}
