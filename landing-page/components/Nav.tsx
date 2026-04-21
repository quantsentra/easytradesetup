'use client'
import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'

const navLinks = [
  { href: '#strategy',       label: 'Indicator' },
  { href: '#market-updates', label: 'Market Updates' },
  { href: '#pricing',        label: 'Pricing' },
  { href: '/checklist',      label: 'Free Checklist' },
  { href: '#faq',            label: 'FAQ' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-base/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.07)]'
          : 'bg-transparent'
      }`}>
        <div className="max-w-5xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 rounded-md bg-gold/15 border border-gold/25 flex items-center justify-center">
              <span className="text-gold text-[10px] font-black">E</span>
            </div>
            <span className="font-semibold text-sm text-ink tracking-tight">EasyTradeSetup</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-[13px] text-ink-muted">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="hover:text-ink transition-colors duration-150 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-gold after:transition-all hover:after:w-full"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#pricing"
              className="hidden md:inline-flex items-center gap-1.5 bg-gold text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors duration-150 tracking-tight"
            >
              Get the Pack →
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-2 flex flex-col gap-[5px]"
              aria-label="Open menu"
            >
              <span className="w-5 h-[1.5px] bg-ink-muted block" />
              <span className="w-5 h-[1.5px] bg-ink-muted block" />
              <span className="w-3 h-[1.5px] bg-ink-muted block" />
            </button>
          </div>
        </div>
      </nav>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/70 z-50" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-bg-surface border-t border-[rgba(255,255,255,0.08)] p-6 pb-10 outline-none">
            <div className="mx-auto w-10 h-0.5 rounded-full bg-[rgba(255,255,255,0.1)] mb-8" />
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-3 px-3 rounded-lg text-ink text-sm hover:bg-bg-raised transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-6">
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-gold text-black font-bold py-3.5 rounded-xl hover:bg-gold-light transition-colors"
              >
                Get the Pack — ₹2,499 →
              </a>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
