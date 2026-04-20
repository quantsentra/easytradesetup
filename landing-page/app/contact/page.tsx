import type { Metadata } from 'next'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Contact — EasyTradeSetup',
  description: 'Get in touch with EasyTradeSetup support.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-ink">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="text-3xl font-black tracking-tight mb-2">Contact Us</h1>
        <p className="text-ink-muted mb-12">We typically respond within 24–48 hours on business days.</p>

        <div className="space-y-6">
          <div className="rounded-card border border-border bg-bg-surface p-6">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Email Support</div>
            <a
              href="mailto:support@easytradesetup.com"
              className="text-accent-blue text-lg font-semibold hover:underline"
            >
              support@easytradesetup.com
            </a>
            <p className="text-ink-muted text-sm mt-2">
              For questions about your purchase, download issues, or strategy queries.
            </p>
          </div>

          <div className="rounded-card border border-border bg-bg-surface p-6">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Business</div>
            <p className="text-ink font-semibold">EasyTradeSetup</p>
            <p className="text-ink-muted text-sm mt-1">operated by Nextologic Solutions LLP</p>
            <p className="text-ink-muted text-sm">India</p>
          </div>

          <div className="rounded-card border border-border bg-bg-surface p-6">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-3">Support Hours</div>
            <div className="space-y-1 text-sm text-ink-muted">
              <div className="flex justify-between">
                <span>Monday – Friday</span>
                <span className="text-ink">10:00 AM – 6:00 PM IST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday – Sunday</span>
                <span className="text-ink">Closed</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-ink-faint">
          Trading involves risk. EasyTradeSetup provides educational tools only. Not SEBI-registered investment advice.
        </p>
      </div>
    </main>
  )
}
