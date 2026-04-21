import Button from '../ui/Button'
import FadeIn from '../ui/FadeIn'

export default function FooterSection() {
  return (
    <>
      <section className="py-14 sm:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-50" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[600px] h-[600px] rounded-full bg-accent-blue/[0.06] blur-[120px] animate-float-slow" />
          </div>
        </div>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-accent-blue/70 mb-4">Get Started</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Trade<br />
              <span className="text-gradient">With a System?</span>
            </h2>
            <p className="mt-5 text-ink-muted text-lg">
              Stop trading on gut feel. Get a setup that gives you a clear edge, every single day.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button href="#pricing" size="lg" className="w-full sm:w-auto text-base sm:text-lg">
                Get the Golden Indicator — ₹2,499 →
              </Button>
              <Button href="/checklist" variant="secondary" size="lg" className="w-full sm:w-auto">
                Free Checklist First
              </Button>
            </div>
            <p className="mt-4 text-xs text-ink-faint">
              Instant delivery · One-time payment · Yours forever
            </p>
          </FadeIn>
        </div>
      </section>

      <footer className="border-t border-border py-8 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-faint">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-5 h-5 rounded-md bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center">
              <span className="text-accent-blue text-[10px] font-black">E</span>
            </div>
            <span>© 2026 EasyTradeSetup</span>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1">
            <a href="/checklist" className="hover:text-ink-muted transition-colors">Free Checklist</a>
            <a href="/strategy/ets-momentum" className="hover:text-ink-muted transition-colors">Strategy</a>
            <a href="/contact" className="hover:text-ink-muted transition-colors">Contact</a>
            <a href="/terms" className="hover:text-ink-muted transition-colors">Terms</a>
            <a href="/refund" className="hover:text-ink-muted transition-colors">Refund Policy</a>
            <a href="/delivery" className="hover:text-ink-muted transition-colors">Delivery Policy</a>
          </div>

          <p className="text-center sm:text-right max-w-xs">
            Trading involves risk. Not SEBI-registered advice. Past performance does not guarantee future results.
          </p>
        </div>
      </footer>
    </>
  )
}
