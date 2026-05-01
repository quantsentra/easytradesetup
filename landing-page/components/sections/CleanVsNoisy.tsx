import Image from "next/image";
import Link from "next/link";
import Price from "@/components/ui/Price";
import SectionHeader from "@/components/ui/SectionHeader";

export default function CleanVsNoisy() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="The problem"
          title={<>Most traders don&apos;t need more indicators. <span className="grad-text-2">They need a clearer read.</span></>}
          lede="Moving averages, RSI, volume, support / resistance, supply zones, session levels — all useful, but messy when scattered. Golden Indicator brings the important parts together so you can quickly see trend vs range, where the levels are, where buyers and sellers reacted, and where the risk lives."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <ChartFigure
            label="Before"
            labelTone="ink"
            meta="XAU / USD · 15m · TradingView"
            src="/chart-before.png"
            alt="Gold Spot 15-minute chart without Golden Indicator — just candles, no structural context"
            caption="Candles. Maybe a moving average. No market structure, no supply / demand, no clear context for where the market is in its own cycle."
          />
          <ChartFigure
            label="After"
            labelTone="cyan"
            meta="XAU / USD · 15m · Golden Indicator"
            src="/chart-after.png"
            alt="Same Gold Spot chart with Golden Indicator — regime lines, seller zones, swing structure, prior day high / low, and key levels annotated"
            caption="Buyer and seller zones. Regime bias. Market structure (HH / HL / LL / LH). PDH / PDL / PWH / PWL. One pane. One read. One decision."
          />
        </div>

        <p className="mt-8 sm:mt-10 text-center text-nano font-mono uppercase tracking-widest text-ink-40 max-w-2xl mx-auto">
          Real TradingView screenshots · Not more indicators — fewer decisions
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/checkout" className="btn btn-primary">
            Buy · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
          </Link>
          <Link href="/compare" className="btn btn-ghost">
            See how it compares
          </Link>
        </div>
      </div>
    </section>
  );
}

// Single chart card. Wraps the image in an <a target="_blank"> so any tap or
// click opens the raw PNG at native resolution — browser handles pinch-zoom
// (mobile) and click-zoom (desktop) for free, no JS / no client component.
// "Tap to zoom" pill is always visible because hover-only doesn't exist on touch.
function ChartFigure({
  label,
  labelTone,
  meta,
  src,
  alt,
  caption,
}: {
  label: string;
  labelTone: "ink" | "cyan";
  meta: string;
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-rule">
        <span
          className={`text-nano font-bold uppercase tracking-widest ${
            labelTone === "cyan" ? "text-cyan" : "text-ink-40"
          }`}
        >
          {label}
        </span>
        <span className="text-nano text-ink-40 font-mono uppercase tracking-widest">
          {meta}
        </span>
      </div>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${label.toLowerCase()} chart full size in new tab`}
        className="relative block aspect-[4/3] sm:aspect-[16/10] bg-bg-3 group"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
          priority={false}
        />
        <span
          aria-hidden
          className="absolute top-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-nano font-mono uppercase tracking-widest text-ink backdrop-blur-sm"
          style={{
            background: "rgba(5, 7, 15, 0.72)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </svg>
          <span className="hidden sm:inline">View full size</span>
          <span className="sm:hidden">Tap to zoom</span>
        </span>
      </a>
      <figcaption className="px-5 py-4 text-caption text-ink-60 leading-relaxed border-t border-rule">
        {caption}
      </figcaption>
    </figure>
  );
}
