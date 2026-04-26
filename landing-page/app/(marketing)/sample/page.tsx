import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { PageBreadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Free sample chapter — Golden Indicator Trade Logic PDF",
  description:
    "Free chapter from the Golden Indicator Trade Logic PDF — setup rules, entry logic, invalidation, R-multiple sizing. Ungated. No email required.",
  keywords: [
    "trading playbook PDF",
    "Pine Script trade logic",
    "NIFTY trading guide",
    "price action rules",
    "free sample chapter",
  ],
  alternates: { canonical: "/sample" },
  openGraph: {
    title: "Free Trade Logic sample chapter",
    description: "Setup rules, entry logic, invalidation — no email.",
    url: "https://www.easytradesetup.com/sample",
    type: "article",
  },
};

export default function SamplePage() {
  return (
    <>
      <PageBreadcrumbs name="Sample" path="/sample" />
      <PageHeader
        eyebrow="Free sample"
        title={<>A chapter from the playbook. No email required.</>}
        lede="This is one setup from the 50-page Trade Logic PDF shipped with Golden Indicator. Same format, same rigour — just ungated so you can judge the quality before you buy."
      />

      <section className="bg-surface">
        <div className="container-x py-14 sm:py-20">
          {/* Header block mimics the PDF page */}
          <article className="card-apple p-8 sm:p-10 md:p-14">
            <div className="flex items-center justify-between mb-8">
              <span className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                Chapter 4 · Sample
              </span>
              <span className="text-nano font-mono text-muted-faint">
                Trade Logic PDF · Excerpt
              </span>
            </div>

            <h2 className="font-display font-semibold text-[32px] sm:text-[40px] leading-[1.1] tracking-tight text-ink">
              The Opening Range Breakout — Nifty Futures
            </h2>
            <p className="mt-4 text-body text-muted leading-relaxed">
              A mechanical intraday setup for NSE Nifty futures. Works best during the
              first 90 minutes after the Indian market open (9:15–10:45 IST) when
              directional conviction is highest and expiry-gamma pressure is lowest.
            </p>

            <h3 className="mt-10 h-card">The setup in one sentence</h3>
            <p className="mt-2 text-body text-muted leading-relaxed">
              When Nifty futures close a 5-minute bar <strong className="text-ink">outside</strong>{" "}
              the high or low of the first 15-minute range (9:15-9:30 IST), and the
              Golden Indicator&apos;s regime filter agrees, we take the break with a
              range-width target and a stop at the opposite side of the range.
            </p>

            <h3 className="mt-10 h-card">Entry rules</h3>
            <ol className="mt-4 space-y-3 text-body text-muted">
              <li className="flex gap-3"><span className="flex-none w-6 text-blue-link font-mono">01</span><span>Mark the high and low of the 9:15-9:30 IST bars. This is the &ldquo;opening range&rdquo; (OR).</span></li>
              <li className="flex gap-3"><span className="flex-none w-6 text-blue-link font-mono">02</span><span>Wait for a 5-minute close outside the OR — long above OR high, short below OR low.</span></li>
              <li className="flex gap-3"><span className="flex-none w-6 text-blue-link font-mono">03</span><span>Confirm regime: Golden Indicator must show the matching direction. No counter-regime entries.</span></li>
              <li className="flex gap-3"><span className="flex-none w-6 text-blue-link font-mono">04</span><span>Enter on the open of the next bar. Do not chase within the confirmation bar.</span></li>
            </ol>

            <h3 className="mt-10 h-card">Exit rules</h3>
            <ul className="mt-4 space-y-3 text-body text-muted">
              <li className="flex gap-3"><span className="flex-none text-up mt-1">✓</span><span><strong className="text-ink">Target:</strong> project the range width in the direction of the break. OR width = 40 pts → target 40 pts from entry.</span></li>
              <li className="flex gap-3"><span className="flex-none text-up mt-1">✓</span><span><strong className="text-ink">Stop:</strong> opposite side of the opening range. Never inside the range.</span></li>
              <li className="flex gap-3"><span className="flex-none text-up mt-1">✓</span><span><strong className="text-ink">Time stop:</strong> square off by 15:15 IST regardless of PnL. This is an intraday setup; overnight exposure invalidates the edge.</span></li>
              <li className="flex gap-3"><span className="flex-none text-up mt-1">✓</span><span><strong className="text-ink">Scale-out option:</strong> take half at 0.7× range width, trail the remainder with a 1× ATR stop.</span></li>
            </ul>

            <h3 className="mt-10 h-card">Invalidation</h3>
            <p className="mt-2 text-body text-muted leading-relaxed">
              Re-entry back inside the opening range within two 5-minute bars after entry
              = false breakout. <strong className="text-ink">Exit flat immediately.</strong>{" "}
              Do not average. Do not flip. Record the outcome and stand aside until the
              next clean setup.
            </p>

            <h3 className="mt-10 h-card">Why this edge exists</h3>
            <p className="mt-2 text-body text-muted leading-relaxed">
              The first 15 minutes in Indian markets absorb the most overnight positioning
              and macro news flow. A clean break of that range on rising volume typically
              indicates that one side&apos;s stops are being run — and the resulting move
              is often directional for the first 60-90 minutes before expiry-hedging and
              profit-taking dampen momentum. The Golden Indicator&apos;s regime filter
              removes the biggest killer of this setup: range-bound chop days where the
              break fails within the hour.
            </p>

            <h3 className="mt-10 h-card">Risk framework</h3>
            <div className="mt-4 overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full text-caption">
                <thead>
                  <tr className="hairline-b">
                    <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">Parameter</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Risk per trade", "0.5% of account — hard cap"],
                    ["Max trades per day", "2 — one long attempt, one short attempt"],
                    ["Daily stop loss", "-1.5% — stop trading for the day"],
                    ["Reward/risk target", "≥ 1.5R on closed trades, net"],
                    ["Win rate expectation", "45-55% (edge is in the RR, not the hit rate)"],
                  ].map(([k, v]) => (
                    <tr key={k} className="hairline-b last:border-b-0">
                      <td className="py-3 px-4 text-ink font-medium">{k}</td>
                      <td className="py-3 px-4 text-muted">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-10 h-card">What the full PDF contains</h3>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-caption text-muted">
              <li>— 8 complete setups across intraday, swing, and positional</li>
              <li>— Multi-market variants: SPX, BankNifty, XAU, BTC</li>
              <li>— Session-timing and expiry-cycle playbooks</li>
              <li>— Position-sizing spreadsheet walkthrough</li>
              <li>— Journal template for self-review</li>
              <li>— Checklists for pre-trade and post-trade hygiene</li>
            </ul>

            <div className="mt-10 hairline-t pt-8 text-nano text-muted-faint leading-relaxed">
              <strong className="text-ink">Educational content. Not investment advice.</strong>{" "}
              No strategy wins every trade, and historical descriptions do not guarantee
              future results. Trading involves substantial risk of loss. See the full{" "}
              <Link href="/legal/disclaimer" className="link-apple">trading disclaimer</Link>.
            </div>
          </article>

          <div className="mt-12 card-white p-8 md:p-10 text-center">
            <h2 className="h-card">Like the format?</h2>
            <p className="mt-2 text-body text-muted">
              This is one of 8 full setups inside the Trade Logic PDF shipped with
              Golden Indicator.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body font-medium hover:brightness-110 transition-all"
              >
                Buy the full bundle
              </Link>
              <Link href="/compare" className="link-apple chevron">
                See how we compare
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
