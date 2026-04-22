import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { FAQPageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "FAQ",
  alternates: { canonical: "/docs/faq" },
};

const faqs = [
  {
    cat: "Product",
    items: [
      ["Is this a signal service?", "No. Golden Indicator is a TradingView chart tool that helps you read regime, momentum, levels, and volume on one pane. You decide when to trade."],
      ["Can I modify the Pine Script?", "Yes. The script is delivered as open source. Modify it for personal use. Redistribution or resale is not permitted."],
      ["Which markets does it work on?", "Symbol-agnostic. NSE F&O, US equities (SPX, NASDAQ, NYSE), commodities (Gold, Crude, Silver), major forex pairs, and major crypto pairs (BTC, ETH). Any symbol available on TradingView."],
      ["Will it work on my TradingView free plan?", "Yes. Pine Script runs on every TradingView tier."],
    ],
  },
  {
    cat: "Purchase & delivery",
    items: [
      ["How do I receive the files?", "By email, within seconds of payment. The email contains the .pine file, trade-logic PDF, and risk calculator link."],
      ["Do I need to enter card details every month?", "No. It's a one-time payment. No recurring charges, ever."],
      ["Are taxes included in the price?", "Yes. India: ₹2,499 inclusive of GST. International: $49 inclusive of applicable taxes."],
      ["Refund policy?", "7-day refund window if the script fails to install or doesn't function as documented. See refund policy."],
    ],
  },
  {
    cat: "Technical",
    items: [
      ["Does it repaint?", "The script uses bar-close confirmations. Live bars can shift while forming — this is normal Pine Script behavior. For signal fidelity, trigger alerts on bar close only."],
      ["What Pine Script version?", "v5 — the current supported version on TradingView."],
      ["Will you release updates?", "Yes. Every update is delivered free to existing customers. The version number bumps each time."],
    ],
  },
  {
    cat: "Legal",
    items: [
      ["Is this SEBI-registered advice?", "No. We do not provide investment advice. Golden Indicator is a charting tool. Read the full trading disclaimer."],
      ["Are you a registered research analyst?", "No. EasyTradeSetup sells software tools, not research. All educational content is for informational purposes only."],
    ],
  },
];

export default function FAQPage() {
  const flat = faqs.flatMap((sec) =>
    sec.items.map(([q, a]) => ({ q: String(q), a: String(a) }))
  );
  return (
    <>
      <FAQPageJsonLd faqs={flat} />
      <PageHeader
        eyebrow="FAQ"
        title={<>Asked. And answered.</>}
        lede="If anything is missing, email hello@easytradesetup.com and we'll add it."
      />
      <section className="bg-surface">
        <div className="container-x py-16 space-y-12">
          {faqs.map((sec) => (
            <div key={sec.cat}>
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider mb-4">
                {sec.cat}
              </div>
              <div className="card-apple p-2 md:p-3">
                {sec.items.map(([q, a], i) => (
                  <details
                    key={i}
                    className="group border-b border-rule last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5">
                      <span className="text-body text-ink font-medium">{q}</span>
                      <span className="text-blue-link text-[20px] leading-none transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="px-6 pb-6 text-caption text-muted leading-relaxed">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
