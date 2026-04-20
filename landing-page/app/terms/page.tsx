import type { Metadata } from 'next'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Terms & Conditions — EasyTradeSetup',
  description: 'Terms and conditions for using EasyTradeSetup products and services.',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-base font-bold text-ink mb-3">{title}</h2>
    <div className="text-ink-muted text-sm leading-relaxed space-y-3">{children}</div>
  </div>
)

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-ink">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-32">
        <h1 className="text-3xl font-black tracking-tight mb-2">Terms &amp; Conditions</h1>
        <p className="text-ink-faint text-sm mb-12">Last updated: April 2026</p>

        <div className="rounded-card border border-border bg-bg-surface p-8">
          <Section title="1. About Us">
            <p>
              EasyTradeSetup (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a brand operated by Nextologic Solutions LLP, India.
              We provide educational digital products for traders on Indian equity markets, including Pine Script
              indicators for TradingView and PDF strategy guides.
            </p>
            <p>
              Contact: <a href="mailto:support@easytradesetup.com" className="text-accent-blue hover:underline">support@easytradesetup.com</a>
            </p>
          </Section>

          <Section title="2. Nature of Products">
            <p>
              All products sold by EasyTradeSetup are <strong className="text-ink">educational digital goods</strong>.
              They are designed to help traders understand systematic approaches to intraday trading.
              They do not constitute financial advice, investment recommendations, or SEBI-registered
              advisory services.
            </p>
            <p>
              <strong className="text-ink">EasyTradeSetup is not a SEBI-registered investment adviser.</strong>{' '}
              Trading in equity, F&amp;O, and derivatives involves significant financial risk. Past performance
              shown in strategy materials does not guarantee future results. You are solely responsible for
              your trading decisions.
            </p>
          </Section>

          <Section title="3. Eligibility">
            <p>
              By purchasing, you confirm that you are 18 years of age or older, legally capable of entering
              into contracts under Indian law, and purchasing for personal educational use only.
            </p>
          </Section>

          <Section title="4. Payment and Delivery">
            <p>
              All prices are in Indian Rupees (INR). Payment is one-time and non-recurring. Upon successful
              payment, product files (PDF guides and Pine Script files) are delivered to your registered
              email address instantly or within a reasonable time.
            </p>
            <p>
              If you do not receive your files within 1 hour of payment, please check your spam folder and
              contact us at support@easytradesetup.com.
            </p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>
              All strategy guides, Pine Script code, checklists, and other materials are the intellectual
              property of EasyTradeSetup / Nextologic Solutions LLP. Your purchase grants you a
              <strong className="text-ink"> personal, non-transferable licence</strong> to use the materials.
            </p>
            <p>
              You may not redistribute, resell, share, copy, or publish any part of the purchased materials
              without prior written consent. Violation may result in legal action under Indian copyright law.
            </p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>
              EasyTradeSetup shall not be liable for any trading losses, financial damages, or consequential
              losses arising from the use of our products. The maximum liability in any case shall not exceed
              the amount paid for the product.
            </p>
          </Section>

          <Section title="7. Governing Law">
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of the courts in India.
            </p>
          </Section>

          <Section title="8. Changes to Terms">
            <p>
              We reserve the right to modify these terms at any time. Continued use of our products after
              changes constitutes acceptance of the updated terms.
            </p>
          </Section>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-accent-blue text-sm hover:underline">← Back to Home</a>
        </div>
      </div>
    </main>
  )
}
