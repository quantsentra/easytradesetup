import Link from "next/link";
import Price from "@/components/ui/Price";
import ChartMockup from "@/components/ui/ChartMockup";

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

      <div className="container-wide relative pt-16 sm:pt-20 md:pt-28 pb-10 sm:pb-14 md:pb-20 text-center">
        <p className="text-micro font-semibold text-blue-link uppercase tracking-wider">
          Golden Indicator · TradingView
        </p>

        <h1 className="mt-4 sm:mt-5 h-hero max-w-[18ch] mx-auto">
          Trade with clarity.<br />Not noise.
        </h1>

        <p className="mt-5 sm:mt-6 text-body-lg text-muted max-w-[52ch] mx-auto px-2 sm:px-0">
          One intelligent indicator that replaces clutter, confusion, and guesswork —
          across every market.
        </p>

        <p className="mt-3 text-caption text-muted-soft max-w-[46ch] mx-auto">
          Built for traders who are tired of chasing signals and ready to understand price.
        </p>

        <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5 text-body">
          <Link
            href="/checkout"
            className="order-1 sm:order-2 inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body font-medium hover:brightness-110 transition-all w-full sm:w-auto"
          >
            <Price variant="cta" />
          </Link>
          <Link
            href="/product"
            className="order-2 sm:order-1 link-apple chevron"
          >
            See what&apos;s inside
          </Link>
        </div>

        <p className="mt-4 text-caption text-muted-faint">
          One-time payment · No subscriptions · Lifetime access
        </p>

        <div className="mt-12 sm:mt-16 md:mt-20 relative mx-auto max-w-[920px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 sm:-inset-10 rounded-[32px] opacity-60"
            style={{
              background:
                "radial-gradient(600px 200px at 50% 100%, rgba(0,113,227,0.16), transparent 70%)",
            }}
          />

          <ChartMockup />

          <p className="mt-4 text-micro text-muted-faint">
            Illustrative. Not a live feed. Not a trade recommendation.
          </p>
        </div>
      </div>
    </section>
  );
}
