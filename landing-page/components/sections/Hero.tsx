import Link from "next/link";
import Price from "@/components/ui/Price";
import ChartMockup from "@/components/ui/ChartMockup";

const stats = [
  { k: "8",    v: "Built-in tools" },
  { k: "Any",  v: "Symbol / TF" },
  { k: "Once", v: "Pay & own" },
  { k: "∞",    v: "Lifetime" },
];

export default function Hero() {
  return (
    <section className="relative bg-page overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70"
        style={{
          background:
            "radial-gradient(1200px 400px at 50% 0%, rgba(0,113,227,0.08), transparent 60%)",
        }}
      />

      <div className="container-wide relative pt-12 sm:pt-16 md:pt-24 pb-10 sm:pb-14 md:pb-20 text-center">
        <p className="text-micro font-semibold text-blue-link uppercase tracking-wider">
          Golden Indicator
        </p>

        <h1 className="mt-3 sm:mt-4 h-hero max-w-[20ch] sm:max-w-3xl mx-auto">
          One indicator. Eight tools.<br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>Every market.
        </h1>

        <p className="mt-4 sm:mt-5 text-body-lg text-muted max-w-xl mx-auto px-2 sm:px-0">
          A proprietary TradingView Pine Script for global markets —
          equities, F&amp;O, commodities, forex, crypto. Any symbol. Any timeframe.
        </p>

        <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5 text-body">
          <Link
            href="/checkout"
            className="order-1 sm:order-2 inline-flex items-center justify-center rounded-lg bg-blue text-white px-5 py-2 text-body font-normal hover:brightness-110 transition-all w-full sm:w-auto"
          >
            <Price variant="cta" />
          </Link>
          <Link
            href="/product"
            className="order-2 sm:order-1 link-apple chevron"
          >
            Learn more
          </Link>
        </div>

        <p className="mt-3 text-caption text-muted-faint">
          One-time payment · Instant delivery · Educational tool, not investment advice
        </p>

        <div className="mt-10 sm:mt-14 md:mt-20 relative mx-auto max-w-[880px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 sm:-inset-10 rounded-[32px] opacity-60"
            style={{
              background:
                "radial-gradient(600px 200px at 50% 100%, rgba(0,113,227,0.18), transparent 70%)",
            }}
          />

          <ChartMockup />

          <p className="mt-3 text-micro text-muted-faint">
            Illustrative. Not a live feed. Not a trade recommendation.
          </p>
        </div>

        <dl className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule rounded-2xl overflow-hidden border border-rule max-w-2xl mx-auto">
          {stats.map(({ k, v }) => (
            <div key={v} className="bg-page px-3 sm:px-4 py-4 text-center">
              <dt className="sr-only">{v}</dt>
              <dd>
                <span className="block text-display-tile font-semibold text-ink">{k}</span>
                <span className="block mt-0.5 text-caption text-muted-faint">{v}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
