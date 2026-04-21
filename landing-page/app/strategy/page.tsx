import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
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
        title={<>Setups, not <span className="italic text-gold">signals</span>.</>}
        lede="Three documented strategies that pair with Golden Indicator. Entry rules, exit rules, invalidation — written out, not hidden."
      />

      <section className="container-x py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {strategies.map((s) => (
            <Link
              key={s.slug}
              href={`/strategy/${s.slug}`}
              className="group glass-card p-8 hover:border-gold/50 transition-colors flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="label-kicker">{s.timeframe}</span>
                <Badge tone={s.risk === "High" ? "default" : "gold"}>{s.risk} risk</Badge>
              </div>
              <h2 className="mt-5 font-display text-3xl group-hover:text-gold transition-colors">
                {s.name}
              </h2>
              <p className="mt-3 text-sm text-cream-muted leading-relaxed flex-1">{s.summary}</p>
              <div className="mt-6 pt-6 border-t border-ink-border font-mono text-xs text-cream-dim flex items-center justify-between">
                <span>{s.market}</span>
                <span className="group-hover:text-gold transition-colors">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
