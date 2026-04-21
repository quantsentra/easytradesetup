import FadeIn from '../ui/FadeIn'

export default function FooterSection() {
  return (
    <>
      {/* Pre-footer CTA */}
      <section className="py-20 sm:py-32 border-t border-[rgba(255,255,255,0.07)] bg-grid">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <FadeIn>
            <div className="max-w-xl">
              <span className="label text-ink-faint">Get Started</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-[-0.03em] leading-tight">
                Ready to Trade<br />With a System?
              </h2>
              <p className="mt-4 text-[15px] text-ink-muted leading-[1.7]">
                Stop trading on gut feel. Get a setup that gives you a clear edge, every single day.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 bg-gold text-black font-bold text-[15px] px-7 py-3.5 rounded-xl hover:bg-gold-light transition-colors duration-150 tracking-tight"
                >
                  Get the Golden Indicator — ₹2,499 →
                </a>
                <a
                  href="/checklist"
                  className="inline-flex items-center gap-2 text-ink-muted text-[14px] px-5 py-3.5 hover:text-ink transition-colors duration-150"
                >
                  Free Checklist First →
                </a>
              </div>
              <p className="mt-3 text-[11px] font-mono text-ink-faint">
                Instant delivery · One-time payment · Yours forever
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.07)] py-8">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-[12px] text-ink-faint">

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-5 h-5 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center">
              <span className="text-gold text-[9px] font-black">E</span>
            </div>
            <span className="font-mono">© 2026 EasyTradeSetup</span>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-1.5">
            {[
              { href: '/checklist',          label: 'Free Checklist' },
              { href: '/strategy/ets-momentum', label: 'Strategy' },
              { href: '/contact',            label: 'Contact' },
              { href: '/terms',              label: 'Terms' },
              { href: '/refund',             label: 'Refund Policy' },
              { href: '/delivery',           label: 'Delivery Policy' },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="hover:text-ink-muted transition-colors font-mono">
                {label}
              </a>
            ))}
          </nav>

          <p className="font-mono text-[11px] max-w-[240px] text-right hidden sm:block">
            Trading involves risk. Not SEBI-registered advice.
          </p>
        </div>
      </footer>
    </>
  )
}
