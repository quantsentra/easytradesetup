import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { strategies } from "@/lib/strategies";

const featuredStrategy = strategies[0];

export default function Insights() {
  return (
    <section className="bg-page">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <SectionHeader
          eyebrow="Built in public"
          title={<>Work you can read — before you buy.</>}
          lede="Strategies, market notes, and a full feasibility report. Published openly, so you see the thinking before you trust the tool."
        />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Strategy card */}
          <Link
            href={`/strategy/${featuredStrategy.slug}`}
            className="card-white p-6 sm:p-8 flex flex-col group hover:bg-surface-alt transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                Strategy
              </span>
              <span className="text-nano font-mono text-muted-faint">
                {featuredStrategy.timeframe}
              </span>
            </div>
            <h3 className="mt-5 h-card">{featuredStrategy.name}</h3>
            <p className="mt-3 text-caption text-muted flex-1 leading-relaxed">
              {featuredStrategy.summary}
            </p>
            <div className="mt-6 pt-5 hairline-t flex items-center justify-between">
              <span className="text-nano text-muted-faint font-mono truncate">
                {featuredStrategy.market}
              </span>
              <span className="text-caption text-blue-link font-medium">Read →</span>
            </div>
          </Link>

          {/* Market note card */}
          <Link
            href="/updates"
            className="card-white p-6 sm:p-8 flex flex-col group hover:bg-surface-alt transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                Market note
              </span>
              <span className="text-nano font-mono text-muted-faint">Daily</span>
            </div>
            <h3 className="mt-5 h-card">NIFTY bias — structural bull above 24,600</h3>
            <p className="mt-3 text-caption text-muted flex-1 leading-relaxed">
              Opening range forming above yesterday&apos;s high. Watch 24,880 for breakout
              confirmation. Expiry gamma clusters at 24,800 and 24,900.
            </p>
            <div className="mt-6 pt-5 hairline-t flex items-center justify-between">
              <span className="text-nano text-muted-faint font-mono">India · US · Gold · BTC</span>
              <span className="text-caption text-blue-link font-medium">See all →</span>
            </div>
          </Link>

          {/* Compare card */}
          <Link
            href="/compare"
            className="card-white p-6 sm:p-8 flex flex-col group hover:bg-surface-alt transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                Compare
              </span>
              <span className="text-nano font-mono text-muted-faint">Honest</span>
            </div>
            <h3 className="mt-5 h-card">How we stack up against the alternatives.</h3>
            <p className="mt-3 text-caption text-muted flex-1 leading-relaxed">
              Side-by-side table vs LuxAlgo, TrendSpider, and typical YouTuber-branded
              scripts — pricing, model, support, and claims.
            </p>
            <div className="mt-6 pt-5 hairline-t flex items-center justify-between">
              <span className="text-nano text-muted-faint font-mono">3-year cost delta</span>
              <span className="text-caption text-blue-link font-medium">See table →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
