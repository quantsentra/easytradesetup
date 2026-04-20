'use client'
import { useState } from 'react'
import FadeIn from '../ui/FadeIn'

export default function LeadCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-20 border-b border-border relative overflow-hidden">
      {/* Background orb */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-green/[0.04] blur-[120px]" />
      </div>

      <div className="relative max-w-xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mx-auto mb-6
            hover:bg-accent-green/20 hover:scale-110 transition-all duration-300">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-accent-green">
              <path d="M4 4h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M2 6l9 7 9-7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Not Ready to Buy? Get the Free Checklist First.
          </h2>
          <p className="mt-3 text-ink-muted text-sm leading-relaxed">
            The same pre-trade checklist our customers use every morning.
            One PDF. Five checks. Under 60 seconds. Free forever.
          </p>

          {/* Social proof */}
          <div className="mt-4 inline-flex items-center gap-1.5 bg-bg-surface border border-border rounded-full px-4 py-1.5">
            <div className="flex -space-x-1">
              {['RM','DS','VT','AK'].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-accent-blue/20 border border-bg-primary flex items-center justify-center">
                  <span className="text-[8px] font-bold text-accent-blue">{i[0]}</span>
                </div>
              ))}
            </div>
            <span className="text-[11px] text-ink-muted">127+ traders downloaded this week</span>
          </div>

          {/* Form */}
          {status === 'done' ? (
            <div className="mt-8 bg-accent-green/10 border border-accent-green/20 rounded-2xl px-6 py-5">
              <div className="text-accent-green font-bold mb-1">✓ Check your inbox</div>
              <p className="text-sm text-ink-muted">The checklist is on its way to <span className="text-ink">{email}</span></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-bg-surface border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-faint
                  focus:outline-none focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/20 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-shrink-0 bg-accent-green text-black font-bold text-sm px-6 py-3 rounded-xl
                  hover:bg-accent-green/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-green/20
                  transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow-green"
              >
                {status === 'loading' ? 'Sending…' : 'Send it to me →'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-xs text-accent-red">Something went wrong. Email us at support@easytradesetup.com</p>
          )}

          <p className="mt-4 text-[11px] text-ink-faint">
            No spam. One email with your PDF. Unsubscribe anytime.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
