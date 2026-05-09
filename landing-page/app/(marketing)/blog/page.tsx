import type { Metadata } from "next";
import Link from "next/link";
import { allPostsSorted } from "@/lib/blog";
import { PageBreadcrumbs } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Blog · Indicator literacy & risk math · EasyTradeSetup",
  description:
    "Trading-tool literacy, risk math, market structure, and the case for one-time-pay indicators. Educational. No signals, no calls.",
  alternates: { canonical: "https://www.easytradesetup.com/blog" },
  openGraph: {
    title: "EasyTradeSetup Blog",
    description:
      "Educational essays on indicator literacy, risk math, and market structure for retail traders. No signals.",
    type: "website",
    url: "https://www.easytradesetup.com/blog",
  },
  twitter: { card: "summary_large_image" },
};

export default function BlogIndexPage() {
  const posts = allPostsSorted();

  return (
    <>
      <PageBreadcrumbs name="Blog" path="/blog" />

      <section className="above-bg">
        <div className="container-wide pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <span className="eye"><span className="eye-dot" /> Blog</span>
            <h1 className="h-display mt-4">
              Indicator literacy. <span className="grad-text">Risk math.</span> Market structure.
            </h1>
            <p className="mt-5 text-caption text-ink-60 leading-relaxed max-w-2xl">
              Long-form essays for traders who already know the chart and want sharper questions.
              No calls. No copy-trading. No "buy now" alerts. Educational only — not investment advice.
            </p>
          </div>
        </div>
      </section>

      <section className="above-bg">
        <div className="container-wide py-10 sm:py-14">
          <div className="grid gap-5 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="glass-card-soft p-7 hover:-translate-y-0.5 transition-transform"
                style={{ display: "block", textDecoration: "none" }}
              >
                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-3">
                  {p.datePublished} · {p.readMinutes} min read
                </div>
                <h2 className="text-[19px] sm:text-[21px] font-semibold leading-[1.3] text-ink mb-3">
                  {p.title}
                </h2>
                <p className="text-[14px] text-ink-60 leading-[1.6] mb-4">
                  {p.excerpt}
                </p>
                <div className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
                  Read · {p.primaryKeyword} →
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="glass-card p-10 text-center">
              <p className="text-ink-60">No posts yet. New essays land weekly.</p>
            </div>
          )}
        </div>
      </section>

      <section className="above-bg">
        <div className="container-wide py-12 sm:py-16">
          <div className="glass-card p-8 sm:p-10 text-center">
            <h2 className="h-tile">
              The indicator behind the essays. <span className="grad-text-2">One layer. Lifetime.</span>
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-caption text-ink-60 leading-relaxed">
              Every post here is built around one tool — the Golden Indicator. Bar-close logic, market structure, regime, key levels, supply/demand. One-time payment. No subscription.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/sample" className="btn btn-outline btn-lg">Skim the free sample</Link>
              <Link href="/product" className="btn btn-primary btn-lg">See the bundle <span className="arrow" aria-hidden>→</span></Link>
            </div>
            <p className="mt-5 text-[11px] font-mono uppercase tracking-widest text-ink-40">
              Educational content · Not investment advice · Trading carries risk
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
