'use client'
import { useState, useEffect } from 'react'
import { Drawer } from 'vaul'
import Button from './ui/Button'

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
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
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
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} className="hover:text-ink transition-colors">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button href="#pricing" size="sm" className="hidden sm:inline-flex">
              Get the Pack →
            </Button>
            <button
              onClick={() => setOpen(true)}
              className="sm:hidden flex flex-col gap-1.5 p-2"
              aria-label="Open menu"
            >
              <span className="w-5 h-px bg-ink block" />
              <span className="w-5 h-px bg-ink block" />
              <span className="w-3 h-px bg-ink block" />
            </button>
          </div>
        </div>
      </nav>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[20px] bg-bg-surface border-t border-border p-6 pb-10 outline-none">
            <div className="mx-auto w-12 h-1 rounded-full bg-border mb-8" />
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-3 px-4 rounded-xl text-ink font-medium hover:bg-bg-raised transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-6">
              <Button href="#pricing" size="lg" className="w-full text-center justify-center" onClick={() => setOpen(false)}>
                Get the Pack →
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  )
}
