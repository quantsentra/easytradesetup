import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Price from "@/components/ui/Price";

export const metadata: Metadata = {
  title: "Compare — Golden Indicator vs alternatives",
  description:
    "Side-by-side comparison of Golden Indicator against LuxAlgo, TrendSpider, and typical YouTuber-branded Pine Script bundles. Pricing, model, support, and claims compared.",
};

type Row = {
  label: string;
  ets: string | boolean;
  lux: string | boolean;
  ts: string | boolean;
  yt: string | boolean;
  note?: string;
};

const rows: Row[] = [
  { label: "Price on signup",     ets: "$49 · ₹4,599 (launch)", lux: "$39.99 / mo",    ts: "$58 / mo",      yt: "Free–₹5,000" },
  { label: "3-year cost",         ets: "$49 · ₹4,599 (flat)",   lux: "~$1,440",        ts: "~$2,088",       yt: "Varies heavily" },
  { label: "Billing model",       ets: "One-time · lifetime",    lux: "Monthly sub",    ts: "Monthly sub",   yt: "Sub or one-time" },
  { label: "Pine Script editable",ets: true,                     lux: "Obfuscated",     ts: "N/A (SaaS)",    yt: "Sometimes" },
  { label: "Redistribution",      ets: "Personal use only",      lux: "Prohibited",     ts: "Prohibited",    yt: "Ambiguous" },
  { label: "Session + regime logic", ets: true,                  lux: true,             ts: true,            yt: "Rarely" },
  { label: "Repaint-safe signals",ets: "Bar-close only",         lux: "Bar-close",      ts: "Bar-close",     yt: "Often repaints" },
  { label: "Daily market notes",  ets: "Included · multi-market",lux: false,            ts: false,           yt: "Often paywalled" },
  { label: "Risk calculator",     ets: true,                     lux: false,            ts: false,           yt: "Rarely" },
  { label: "Strategy PDF",        ets: true,                     lux: false,            ts: false,           yt: "Sometimes" },
  { label: "Founder accessible",  ets: "Direct email · 24h",     lux: "Ticket queue",   ts: "Ticket queue",  yt: "DM roulette" },
  { label: "Signals / trade calls", ets: "No — tool only",        lux: "No",             ts: "No",            yt: "Often yes" },
  { label: "Fake performance claims", ets: "None",               lux: "Restrained",     ts: "Restrained",    yt: "Common" },
  { label: "Refund window",       ets: "7 days · no questions",  lux: "Pro-rated",      ts: "Pro-rated",     yt: "Usually none" },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[#0a7a3a] font-medium">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path d="M2 7l3 3 7-7" stroke="#0a7a3a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Yes
      </span>
    );
  }
  if (v === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-faint">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path d="M3 3l8 8M11 3l-8 8" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        No
      </span>
    );
  }
  return <span>{v}</span>;
}

export default function ComparePage() {
  return (
    <>
      <PageHeader
        eyebrow="Compare"
        title={<>Side by side with the alternatives.</>}
        lede="We respect the competition. Every row below is verifiable from public listings. If you spot an error, email hello@easytradesetup.com and we'll correct it."
      />

      <section className="bg-surface">
        <div className="container-wide py-14 sm:py-20">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full text-caption">
              <thead className="sticky top-0 bg-surface">
                <tr className="hairline-b">
                  <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">
                    What you get
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-ink text-micro uppercase tracking-wider bg-blue/5">
                    EasyTradeSetup
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">
                    LuxAlgo
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">
                    TrendSpider
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">
                    Typical YouTuber script
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="hairline-b last:border-b-0 align-top">
                    <td className="py-3 px-4 text-ink font-medium">{r.label}</td>
                    <td className="py-3 px-4 bg-blue/5 text-ink">
                      <Cell v={r.ets} />
                    </td>
                    <td className="py-3 px-4 text-muted">
                      <Cell v={r.lux} />
                    </td>
                    <td className="py-3 px-4 text-muted">
                      <Cell v={r.ts} />
                    </td>
                    <td className="py-3 px-4 text-muted">
                      <Cell v={r.yt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-apple p-8">
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                3-year cost delta
              </div>
              <div className="mt-3 h-tile tabular-nums">
                Save ~$1,400–$2,000
              </div>
              <p className="mt-2 text-caption text-muted">
                Versus a typical $39-$58/month subscription over 36 months, at the inaugural launch price of{" "}
                <Price variant="amount" />.
              </p>
            </div>
            <div className="card-apple p-8">
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                Ownership model
              </div>
              <div className="mt-3 h-tile">You own it. Forever.</div>
              <p className="mt-2 text-caption text-muted">
                No renewal emails. No retention dark patterns. No silent upgrade to a pricier tier. The Pine Script lives in
                your TradingView account.
              </p>
            </div>
            <div className="card-apple p-8">
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                What we don&apos;t do
              </div>
              <div className="mt-3 h-tile">We don&apos;t sell calls.</div>
              <p className="mt-2 text-caption text-muted">
                If you want trade signals, this is not the right product. Golden Indicator is a chart-reading tool for
                people who want to do their own thinking.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body font-medium hover:brightness-110 transition-all"
            >
              Reserve at <span className="ml-1"><Price variant="amount" /></span>
            </Link>
            <p className="mt-3 text-caption text-muted-faint">
              7-day refund · Lifetime updates · No subscription
            </p>
          </div>

          <p className="mt-12 text-nano text-muted-faint max-w-2xl mx-auto text-center">
            Comparison reviewed 2026-04-22. Pricing from public web listings. Third-party names are trademarks of their
            respective owners and used here for comparison only — no affiliation, no endorsement.
          </p>
        </div>
      </section>
    </>
  );
}
