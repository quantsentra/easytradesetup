import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure one-time payment for Golden Indicator.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title={<>One payment. <span className="italic text-gold">Instant access.</span></>}
      />

      <section className="container-x py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3 glass-card p-10">
            <div className="label-kicker">Payment</div>
            <p className="mt-6 text-cream-muted leading-relaxed">
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
                className="flex-1 bg-ink-soft border border-ink-border rounded-lg px-4 py-3 text-cream placeholder-cream-dim focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gold-gradient text-ink px-6 py-3 font-medium hover:brightness-110 transition-all"
              >
                Reserve — notify me →
              </button>
            </form>
            <p className="mt-4 text-xs font-mono text-cream-dim">
              We&apos;ll email once. No newsletter spam.
            </p>
          </div>

          <aside className="md:col-span-2 glass-card p-10 gold-border">
            <div className="label-kicker">Order summary</div>
            <div className="mt-6 pb-6 border-b border-ink-border">
              <div className="font-display text-xl">Golden Indicator</div>
              <div className="mt-1 text-sm text-cream-muted">Lifetime access</div>
            </div>
            <div className="mt-6 flex items-baseline justify-between">
              <span className="text-cream-muted">Subtotal</span>
              <span className="font-mono">₹2,499</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-cream-muted">GST</span>
              <span className="font-mono">Included</span>
            </div>
            <div className="mt-6 pt-6 border-t border-ink-border flex items-baseline justify-between">
              <span className="font-display text-xl">Total</span>
              <span className="font-display text-3xl text-gold">₹2,499</span>
            </div>
          </aside>
        </div>

        <div className="mt-10 text-center">
          <Button variant="ghost" size="sm" href="/pricing">
            ← Back to pricing
          </Button>
        </div>
      </section>
    </>
  );
}
