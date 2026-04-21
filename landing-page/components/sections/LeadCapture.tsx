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
    <section className="py-20 sm:py-32 border-t border-line bg-subtle">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <div className="max-w-xl">
          <FadeIn>
            <span className="label">Free Resource</span>
            <h2 className="mt-3 text-2xl sm:text-[32px] font-black tracking-[-0.03em] text-ink">
              Not Ready to Buy?<br />
              Get the Free Checklist First.
            </h2>
            <p className="mt-3 text-[14px] text-ink-muted leading-[1.75]">
              The same pre-trade checklist our customers run every morning.
              Five checks. Under 60 seconds. Free forever.
            </p>

            {status === 'done' ? (
              <div className="mt-8 flex items-start gap-3 rounded-xl border border-up/20 bg-up/[0.05] px-6 py-5">
                <svg className="w-5 h-5 text-up flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 20 20">
                  <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-[14px] font-semibold text-ink">Check your inbox</p>
                  <p className="text-[13px] text-ink-muted mt-0.5">
                    Checklist on its way to <span className="text-ink">{email}</span>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-white border border-line-strong rounded-lg px-4 py-3 text-[14px] text-ink placeholder:text-ink-faint
                    focus:outline-none focus:ring-2 focus:ring-[#0D0D0D]/10 focus:border-[rgba(0,0,0,0.28)] transition-colors shadow-card font-mono"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex-shrink-0 bg-[#0D0D0D] text-white text-[13px] font-bold px-6 py-3 rounded-lg
                    hover:bg-[#2A2A2A] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending…' : 'Send it →'}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-3 text-[12px] font-mono text-down">
                Something went wrong. Email support@easytradesetup.com
              </p>
            )}

            <p className="mt-4 text-[11px] font-mono text-ink-faint">
              No spam. One email with your PDF. Unsubscribe anytime.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
