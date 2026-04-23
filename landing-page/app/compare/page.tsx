import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Price from "@/components/ui/Price";

export const metadata: Metadata = {
  title: "Compare — Golden Indicator vs alternatives",
  description:
    "Side-by-side comparison of Golden Indicator against LuxAlgo, TrendSpider, and typical YouTuber-branded Pine Script bundles. Pricing, model, support, and claims compared.",
  alternates: { canonical: "/compare" },
};

type Row = {
  label: string;
  ets: string | boolean;
  lux: string | boolean;
  ts: string | boolean;
  yt: string | boolean;
};

const rows: Row[] = [
  { label: "Price on signup",        ets: "$49 · ₹4,599 (launch)", lux: "$39.99 / mo",  ts: "$58 / mo",     yt: "Free–₹5,000" },
  { label: "3-year cost",            ets: "$49 · ₹4,599 (flat)",   lux: "~$1,440",      ts: "~$2,088",      yt: "Varies heavily" },
  { label: "Billing model",          ets: "One-time · lifetime",   lux: "Monthly sub",  ts: "Monthly sub",  yt: "Sub or one-time" },
  { label: "Pine Script editable",   ets: true,                    lux: "Obfuscated",   ts: "N/A (SaaS)",   yt: "Sometimes" },
  { label: "Redistribution",         ets: "Personal use only",     lux: "Prohibited",   ts: "Prohibited",   yt: "Ambiguous" },
  { label: "Session + regime logic", ets: true,                    lux: true,           ts: true,           yt: "Rarely" },
  { label: "Repaint-safe signals",   ets: "Bar-close only",        lux: "Bar-close",    ts: "Bar-close",    yt: "Often repaints" },
  { label: "Daily market notes",     ets: "Included · multi-market", lux: false,        ts: false,          yt: "Often paywalled" },
  { label: "Risk calculator",        ets: true,                    lux: false,          ts: false,          yt: "Rarely" },
  { label: "Strategy PDF",           ets: true,                    lux: false,          ts: false,          yt: "Sometimes" },
  { label: "Founder accessible",     ets: "Direct email · 24h",    lux: "Ticket queue", ts: "Ticket queue", yt: "DM roulette" },
  { label: "Signals / trade calls",  ets: "No — tool only",        lux: "No",           ts: "No",           yt: "Often yes" },
  { label: "Fake performance claims",ets: "None",                  lux: "Restrained",   ts: "Restrained",   yt: "Common" },
  { label: "Refund window",          ets: "7 days · no questions", lux: "Pro-rated",    ts: "Pro-rated",    yt: "Usually none" },
];

const ETS_BG =
  "linear-gradient(180deg, rgba(43,123,255,0.18), rgba(34,211,238,0.08) 55%, rgba(240,192,90,0.06))";
const ETS_EDGE =
  "inset 1px 0 0 rgba(34,211,238,0.35), inset -1px 0 0 rgba(34,211,238,0.35)";
const ETS_EDGE_TOP =
  "inset 1px 0 0 rgba(34,211,238,0.35), inset -1px 0 0 rgba(34,211,238,0.35), inset 0 1px 0 rgba(34,211,238,0.45)";
const ETS_EDGE_BOTTOM =
  "inset 1px 0 0 rgba(34,211,238,0.35), inset -1px 0 0 rgba(34,211,238,0.35), inset 0 -1px 0 rgba(34,211,238,0.45)";

function EtsCell({
  children,
  position = "middle",
  className = "",
}: {
  children: React.ReactNode;
  position?: "top" | "middle" | "bottom";
  className?: string;
}) {
  const shadow =
    position === "top"
      ? ETS_EDGE_TOP
      : position === "bottom"
      ? ETS_EDGE_BOTTOM
      : ETS_EDGE;
  const radius =
    position === "top"
      ? { borderTopLeftRadius: 14, borderTopRightRadius: 14 }
      : position === "bottom"
      ? { borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }
      : {};
  return (
    <td
      className={`py-3.5 px-4 text-ink font-medium relative ${className}`}
      style={{ background: ETS_BG, boxShadow: shadow, ...radius }}
    >
      {children}
    </td>
  );
}

function Cell({ v, muted = false }: { v: string | boolean; muted?: boolean }) {
  const tone = muted ? "text-ink-40" : "text-ink-60";
  if (v === true) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium ${muted ? "text-ink-40" : "text-up"}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M2 7l3 3 7-7"
            stroke={muted ? "rgba(255,255,255,0.35)" : "#2DBE6D"}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Yes
      </span>
    );
  }
  if (v === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-ink-40">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path d="M3 3l8 8M11 3l-8 8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        No
      </span>
    );
  }
  return <span className={tone}>{v}</span>;
}

function EtsValue({ v }: { v: string | boolean }) {
  if (v === true) {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <defs>
            <linearGradient id="etsTick" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2B7BFF" />
              <stop offset="55%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#F0C05A" />
            </linearGradient>
          </defs>
          <path
            d="M2 7l3 3 7-7"
            stroke="url(#etsTick)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="grad-text not-italic">Yes</span>
      </span>
    );
  }
  if (v === false) {
    return <span className="text-ink-40">—</span>;
  }
  return <span className="text-ink">{v}</span>;
}

