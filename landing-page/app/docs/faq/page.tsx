import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  {
    cat: "Product",
    items: [
      ["Is this a signal service?", "No. Golden Indicator is a TradingView chart tool that helps you read regime, momentum, levels, and volume on one pane. You decide when to trade."],
      ["Can I modify the Pine Script?", "Yes. The script is delivered as open source. Modify it for personal use. Redistribution or resale is not permitted."],
      ["Does it work outside India?", "Yes. Symbol-agnostic. Tuned for NSE F&O but runs on US equities, commodities, forex, and major crypto pairs."],
      ["Will it work on my TradingView free plan?", "Yes. Pine Script runs on every TradingView tier."],
    ],
  },
  {
    cat: "Purchase & delivery",
    items: [
      ["How do I receive the files?", "By email, within seconds of payment. The email contains the .pine file, trade-logic PDF, and risk calculator link."],
      ["Do I need to enter card details every month?", "No. It's a one-time payment. No recurring charges, ever."],
      ["Is GST included in ₹2,499?", "Yes. Total price inclusive of taxes."],
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
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title={<>Asked. And <span className="italic text-gold">answered.</span></>}
        lede="If anything is missing, email hello@easytradesetup.com and we'll add it."
      />
      <section className="container-x py-16 space-y-16">
        {faqs.map((sec) => (
          <div key={sec.cat}>
            <div className="label-kicker mb-6">{sec.cat}</div>
            <div className="space-y-3">
              {sec.items.map(([q, a], i) => (
                <details
                  key={i}
                  className="group glass-card p-6 open:border-gold/40 transition-colors [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <span className="font-display text-xl">{q}</span>
                    <span className="mt-1 text-gold transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-cream-muted leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
