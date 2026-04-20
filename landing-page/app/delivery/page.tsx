import type { Metadata } from 'next'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Delivery Policy — EasyTradeSetup',
  description: 'How EasyTradeSetup delivers digital products after purchase.',
}

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-ink">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="text-3xl font-black tracking-tight mb-2">Shipping &amp; Delivery Policy</h1>
        <p className="text-ink-faint text-sm mb-12">Last updated: April 2026</p>

        <div className="rounded-card border border-border bg-bg-surface p-8 space-y-8 text-sm text-ink-muted leading-relaxed">

          <div>
            <h2 className="text-base font-bold text-ink mb-3">Digital Delivery Only</h2>
            <p>
              EasyTradeSetup sells <strong className="text-ink">digital products only</strong>.
              There is no physical shipping. No physical goods are dispatched.
              All products (PDF strategy guides, Pine Script <code className="text-accent-blue bg-bg-raised px-1 rounded">.pine</code> files,
              Excel templates, checklists) are delivered electronically via email.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-ink mb-3">How Delivery Works</h2>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Complete payment',
                  desc: 'Pay via UPI, debit/credit card, or net banking on the checkout page.',
                },
                {
                  step: '2',
                  title: 'Instant confirmation',
                  desc: 'You receive a payment confirmation email at the address used during checkout.',
                },
                {
                  step: '3',
                  title: 'Download link delivered',
                  desc: 'A secure download link for your files is sent to the same email, typically within minutes.',
                },
                {
                  step: '4',
                  title: 'Access your files',
                  desc: 'Download the PDF guide and Pine Script files. Copy the script into TradingView and follow the setup guide.',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center flex-shrink-0 text-accent-blue font-bold text-xs">
                    {step}
                  </div>
                  <div>
                    <div className="font-semibold text-ink">{title}</div>
                    <div className="text-ink-muted mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-ink mb-3">Delivery Timeframe</h2>
            <p>
              Download links are delivered <strong className="text-ink">instantly</strong> upon payment
              confirmation, usually within 1–5 minutes. In rare cases it may take up to 1 hour due to
              payment processing delays.
            </p>
            <p className="mt-2">
              If you do not receive your files within 1 hour:
            </p>
            <ul className="mt-2 space-y-1">
              {[
                'Check your spam / junk folder.',
                'Ensure the email address used at checkout is correct.',
                'Contact us at support@easytradesetup.com with your order ID.',
              ].map((item) => (
                <li key={item} className="flex gap-2 items-start">
                  <span className="text-accent-orange flex-shrink-0 mt-0.5">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-ink mb-3">No Physical Shipping</h2>
            <p>
              We do not ship physical goods. Concepts like shipping charges, courier tracking, or
              delivery addresses do not apply to EasyTradeSetup products.
            </p>
          </div>

        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-accent-blue text-sm hover:underline">← Back to Home</a>
        </div>
      </div>
    </main>
  )
}
