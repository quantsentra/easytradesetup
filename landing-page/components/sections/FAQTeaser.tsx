import Link from "next/link";

// Exported so app/(marketing)/page.tsx can hand them to FAQPageJsonLd —
// avoids drift between visible FAQ list and the rich-result schema.
export const homeFaqs: Array<[string, string]> = [
  [
    "Will I be left to figure it out alone after I buy?",
    "No. The bundle includes an interactive indicator course inside your portal — eleven mobile-friendly lessons covering every line, zone, color, and signal on your chart, plus a knowledge quiz at the end. Progress saves locally. You finish the course, take the quiz, then trade with confidence. Built in. No upsell.",
  ],
  [
    "Why pay when free Pine scripts exist on TradingView?",
    "Free scripts are single-purpose — one MA, one oscillator, one pattern. Golden Indicator fuses market structure (BOS / CHoCH / HH-HL), regime bias, key levels (PDH / PDL / PWH / PWL), and supply / demand zones into one non-repainting engine. Plus an interactive course + quiz, the risk calculator, and lifetime updates. You're buying a system, not a plot.",
  ],
  [
    "Does it repaint? What about mid-bar signals?",
    "No repaint. Every signal, zone, and structural break is calculated on bar close only. What you see at close is what stays on the chart — forever.",
  ],
  [
    "Is this a signal service or a buy / sell bot?",
    "Neither. Golden Indicator is a chart tool. It draws the levels and structure; you decide the trade. No alerts to your phone, no copy-trading, no tips.",
  ],
  [
    "Which markets and timeframes are supported?",
    "Any symbol on TradingView, any timeframe. Tuned for NIFTY / BANKNIFTY weekly expiries, clean on SPX / NAS100, XAU / Silver / Crude, major forex, and BTC / ETH / SOL.",
  ],
  [
    "Will this work on my free TradingView plan?",
    "Yes. Pine Script v5 runs on every TradingView tier including the free plan. No upgrade needed.",
  ],
  [
    "What if the indicator does not work on my chart?",
    "Open a support ticket from the portal — a human replies within 24 hours and walks you through the install. The script is Pine v5 standard; if it doesn't render, it's a setup issue we can fix.",
  ],
  [
    "Will this guarantee profits?",
    "No. Nothing guarantees trading profits. Golden Indicator is a decision-support tool — clean regime read, key levels, momentum confirmation. Used with the interactive course, the knowledge quiz, and disciplined risk management, results compound over months. Not a profit machine. You decide every trade.",
  ],
];

// Back-compat local alias so the rest of this file reads naturally.
const faqs = homeFaqs;

export default function FAQTeaser() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10 md:gap-16 items-start">
          <div>
            <div className="eye mb-4">
              <span className="eye-dot" aria-hidden />Frequent questions
            </div>
            <h2 className="h-section">
              Questions before you <span className="grad-text-2">buy.</span>
            </h2>
            <p className="mt-5 body-muted">
              Still need more?{" "}
              <Link href="/contact" className="link-apple">
                Email us
              </Link>{" "}
              — we reply within 24 hours from a human.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {faqs.map(([q, a], i) => (
              <details
                key={i}
                className="group glass-card-soft transition-colors hover:border-rule-3 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 sm:px-6 py-5">
                  <span className="text-[15px] font-medium text-ink">{q}</span>
                  <span
                    aria-hidden
                    className="w-6 h-6 inline-flex items-center justify-center rounded-full border border-rule-2 text-ink-60 text-base transition-all group-open:text-white group-open:rotate-45 flex-none"
                  >
                    +
                  </span>
                </summary>
                <p className="px-5 sm:px-6 pb-5 text-caption text-ink-60 leading-relaxed">
                  {a}
                </p>
              </details>
            ))}

            <div className="mt-4">
              <Link href="/docs/faq" className="link-apple chevron text-caption">
                Read the full FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
