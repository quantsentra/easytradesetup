import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Pricing",
  description: "₹2,499 one-time. Lifetime access to Golden Indicator. No subscription, no tiers, no hidden costs.",
};

const included = [
  { title: "Pine Script v5", desc: "Open source, inspect and modify freely." },
  { title: "Trade Logic PDF", desc: "50-page playbook with setups, entry rules, risk parameters." },
  { title: "Risk Calculator", desc: "Google Sheet — position sizing and R-multiple tracker." },
  { title: "Daily Market Updates", desc: "Pre-market note covering Nifty bias, key levels, expiry gamma." },
  { title: "Lifetime Updates", desc: "Every future revision of the script delivered free." },
  { title: "Email Support", desc: "Direct-to-founder response within 24 hours." },
];

const notIncluded = [
  "Trading signals or tips",
  "Guaranteed returns",
  "Managed account service",
  "Telegram-style pump group",
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title={<>One price. <span className="italic text-gold">Forever.</span></>}
        lede="No tiers to compare. No upsells. No subscription that silently drains your account. Buy it once, own it forever."
      />

      <section className="container-x py-16 md:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-ink-border bg-ink-soft p-10 md:p-16 gold-border">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <div className="label-kicker">Lifetime access</div>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-[120px] leading-none text-gold">₹2,499</span>
              </div>
              <p className="mt-2 text-cream-dim font-mono text-sm">One-time · INR · incl. GST</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button variant="gold" size="lg" href="/checkout">
                  Buy now →
                </Button>
                <Button variant="secondary" size="lg" href="/contact">
                  Talk first
                </Button>
              </div>
              <p className="mt-6 text-xs font-mono text-cream-dim">
                Instant delivery via email. 7-day refund window.
              </p>
            </div>
            <div>
              <div className="label-kicker">What&apos;s included</div>
              <ul className="mt-5 space-y-4">
                {included.map((f) => (
                  <li key={f.title} className="flex items-start gap-3">
                    <span className="mt-1 text-gold">✓</span>
                    <div>
                      <div className="font-medium">{f.title}</div>
                      <div className="text-sm text-cream-muted">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8">
            <div className="label-kicker text-signal-up">You get</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {included.map((f) => (
                <li key={f.title} className="flex items-start gap-2.5">
                  <span className="text-signal-up">✓</span>
                  <span>{f.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-8">
            <div className="label-kicker text-signal-down">Not included</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {notIncluded.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-cream-muted">
                  <span className="text-signal-down">✕</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-cream-dim">
              EasyTradeSetup is an education and tooling company. We do not sell calls.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
