import Image from "next/image";
import Link from "next/link";
import Price from "@/components/ui/Price";
import SectionHeader from "@/components/ui/SectionHeader";

export default function CleanVsNoisy() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="The difference"
          title={<>The same chart. <span className="grad-text-2">Two very different traders.</span></>}
          lede="The problem was never the market. It was everything you stacked on top of it — or didn't."
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
              A price chart by itself. Candles, maybe a trend — but no structure, no zones, no way to read where real buyers and sellers stepped in.
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
              Same chart. Seller zones, regime curves, swing structure (HH / LH / LL), prior-day levels — all drawn for you. One indicator. One clean read.
            </figcaption>
          </figure>
        </div>

        <p className="mt-8 sm:mt-10 text-center text-nano font-mono uppercase tracking-widest text-ink-40 max-w-2xl mx-auto">
          Real TradingView screenshots · Not more information — clearer thinking
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/checkout" className="btn btn-primary">
            Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
          </Link>
          <Link href="/compare" className="btn btn-ghost">
            See how it compares
          </Link>
        </div>
      </div>
    </section>
  );
}
