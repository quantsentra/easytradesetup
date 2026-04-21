import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Price from "@/components/ui/Price";
import { strategies, findStrategy } from "@/lib/strategies";
import { OFFER_LABEL, OFFER_TAGLINE } from "@/lib/pricing";

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
    <>
      <section className="bg-page hairline-b">
        <div className="container-wide pt-20 md:pt-28 pb-14 text-center max-w-[780px] mx-auto">
          <Link href="/strategy" className="link-apple text-caption">
            ← Strategy Library
          </Link>
          <h1 className="mt-6 h-hero">{s.name}</h1>
          <p className="mt-5 text-body-lg text-muted">{s.summary}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Badge>{s.market}</Badge>
            <Badge>Timeframe · {s.timeframe}</Badge>
            <Badge tone="blue">{s.risk} risk</Badge>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-apple p-10">
              <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">Entry</div>
              <ol className="mt-5 space-y-3 text-caption">
                {s.entry.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-muted-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-ink">{e}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card-apple p-10">
              <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Exit</div>
              <ol className="mt-5 space-y-3 text-caption">
                {s.exit.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-muted-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-ink">{e}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card-apple p-10">
              <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Invalidation</div>
              <p className="mt-5 text-caption text-ink leading-relaxed">{s.invalidation}</p>
              <div className="mt-8 hairline-t pt-5">
                <div className="text-micro font-semibold text-muted-faint uppercase tracking-wider">Edge</div>
                <p className="mt-2 text-caption text-muted">{s.edge}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 card-white p-6 sm:p-10 md:p-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue/10 border border-blue/20 px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" aria-hidden />
              <span className="text-nano font-bold text-blue-link uppercase tracking-widest">
                {OFFER_LABEL} · {OFFER_TAGLINE}
              </span>
            </div>
            <h2 className="h-tile">Run this strategy on Golden Indicator.</h2>
            <p className="mt-3 text-caption text-muted">All the filters this setup needs are built in.</p>
            <div className="mt-6">
              <Link href="/checkout" className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body">
                <Price variant="cta" />
              </Link>
            </div>
            <p className="mt-4 text-caption text-muted-faint">
              <span className="line-through decoration-muted-faint/60 mr-2"><Price variant="retail" /></span>
              <span className="text-ink font-medium"><Price variant="amount" /></span> inaugural
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
