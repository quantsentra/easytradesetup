'use client'
import { useState, useEffect } from 'react'
import Button from './ui/Button'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-bg-primary/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center">
            <span className="text-accent-blue text-xs font-black">E</span>
          </div>
          <span className="font-bold text-ink tracking-tight">EasyTradeSetup</span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-sm text-ink-muted">
          <a href="#strategy" className="hover:text-ink transition-colors">Strategy</a>
          <a href="#pricing"  className="hover:text-ink transition-colors">Pricing</a>
          <a href="#faq"      className="hover:text-ink transition-colors">FAQ</a>
        </div>

        <Button href="#pricing" size="sm">
          Get the Pack →
        </Button>
      </div>
    </nav>
  )
}
