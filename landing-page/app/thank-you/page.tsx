import type { Metadata } from 'next'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Thank You — EasyTradeSetup',
  description: 'Your purchase is confirmed.',
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-ink">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-32 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-accent-green/10 border border-accent-green/30 flex items-center justify-center mx-auto mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-10 h-10 text-accent-green">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
          Payment Confirmed!
        </h1>
        <p className="text-ink-muted text-lg mb-10">
          Your ETS pack is on its way. Check your inbox — the download link will arrive within a few minutes.
        </p>

        <div className="rounded-card border border-border bg-bg-surface p-8 text-left space-y-5 mb-10">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">What happens next</div>
          {[
            {
              step: '1',
              title: 'Check your email',
              desc: 'A download link has been sent to the email you used at checkout. Check your spam folder if you don\'t see it within 10 minutes.',
              color: 'text-accent-blue',
            },
            {
              step: '2',
              title: 'Download your files',
              desc: 'You\'ll receive your Pine Script (.pine), Strategy PDF, and Quick-Start Checklist. Save them somewhere safe.',
              color: 'text-accent-green',
            },
            {
              step: '3',
              title: 'Follow the installation guide',
              desc: 'The PDF includes step-by-step instructions to add the script to TradingView in under 5 minutes.',
              color: 'text-accent-orange',
            },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="flex gap-4">
              <div className={`w-7 h-7 rounded-full bg-bg-raised border border-border flex items-center justify-center flex-shrink-0 ${color} font-bold text-xs`}>
                {step}
              </div>
              <div>
                <div className="font-semibold text-ink text-sm">{title}</div>
                <div className="text-ink-muted text-sm mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-accent-blue/20 bg-accent-blue/5 p-5 text-sm text-ink-muted mb-10">
          <strong className="text-ink">Didn&apos;t receive your files?</strong>{' '}
          Email us at{' '}
          <a href="mailto:support@easytradesetup.com" className="text-accent-blue hover:underline">
            support@easytradesetup.com
          </a>{' '}
          with your order confirmation and we&apos;ll sort it out immediately.
        </div>

        <a
          href="/"
          className="inline-block text-ink-muted text-sm hover:text-ink transition-colors"
        >
          ← Back to Home
        </a>

        <p className="mt-12 text-xs text-ink-faint max-w-md mx-auto">
          Trading involves risk. EasyTradeSetup provides educational tools only. Not SEBI-registered investment advice. Past performance does not guarantee future results.
        </p>
      </div>
    </main>
  )
}
