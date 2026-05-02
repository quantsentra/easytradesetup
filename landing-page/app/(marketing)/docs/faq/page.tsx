import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { FAQPageJsonLd, PageBreadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "FAQ — Golden Indicator questions answered",
  description:
    "Golden Indicator FAQ — repaint, signals, markets, timeframes, support. Everything traders ask before buying a TradingView Pine v5 indicator.",
  keywords: [
    "TradingView indicator FAQ",
    "Pine Script questions",
    "no repaint indicator",
    "Golden Indicator support",
    "NIFTY indicator FAQ",
  ],
  alternates: { canonical: "/docs/faq" },
  openGraph: {
    title: "FAQ — Golden Indicator",
    description: "Repaint, signals, markets, support — every question answered.",
    url: "https://www.easytradesetup.com/docs/faq",
    type: "article",
  },
};

const faqs = [
  {
    cat: "Product",
    items: [
      ["Will I be left to figure it out alone after I buy?", "No. The bundle includes an interactive indicator course inside your portal — eleven mobile-friendly lessons covering every line, zone, color, and signal on your chart, plus a knowledge quiz at the end. Progress saves locally. You finish the course, take the quiz, then trade with confidence. Built in. No upsell."],
      ["Is this a signal service?", "No. Golden Indicator is a TradingView chart tool that helps you read regime, momentum, levels, and volume on one pane. You decide when to trade."],
      ["Why pay when free Pine scripts exist on TradingView?", "Free scripts are usually single-purpose — one moving average, one oscillator, one pattern. Golden Indicator fuses regime, structure, levels, and volume into one decision layer, plus ships an interactive 11-lesson indicator course, a knowledge quiz, and the risk calculator — all inside your portal. You're paying for the full system, not just the code."],
      ["I already use MA + RSI + volume. Why add this?", "Then you already know the pain of switching between panes. Golden Indicator replaces that stack with one decision layer — regime-aware, session-aware, volatility-aware. Most users drop 3-5 indicators within a week of installing it."],
      ["Can I modify the Pine Script?", "Yes. The script is delivered as open source. Modify it for personal use. Redistribution or resale is not permitted."],
      ["Which markets does it work on?", "Symbol-agnostic. NSE F&O (NIFTY, BANKNIFTY), US equities (SPX, NASDAQ, NYSE), commodities (Gold, Crude, Silver), major forex pairs, and major crypto pairs (BTC, ETH). Any symbol available on TradingView."],
      ["Will it work on my TradingView free plan?", "Yes. Pine Script runs on every TradingView tier, including the free plan."],
    ],
  },
  {
    cat: "Purchase & delivery",
    items: [
      ["How do I receive everything?", "By email, within seconds of payment. The email contains your portal sign-in link — every component (the .pine source, the interactive course, the knowledge quiz, the risk calculator, and a one-time founder welcome note) lives inside your portal account."],
      ["Do I need to enter card details every month?", "No. It's a one-time payment. No recurring charges, ever."],
      ["Are there any extra charges at checkout?", "No. The displayed price is what you pay — ₹4,599 in India, $49 international. No taxes or fees added at checkout."],
      ["What if I have install or usage problems?", "Open a support ticket from your portal — portal.easytradesetup.com/portal/support. A human replies within 24h with a fix. The script is Pine v5 standard; if it does not render or behaves unexpectedly, we walk you through the resolution."],
      ["Is there a refund?", "All sales are final once portal access is unlocked — see returns policy. The product is a downloadable digital script; refunds turn it into a free trial. If the indicator genuinely cannot be made to work in your environment after a real support attempt, we refund in full. Trading-outcome dissatisfaction is not a refund situation."],
    ],
  },
  {
    cat: "Technical",
    items: [
      ["Does it repaint?", "The script uses bar-close confirmations. Live bars can shift while forming — this is normal Pine Script behavior. For signal fidelity, trigger alerts on bar close only."],
      ["What Pine Script version?", "v5 — the current supported version on TradingView."],
      ["Will you release updates?", "Yes. Every update is delivered free to existing customers. The version number bumps each time."],
      ["I see a runtime error RE10026 on a long-history chart — how do I fix it?", "RE10026 means TradingView's 5000-bar lookback window was exceeded by an older drawing. Three fixes that work: (1) Update to the latest Golden Indicator v5 from /portal/downloads — newer versions use time-based positioning that avoids the limit. (2) Click the indicator title → 'X' to remove → re-add to chart for a fresh evaluation. (3) Switch the chart to a higher timeframe (e.g. 5min instead of 1min) so fewer historical bars are loaded. The most common trigger is keeping a 1-minute chart open for many days."],
      ["Pine compile error 'transp argument value should be between 0 and 100' — what to do?", "Old Pine v4 used 8-digit hex like #RRGGBBAA. Pine v5 uses color.new(<color>, <transp 0-100>). Make sure you have the latest source from /portal/downloads — the released file uses Pine v5 syntax everywhere."],
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
      <PageBreadcrumbs name="FAQ" path="/docs/faq" />
      <PageHeader
        eyebrow="FAQ"
        title={<>Asked. And answered.</>}
        lede="If anything is missing, email welcome@easytradesetup.com and we'll add it."
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
