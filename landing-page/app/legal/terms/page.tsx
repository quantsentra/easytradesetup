import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" lede="Last updated: 2026-04-21" />
      <section className="bg-surface">
        <div className="container-wide py-16">
          <Prose>
            <h2>1. Acceptance</h2>
            <p>By accessing easytradesetup.com or purchasing Golden Indicator, you agree to these terms.</p>

            <h2>2. License</h2>
            <p>
              Your purchase grants you a personal, non-transferable license to use the Pine Script for your own trading.
              You may modify the script for personal use. You may not redistribute, resell, sublicense, or publish it,
              whether modified or not.
            </p>

            <h2>3. No investment advice</h2>
            <p>
              EasyTradeSetup sells software tools. It does not provide investment advice, trade signals, or portfolio
              management. Nothing on this site or in the product constitutes a recommendation to buy, sell, or hold any
              security.
            </p>

            <h2>4. No guarantees</h2>
            <p>
              Past performance is not indicative of future results. Trading carries substantial risk including loss of
              capital. You trade at your own risk.
            </p>

            <h2>5. Payment & refunds</h2>
            <p>
              Indian customers are billed in Indian Rupees (₹2,499) inclusive of GST. International customers are
              billed in US Dollars ($49). All applicable taxes are included in the displayed price. Refunds are
              subject to our <a href="/legal/refund">refund policy</a>.
            </p>

            <h2>6. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, EasyTradeSetup&apos;s total liability for any claim arising from your
              use of the product is limited to the amount you paid for it.
            </p>

            <h2>7. Governing law</h2>
            <p>
              These terms are governed by the laws of India, where EasyTradeSetup is based. Any dispute, regardless of
              user jurisdiction, is subject to the exclusive jurisdiction of courts in India. International users
              agreeing to these terms acknowledge this venue.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
