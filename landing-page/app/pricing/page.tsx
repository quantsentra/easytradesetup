import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

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
        title={<>One price. Forever.</>}
        lede="No tiers to compare. No upsells. No subscription that silently drains your account. Buy it once, own it forever."
      />

      <section className="bg-surface">
        <div className="container-wide py-16 md:py-20">
          <div className="card-apple p-10 md:p-16 max-w-[880px] mx-auto text-center">
            <p className="text-micro font-semibold text-blue-link uppercase tracking-wider">
              Lifetime access
            </p>
            <div className="mt-6 flex items-baseline justify-center gap-3">
              <span className="font-display font-semibold text-[96px] md:text-[120px] leading-none text-ink">₹2,499</span>
            </div>
            <p className="mt-2 text-caption text-muted-faint">One-time · INR · incl. GST</p>
            <div className="mt-10 flex flex-wrap justify-center gap-5">
              <Link href="/checkout" className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body">
                Buy ₹2,499
              </Link>
              <Link href="/contact" className="link-apple chevron">
                Talk first
              </Link>
            </div>
            <p className="mt-6 text-micro text-muted-faint">
              Instant delivery via email. 7-day refund window.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-page">
        <div className="container-wide py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-white p-10">
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">You get</div>
              <ul className="mt-5 space-y-4">
                {included.map((f) => (
                  <li key={f.title} className="flex items-start gap-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="mt-[6px] flex-none" aria-hidden>
                      <path d="M2 7l3 3 7-7" stroke="#0071e3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <div className="text-body text-ink font-medium">{f.title}</div>
                      <div className="text-caption text-muted">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-white p-10">
              <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Not included</div>
              <ul className="mt-5 space-y-3">
                {notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-body text-muted">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="mt-[7px] flex-none" aria-hidden>
                      <path d="M3 3l8 8M11 3l-8 8" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-caption text-muted-faint">
                EasyTradeSetup is an education and tooling company. We do not sell calls.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
