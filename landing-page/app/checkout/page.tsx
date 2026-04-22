import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Price from "@/components/ui/Price";
import { OFFER_LABEL } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Reserve early access",
  description:
    "Reserve your copy of Golden Indicator at the launch price. $49 / ₹4,599 inaugural — locked in when you join the list.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reserve early access"
        title={<>Lock in the launch price.</>}
        lede="We're in the final days before launch. Reserve your copy today and your email gets the purchase link at the inaugural price — before it moves to retail."
      />

      <section className="bg-surface">
        <div className="container-wide py-16">
          <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5" aria-hidden>
              <circle cx="12" cy="12" r="10" fill="none" stroke="#F59E0B" strokeWidth="1.8" />
              <path d="M12 8v5 M12 16h.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="text-caption leading-relaxed text-amber-200">
              <strong className="font-semibold">Educational tool, not investment advice.</strong> Golden Indicator is a
              chart tool, not a signal service. You decide every trade. Past performance does not guarantee future
              results. Trading in financial instruments involves substantial risk of loss. Indian users — we are not
              SEBI-registered. Read our full{" "}
              <Link href="/legal/disclaimer" className="underline">trading disclaimer</Link> before purchase.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 card-apple p-6 sm:p-8 md:p-10">
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                Step 1 · Reserve
              </div>
              <h2 className="mt-3 h-tile">Drop your email. Lock the launch price.</h2>
              <p className="mt-4 text-body text-muted leading-relaxed">
                Payments go live shortly. Reserving now guarantees you the inaugural price of{" "}
                <strong className="text-ink"><Price variant="amount" /></strong> (retail{" "}
                <span className="line-through decoration-muted-faint/60"><Price variant="retail" /></span>) and a priority
                email the moment checkout opens.
              </p>
              <form action="/api/lead" method="POST" className="mt-8 flex flex-col sm:flex-row gap-3">
                <input type="hidden" name="source" value="checkout" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="flex-1 bg-surface border border-rule rounded-lg px-4 py-3 text-body text-ink focus:outline-none focus:border-blue transition-colors"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body hover:brightness-110 transition-all"
                >
                  Reserve my copy
                </button>
              </form>
              <ul className="mt-6 space-y-2 text-caption text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-[#2da44e] mt-0.5">✓</span>
                  <span>One email when checkout opens. No drip sequence, no newsletter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2da44e] mt-0.5">✓</span>
                  <span>Price locked at reservation — even if we raise it before launch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2da44e] mt-0.5">✓</span>
                  <span>Unsubscribe with one click. We don&apos;t sell your email.</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 hairline-t">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider mb-4">
                  Payment methods on launch
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-caption text-muted">
                  <span className="inline-flex items-center gap-1.5"><span className="font-semibold text-ink">UPI</span></span>
                  <span className="inline-flex items-center gap-1.5"><span className="font-semibold text-ink">Razorpay</span></span>
                  <span className="inline-flex items-center gap-1.5"><span className="font-semibold text-ink">Visa · Mastercard</span></span>
                  <span className="inline-flex items-center gap-1.5"><span className="font-semibold text-ink">Net Banking</span></span>
                  <span className="inline-flex items-center gap-1.5"><span className="font-semibold text-ink">Stripe (Intl)</span></span>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-2 card-apple p-6 sm:p-8 md:p-10">
              <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Order preview</div>
              <div className="mt-6 pb-6 hairline-b">
                <div className="text-body text-ink font-medium">Golden Indicator · complete bundle</div>
                <div className="mt-1 text-caption text-muted">Lifetime access · one-time payment</div>
              </div>
              <div className="mt-6 flex items-baseline justify-between text-body">
                <span className="text-muted">Retail</span>
                <span className="tabular-nums text-muted-faint line-through decoration-muted-faint/60">
                  <Price variant="retail" />
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-body">
                <span className="text-muted">Offer applied</span>
                <span className="inline-flex items-center gap-1.5 bg-up/10 text-up px-2.5 py-0.5 rounded-full text-nano font-bold uppercase tracking-widest border border-up/30">
                  {OFFER_LABEL}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between text-body">
                <span className="text-muted">Taxes</span>
                <span className="tabular-nums text-ink">Included</span>
              </div>
              <div className="mt-6 pt-6 hairline-t flex items-baseline justify-between">
                <span className="h-card">Launch price</span>
                <span className="h-tile text-blue-link"><Price variant="amount" /></span>
              </div>

              <ul className="mt-6 pt-6 hairline-t space-y-2.5 text-caption text-muted">
                {[
                  "7-day no-questions refund",
                  "Lifetime updates included",
                  "One-time payment — no subscription",
                  "Priority email on launch day",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="mt-1 flex-shrink-0" aria-hidden>
                      <path d="M2 7l3 3 7-7" stroke="#2da44e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="mt-10 text-center">
            <Link href="/pricing" className="link-apple text-caption">
              ← See full pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
