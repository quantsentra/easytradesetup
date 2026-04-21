import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { strategies, findStrategy } from "@/lib/strategies";

export const dynamicParams = false;

export function generateStaticParams() {
  return strategies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = findStrategy(slug);
  if (!s) return {};
  return { title: s.name, description: s.summary };
}

export default async function StrategyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = findStrategy(slug);
  if (!s) notFound();

  return (
    <article className="container-x pt-20 md:pt-28 pb-24">
      <div className="max-w-3xl">
        <Link href="/strategy" className="label-kicker link-underline">
          ← Strategy Library
        </Link>
        <h1 className="mt-6 font-display text-display-lg text-balance">{s.name}</h1>
        <p className="mt-6 text-lg text-cream-muted text-balance leading-relaxed">{s.summary}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Badge>{s.market}</Badge>
          <Badge>Timeframe · {s.timeframe}</Badge>
          <Badge tone="gold">{s.risk} risk</Badge>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="glass-card p-8">
          <div className="label-kicker text-signal-up">Entry</div>
          <ol className="mt-4 space-y-3 text-sm">
            {s.entry.map((e, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="glass-card p-8">
          <div className="label-kicker">Exit</div>
          <ol className="mt-4 space-y-3 text-sm">
            {s.exit.map((e, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="glass-card p-8">
          <div className="label-kicker text-signal-down">Invalidation</div>
          <p className="mt-4 text-sm leading-relaxed">{s.invalidation}</p>
          <div className="mt-8 pt-6 border-t border-ink-border">
            <div className="label-kicker">Edge</div>
            <p className="mt-2 text-sm text-cream-muted">{s.edge}</p>
          </div>
        </section>
      </div>

      <div className="mt-16 glass-card p-10 gold-border text-center">
        <h2 className="font-display text-3xl">Run this strategy on Golden Indicator.</h2>
        <p className="mt-3 text-cream-muted">All the filters this setup needs are built in.</p>
        <div className="mt-6">
          <Button variant="gold" size="lg" href="/checkout">
            Get it — ₹2,499
          </Button>
        </div>
      </div>
    </article>
  );
}
