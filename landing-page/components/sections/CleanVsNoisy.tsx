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
          <figure className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-rule">
              <span className="text-nano font-bold text-ink-40 uppercase tracking-widest">Before</span>
              <span className="text-nano text-ink-40 font-mono uppercase tracking-widest">
                XAU / USD · 15m · TradingView
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-bg-3">
              <Image
                src="/chart-before.png"
                alt="Gold Spot 15-minute chart without Golden Indicator — just candles, no structural context"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <figcaption className="px-5 py-4 text-caption text-ink-60 leading-relaxed border-t border-rule">
              Candles. Maybe a moving average. No market structure, no supply / demand, no clear context for where the market is in its own cycle.
            </figcaption>
          </figure>

          <figure className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-rule">
              <span className="text-nano font-bold text-cyan uppercase tracking-widest">After</span>
              <span className="text-nano text-ink-40 font-mono uppercase tracking-widest">
                XAU / USD · 15m · Golden Indicator
              </span>
            </div>
            <div className="relative aspect-[16/10] bg-bg-3">
              <Image
                src="/chart-after.png"
                alt="Same Gold Spot chart with Golden Indicator — regime lines, seller zones, swing structure, prior day high / low, and key levels annotated"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <figcaption className="px-5 py-4 text-caption text-ink-60 leading-relaxed border-t border-rule">
              Buyer and seller zones. Regime bias. Market structure (HH / HL / LL / LH). PDH / PDL / PWH / PWL. One pane. One read. One decision.
            </figcaption>
          </figure>
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
