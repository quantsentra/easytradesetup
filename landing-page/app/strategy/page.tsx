import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { strategies } from "@/lib/strategies";

export const metadata: Metadata = {
  title: "Strategy Library",
  description: "Documented trading strategies that use Golden Indicator — opening range breakout, momentum, mean reversion.",
};

export default function StrategyIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Strategy Library"
        title={<>Setups, not signals.</>}
        lede="Three documented strategies that pair with Golden Indicator. Entry rules, exit rules, invalidation — written out, not hidden."
      />

      <section className="bg-surface">
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategies.map((s) => (
              <Link
                key={s.slug}
                href={`/strategy/${s.slug}`}
                className="card-apple p-10 flex flex-col group hover:bg-surface-alt transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-micro font-semibold text-blue-link uppercase tracking-wider">
                    {s.timeframe}
                  </span>
                  <span className="text-micro text-muted-faint">{s.risk} risk</span>
                </div>
                <h2 className="mt-6 h-tile">{s.name}</h2>
                <p className="mt-3 text-caption text-muted flex-1 leading-relaxed">{s.summary}</p>
                <div className="mt-8 hairline-t pt-5 text-caption text-muted-faint flex items-center justify-between">
                  <span>{s.market}</span>
                  <span className="link-apple chevron text-blue-link">Read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
