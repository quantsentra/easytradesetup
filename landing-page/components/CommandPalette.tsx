'use client'
import { useEffect, useState } from 'react'
import { Command } from 'cmdk'

const commands = [
  { label: 'Strategy',  href: '#strategy',  icon: '📈' },
  { label: 'Pricing',   href: '#pricing',   icon: '💰' },
  { label: 'FAQ',       href: '#faq',       icon: '❓' },
  { label: 'Buy Basic — ₹999',  href: 'https://quantsentra.gumroad.com/l/ets-basic',  icon: '🛒' },
  { label: 'Buy Pro — ₹1,999',  href: 'https://quantsentra.gumroad.com/l/ets-pro',    icon: '🛒' },
  { label: 'Buy Expert — ₹3,999', href: 'https://quantsentra.gumroad.com/l/ets-expert', icon: '🛒' },
  { label: 'Email Support', href: 'mailto:support@easytradesetup.com', icon: '✉️' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <Command>
          <Command.Input
            placeholder="Search or jump to…"
            className="w-full px-4 py-4 bg-transparent text-ink placeholder:text-ink-faint text-sm outline-none border-b border-border"
          />
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-ink-faint">
              No results found.
            </Command.Empty>
            {commands.map(({ label, href, icon }) => (
              <Command.Item
                key={label}
                onSelect={() => {
                  setOpen(false)
                  if (href.startsWith('#')) {
                    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    window.open(href, '_blank', 'noopener,noreferrer')
                  }
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-muted cursor-pointer hover:bg-bg-raised hover:text-ink transition-colors data-[selected=true]:bg-bg-raised data-[selected=true]:text-ink"
              >
                <span className="text-base">{icon}</span>
                {label}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
        <div className="px-4 py-2 border-t border-border flex items-center gap-3 text-xs text-ink-faint">
          <span><kbd className="px-1.5 py-0.5 rounded bg-bg-raised border border-border font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-bg-raised border border-border font-mono">↵</kbd> select</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-bg-raised border border-border font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
