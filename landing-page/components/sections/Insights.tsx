import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { strategies } from "@/lib/strategies";

const featuredStrategy = strategies[0];

export default function Insights() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="Built in public"
          title={<>Work you can read — <span className="grad-text-2">before you buy.</span></>}
          lede="Strategies, market notes, and an honest compare table. Published openly, so you see the thinking before you trust the tool."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Link
            href={`/strategy/${featuredStrategy.slug}`}
            className="glass-card-soft p-6 sm:p-8 flex flex-col group hover:border-rule-3 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="eye">
                <span className="eye-dot" aria-hidden />Strategy
              </span>
              <span className="font-mono text-nano uppercase tracking-widest text-ink-40">
                {featuredStrategy.timeframe}
              </span>
            </div>
            <h3 className="mt-5 h-card">{featuredStrategy.name}</h3>
            <p className="mt-3 text-caption text-ink-60 flex-1 leading-relaxed">
              {featuredStrategy.summary}
            </p>
            <div className="mt-6 pt-5 hairline-t flex items-center justify-between">
              <span className="font-mono text-nano uppercase tracking-widest text-ink-40 truncate">
                {featuredStrategy.market}
              </span>
              <span className="text-caption font-medium text-blue-soft">Read →</span>
            </div>
          </Link>

          <Link
            href="/updates"
            className="glass-card-soft p-6 sm:p-8 flex flex-col group hover:border-rule-3 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="eye">
                <span className="eye-dot" aria-hidden />Market note
              </span>
              <span className="font-mono text-nano uppercase tracking-widest text-ink-40">Daily</span>
            </div>
            <h3 className="mt-5 h-card">NIFTY bias — structural bull above 24,600</h3>
            <p className="mt-3 text-caption text-ink-60 flex-1 leading-relaxed">
              Opening range forming above yesterday&apos;s high. Watch 24,880 for breakout confirmation.
              Expiry gamma clusters at 24,800 and 24,900.
            </p>
            <div className="mt-6 pt-5 hairline-t flex items-center justify-between">
              <span className="font-mono text-nano uppercase tracking-widest text-ink-40">
                India · US · Gold · BTC
              </span>
              <span className="text-caption font-medium text-blue-soft">See all →</span>
            </div>
          </Link>

          <Link
            href="/compare"
            className="glass-card-soft p-6 sm:p-8 flex flex-col group hover:border-rule-3 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="eye">
                <span className="eye-dot" aria-hidden />Compare
              </span>
              <span className="font-mono text-nano uppercase tracking-widest text-ink-40">Honest</span>
            </div>
            <h3 className="mt-5 h-card">Save $1,400+ over 3 years.</h3>
            <p className="mt-3 text-caption text-ink-60 flex-1 leading-relaxed">
              Side-by-side vs LuxAlgo ($39/mo), TrendSpider ($58/mo), and typical YouTuber scripts.
              Pricing, model, support, claims — compared honestly.
            </p>
            <div className="mt-6 pt-5 hairline-t flex items-center justify-between">
              <span className="font-mono text-nano uppercase tracking-widest text-ink-40">
                One payment · forever
              </span>
              <span className="text-caption font-medium text-blue-soft">See table →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
