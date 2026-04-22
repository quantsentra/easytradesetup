import Image from "next/image";
import Link from "next/link";
import Price from "@/components/ui/Price";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";

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
        <div className="inline-flex items-center gap-2 rounded-full bg-blue/10 border border-blue/20 px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" aria-hidden />
          <span className="text-nano font-bold text-blue-link uppercase tracking-widest">
            {OFFER_LABEL} · {OFFER_TAGLINE}
          </span>
        </div>

        <p className="mt-4 text-micro font-semibold text-blue-link uppercase tracking-wider">
          Golden Indicator · TradingView
        </p>

        <h1 className="mt-3 sm:mt-4 h-hero max-w-[18ch] mx-auto">
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
          <span className="line-through decoration-muted-faint/60 mr-2"><Price variant="retail" /></span>
          <span className="text-ink font-medium"><Price variant="amount" /> inaugural</span>
          <span className="mx-2">·</span>
          One-time · Lifetime access
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-nano font-semibold uppercase tracking-widest text-muted-faint">
          <li className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
              <path d="M2 7l3 3 7-7" stroke="#0a7a3a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Built for TradingView
          </li>
          <li className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
              <path d="M2 7l3 3 7-7" stroke="#0a7a3a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            7-day refund
          </li>
          <li className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
              <path d="M2 7l3 3 7-7" stroke="#0a7a3a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            No subscription
          </li>
          <li className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
              <path d="M2 7l3 3 7-7" stroke="#0a7a3a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Built in India · Global markets
          </li>
        </ul>

        <div className="mt-12 sm:mt-16 md:mt-20 relative mx-auto max-w-[920px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 sm:-inset-10 rounded-[32px] opacity-60"
            style={{
              background:
                "radial-gradient(600px 200px at 50% 100%, rgba(0,113,227,0.16), transparent 70%)",
            }}
          />

          <figure className="relative rounded-[16px] sm:rounded-[22px] overflow-hidden bg-surface shadow-card">
            <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 sm:py-3 border-b border-rule">
              <div className="flex items-center gap-1.5 flex-shrink-0" aria-hidden>
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 text-nano sm:text-micro text-muted-faint truncate px-2 sm:px-3 font-mono text-center">
                XAU / USD · 15m · Golden Indicator
              </div>
              <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-surface-alt px-2 py-0.5 rounded-md border border-rule flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2da44e] animate-pulse" aria-hidden />
                <span className="text-nano font-bold text-[#2da44e] uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div className="relative aspect-[16/10] bg-surface-alt">
              <Image
                src="/chart-after.png"
                alt="Gold Spot 15-minute chart with Golden Indicator — regime lines, seller zones, swing structure, prior-day levels visible as a single clean overlay"
                fill
                sizes="(min-width: 920px) 920px, 100vw"
                className="object-cover"
                priority
                fetchPriority="high"
              />
            </div>
          </figure>

          <p className="mt-4 text-micro text-muted-faint">
            Real TradingView chart · Gold / USD 15m · Not a trade recommendation
          </p>
        </div>
      </div>
    </section>
  );
}