export default function ComparePage() {
  return (
    <>
      <PageHeader
        eyebrow="Compare"
        title={<>Side by side with <span className="grad-text-2">the alternatives.</span></>}
        lede="We respect the competition. Every row below is verifiable from public listings. If you spot an error, email hello@easytradesetup.com and we'll correct it."
      />

      <section className="above-bg">
        <div className="container-wide py-14 sm:py-20">
          <div className="overflow-x-auto -mx-4 sm:mx-0 pt-6 sm:pt-8">
            <table className="min-w-full text-caption border-separate" style={{ borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-ink-40 uppercase tracking-wider text-micro border-b border-rule">
                    What you get
                  </th>

                  <th
                    className="text-left py-4 px-4 relative"
                    style={{
                      background: ETS_BG,
                      boxShadow: ETS_EDGE_TOP,
                      borderTopLeftRadius: 14,
                      borderTopRightRadius: 14,
                    }}
                  >
                    <span
                      className="absolute left-1/2 -translate-x-1/2 -top-3.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-nano font-bold uppercase tracking-widest text-white whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, #2B7BFF, #22D3EE 55%, #F0C05A)",
                        boxShadow:
                          "0 0 0 1px rgba(5,7,15,0.6), 0 6px 18px -4px rgba(43,123,255,0.6)",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white motion-safe:animate-pulse" aria-hidden />
                      Recommended
                    </span>
                    <span className="font-display text-[15px] sm:text-[17px] font-semibold text-ink tracking-tight block">
                      EasyTradeSetup
                    </span>
                    <span className="block mt-0.5 font-mono text-nano uppercase tracking-widest grad-text not-italic">
                      Golden Indicator
                    </span>
                  </th>

                  <th className="text-left py-4 px-4 font-semibold text-ink-40 uppercase tracking-wider text-micro border-b border-rule">
                    LuxAlgo
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-ink-40 uppercase tracking-wider text-micro border-b border-rule">
                    TrendSpider
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-ink-40 uppercase tracking-wider text-micro border-b border-rule">
                    YouTuber script
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => {
                  const isLast = i === rows.length - 1;
                  return (
                    <tr key={r.label} className="align-top">
                      <td className="py-3.5 px-4 text-ink font-medium border-b border-rule">
                        {r.label}
                      </td>
                      <EtsCell position={isLast ? "bottom" : "middle"}>
                        <EtsValue v={r.ets} />
                      </EtsCell>
                      <td className="py-3.5 px-4 border-b border-rule">
                        <Cell v={r.lux} muted />
                      </td>
                      <td className="py-3.5 px-4 border-b border-rule">
                        <Cell v={r.ts} muted />
                      </td>
                      <td className="py-3.5 px-4 border-b border-rule">
                        <Cell v={r.yt} muted />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="glass-card-soft p-6 sm:p-8">
              <div className="text-micro font-semibold text-cyan uppercase tracking-wider">
                3-year cost delta
              </div>
              <div className="mt-3 h-card tabular-nums grad-text not-italic">
                Save $1,400–$2,000
              </div>
              <p className="mt-2 text-caption text-ink-60 leading-relaxed">
                Versus a typical $39-$58/month subscription over 36 months, at the inaugural launch price of{" "}
                <Price variant="amount" />.
              </p>
            </div>
            <div className="glass-card-soft p-6 sm:p-8">
              <div className="text-micro font-semibold text-cyan uppercase tracking-wider">
                Ownership model
              </div>
              <div className="mt-3 h-card">You own it. Forever.</div>
              <p className="mt-2 text-caption text-ink-60 leading-relaxed">
                No renewal emails. No retention dark patterns. No silent upgrade to a pricier tier. The Pine Script lives in
                your TradingView account.
              </p>
            </div>
            <div className="glass-card-soft p-6 sm:p-8">
              <div className="text-micro font-semibold text-cyan uppercase tracking-wider">
                What we don&apos;t do
              </div>
              <div className="mt-3 h-card">We don&apos;t sell calls.</div>
              <p className="mt-2 text-caption text-ink-60 leading-relaxed">
                If you want trade signals, this is not the right product. Golden Indicator is a chart-reading tool for
                people who want to do their own thinking.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/checkout" className="btn btn-primary btn-lg">
              Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link href="/sample" className="btn btn-outline btn-lg">
              Read free chapter first
            </Link>
          </div>
          <p className="mt-4 text-nano font-mono uppercase tracking-widest text-ink-40 text-center">
            7-day refund · Lifetime updates · No subscription
          </p>

          <p className="mt-12 text-nano text-ink-40 max-w-2xl mx-auto text-center leading-relaxed">
            Comparison reviewed 2026-04-22. Pricing from public web listings. Third-party names are trademarks of their
            respective owners and used here for comparison only — no affiliation, no endorsement.
          </p>
        </div>
      </section>
    </>
  );
}
