import type { Metadata } from 'next'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy — EasyTradeSetup',
  description: 'Refund and cancellation policy for EasyTradeSetup digital products.',
}

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-ink">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="text-3xl font-black tracking-tight mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-ink-faint text-sm mb-12">Last updated: April 2026</p>

        <div className="rounded-card border border-border bg-bg-surface p-8 space-y-8 text-sm text-ink-muted leading-relaxed">

          <div>
            <h2 className="text-base font-bold text-ink mb-3">No Refund Policy</h2>
            <p>
              All sales of digital products on EasyTradeSetup are <strong className="text-ink">final and non-refundable</strong>.
              Because our products (PDF strategy guides, Pine Script files, checklists) are delivered
              electronically and are instantly accessible, we are unable to accept returns or issue refunds
              once the download link has been delivered.
            </p>
            <p className="mt-3">
              We encourage you to read the product description carefully before purchasing. If you have
              questions about what is included, email us at{' '}
              <a href="mailto:support@easytradesetup.com" className="text-accent-blue hover:underline">
                support@easytradesetup.com
              </a>{' '}
              before buying.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-ink mb-3">Exceptions</h2>
            <p>
              We will re-send or replace your files at no charge if:
            </p>
            <ul className="mt-2 space-y-1 list-none">
              {[
                'The download link sent to your email is broken or expired.',
                'The files are corrupted or incomplete.',
                'You were charged but did not receive a delivery email within 24 hours.',
              ].map((item) => (
                <li key={item} className="flex gap-2 items-start">
                  <span className="text-accent-green flex-shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              To raise an exception, email{' '}
              <a href="mailto:support@easytradesetup.com" className="text-accent-blue hover:underline">
                support@easytradesetup.com
              </a>{' '}
              within <strong className="text-ink">48 hours</strong> of purchase with your order confirmation.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-ink mb-3">Cancellations</h2>
            <p>
              EasyTradeSetup products are one-time purchases with no recurring subscription. There is
              nothing to cancel. Once you complete a purchase, you retain access to the files you
              downloaded permanently.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-ink mb-3">Contact</h2>
            <p>
              For any payment-related issues:{' '}
              <a href="mailto:support@easytradesetup.com" className="text-accent-blue hover:underline">
                support@easytradesetup.com
              </a>
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
