import Link from "next/link";
import Price from "@/components/ui/Price";
import HeroChart from "@/components/ui/HeroChart";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";

export default function Hero() {
  return (
    <section className="relative above-bg">
      <div className="container-wide pt-14 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-28 text-center">
        <div
          className="inline-flex items-center gap-2.5 mb-7 rounded-full px-3 py-1.5"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(10px)",
          }}
        >
          <span
            className="text-nano font-bold uppercase tracking-widest text-white rounded-full px-2 py-0.5"
            style={{ background: "linear-gradient(135deg, #2B7BFF, #8B5CF6)" }}
          >
            {OFFER_LABEL}
          </span>
          <span className="text-caption text-ink-60">
            <Price variant="retail" />
            <span className="mx-1.5 text-ink-40">→</span>
            <Price variant="amount" />
            <span className="hidden sm:inline ml-2 text-ink-40">· {OFFER_TAGLINE}</span>
          </span>
        </div>

        <h1 className="h-hero max-w-[16ch] mx-auto">
          Trade with clarity.{" "}
          <br className="hidden sm:inline" />
          <span className="grad-text">Not noise.</span>
        </h1>

        <p className="mt-6 sm:mt-7 text-body-lg text-ink-60 max-w-[56ch] mx-auto px-2">
          One sealed TradingView indicator. Eight internal tools fuse into a single
          decision on your chart — across every market on earth.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
          <Link href="/checkout" className="btn btn-primary btn-lg w-full sm:w-auto">
            Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
          </Link>
          <Link href="/product" className="btn btn-outline btn-lg w-full sm:w-auto">
            See it on a live chart
          </Link>
        </div>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-nano font-mono uppercase tracking-widest text-ink-40">
          <li className="inline-flex items-center gap-1.5">
            <span className="text-cyan">✓</span>One-time payment
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="text-cyan">✓</span>Lifetime updates
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="text-cyan">✓</span>7-day refund
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="text-cyan">✓</span>Global markets
          </li>
        </ul>

        <div className="mt-14 sm:mt-16 md:mt-20 relative mx-auto max-w-[920px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 sm:-inset-10 rounded-[32px]"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, rgba(43,123,255,.45) 0%, transparent 70%)",
              filter: "blur(40px)",
              opacity: 0.6,
              zIndex: -1,
            }}
          />
          <HeroChart />
          <p className="mt-4 text-nano font-mono uppercase tracking-widest text-ink-40">
            Illustrative · Not live · Not a trade recommendation
          </p>
        </div>
      </div>
    </section>
  );
}
