import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure one-time payment for Golden Indicator.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title={<>One payment. Instant access.</>}
      />

      <section className="bg-surface">
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3 card-apple p-10">
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">Payment</div>
              <p className="mt-5 text-body text-muted leading-relaxed">
                Payment processing is not yet live. Reserve your copy below — you&apos;ll be notified the moment checkout
                opens, and get early-access pricing.
              </p>
              <form action="/api/lead" method="POST" className="mt-8 flex flex-col sm:flex-row gap-3">
                <input type="hidden" name="source" value="checkout" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="flex-1 bg-surface border border-rule rounded-lg px-4 py-3 text-body text-ink focus:outline-none focus:border-blue transition-colors"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body hover:brightness-110 transition-all"
                >
                  Reserve
                </button>
              </form>
              <p className="mt-4 text-micro text-muted-faint">
                We&apos;ll email once. No newsletter spam.
              </p>
            </div>

            <aside className="md:col-span-2 card-apple p-10">
              <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Order summary</div>
              <div className="mt-6 pb-6 hairline-b">
                <div className="text-body text-ink font-medium">Golden Indicator</div>
                <div className="mt-1 text-caption text-muted">Lifetime access</div>
              </div>
              <div className="mt-6 flex items-baseline justify-between text-body">
                <span className="text-muted">Subtotal</span>
                <span className="tabular-nums text-ink">₹2,499</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between text-body">
                <span className="text-muted">GST</span>
                <span className="tabular-nums text-ink">Included</span>
              </div>
              <div className="mt-6 pt-6 hairline-t flex items-baseline justify-between">
                <span className="h-card">Total</span>
                <span className="h-tile text-blue-link">₹2,499</span>
              </div>
            </aside>
          </div>

          <div className="mt-10 text-center">
            <Link href="/pricing" className="link-apple text-caption">
              ← Back to pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
