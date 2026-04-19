import Button from '../ui/Button'

export default function FooterSection() {
  return (
    <>
      {/* Final CTA */}
      <section className="py-24 text-center bg-grid relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-blue/5 blur-[100px]" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Trade With a System?
          </h2>
          <p className="mt-4 text-ink-muted">
            Stop trading on gut feel. Get a setup that gives you a clear edge, every single day.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button href="#pricing" size="lg">Get the Pack — ₹999 →</Button>
            <Button href="#pricing" variant="secondary" size="lg">See All Tiers</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-bg-surface/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-faint">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center">
              <span className="text-accent-blue text-[10px] font-black">E</span>
            </div>
            <span>© 2025 EasyTradeSetup</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="mailto:support@easytradesetup.com" className="hover:text-ink-muted transition-colors">
              support@easytradesetup.com
            </a>
          </div>

          <p className="text-center sm:text-right max-w-xs">
            Trading involves risk. Not SEBI-registered advice. Past performance does not guarantee future results.
          </p>
        </div>
      </footer>
    </>
  )
}
