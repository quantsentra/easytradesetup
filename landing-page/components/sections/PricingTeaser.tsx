import Button from "@/components/ui/Button";

export default function PricingTeaser() {
  return (
    <section className="container-x py-24 md:py-32">
      <div className="relative overflow-hidden rounded-3xl border border-ink-border bg-ink-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/15 via-transparent to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 p-10 md:p-16">
          <div className="md:col-span-3">
            <div className="label-kicker">One price · One SKU</div>
            <h2 className="mt-4 font-display text-display-lg text-balance">
              ₹2,499 <span className="italic text-gold">once.</span>
              <br />
              <span className="text-cream-muted">Yours forever.</span>
            </h2>
            <p className="mt-6 text-lg text-cream-muted max-w-md leading-relaxed">
              Pine script · Trade-logic PDF · Risk calculator · Daily market updates. Lifetime access.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="gold" size="lg" href="/checkout">
                Buy now <span aria-hidden>→</span>
              </Button>
              <Button variant="secondary" size="lg" href="/pricing">
                See what&apos;s included
              </Button>
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
            {[
              "TradingView Pine Script v5",
              "8 integrated tools",
              "Any symbol, any timeframe",
              "Trade logic PDF (50+ pages)",
              "Risk calculator (Google Sheets)",
              "Daily pre-market updates",
              "Lifetime updates included",
            ].map((f) => (
              <div key={f} className="flex items-start gap-3 text-sm">
                <span className="mt-1 text-gold">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
