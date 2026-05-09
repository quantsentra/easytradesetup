import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexPage() {
  const posts = allPostsSorted();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageBreadcrumbs name="Blog" path="/blog" />

      {/* HERO */}
      <section className="above-bg">
        <div className="container-wide pt-8 sm:pt-14 md:pt-20 pb-2 sm:pb-4">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="font-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
              Blog
            </div>
            <h1 className="font-display font-semibold text-ink leading-[1.05] tracking-tight" style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>
              Indicator literacy. <span className="grad-text">Risk math.</span> Market structure.
            </h1>
            <p className="mt-5 text-ink-60 leading-relaxed" style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.2rem)" }}>
              Long-form essays for traders who already know the chart and want sharper questions.
              No calls. No copy-trading. No &quot;buy now&quot; alerts. Educational only — not investment advice.
            </p>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="above-bg">
          <div className="container-wide py-16">
            <div className="glass-card p-10 text-center max-w-xl mx-auto">
              <p className="text-ink-60">No posts yet. New essays land weekly.</p>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* FEATURED — first post gets a big image card */}
          {featured && (
            <section className="above-bg">
              <div className="container-wide pt-8 sm:pt-12">
                <div className="mx-auto" style={{ maxWidth: 1024 }}>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="block group rounded-lg overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--c-rule, rgba(255,255,255,0.08))",
                      textDecoration: "none",
                    }}
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px]">
                        <Image
                          src={featured.heroImage}
                          alt={featured.heroAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-3">
                          Featured &middot; {formatDate(featured.datePublished)} &middot; {featured.readMinutes} min read
                        </div>
                        <h2 className="font-display font-semibold text-ink leading-[1.2] mb-3 group-hover:text-cyan transition-colors" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}>
                          {featured.title}
                        </h2>
                        <p className="text-[15px] sm:text-[16px] text-ink-60 leading-[1.6] mb-5">
                          {featured.excerpt}
                        </p>
                        <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
                          Read article →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* GRID — remaining posts */}
          {rest.length > 0 && (
            <section className="above-bg">
              <div className="container-wide pt-10 sm:pt-14">
                <div className="mx-auto" style={{ maxWidth: 1024 }}>
                  <div className="grid gap-5 sm:gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                    {rest.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="block group rounded-lg overflow-hidden hover:-translate-y-0.5 transition-transform"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid var(--c-rule, rgba(255,255,255,0.08))",
                          textDecoration: "none",
                        }}
                      >
                        <div className="relative aspect-[16/10]">
                          <Image
                            src={p.heroImage}
                            alt={p.heroAlt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                            className="object-cover"
                          />
                        </div>
                        <div className="p-5 sm:p-6">
                          <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">
                            {formatDate(p.datePublished)} &middot; {p.readMinutes} min read
                          </div>
                          <h3 className="text-[17px] sm:text-[19px] font-semibold leading-[1.3] text-ink mb-3 group-hover:text-cyan transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-[14px] text-ink-60 leading-[1.55] mb-3">
                            {p.excerpt}
                          </p>
                          <span className="font-mono text-[10.5px] uppercase tracking-widest" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
                            {p.primaryKeyword} →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* FOOTER CTA */}
      <section className="above-bg">
        <div className="container-wide py-12 sm:py-16">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="glass-card p-6 sm:p-10 text-center">
              <h2 className="font-display font-semibold text-ink leading-[1.2]" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}>
                The indicator behind the essays. <span className="grad-text-2">One layer. Lifetime.</span>
              </h2>
              <p className="mt-3 max-w-xl mx-auto text-[14px] sm:text-[15px] text-ink-60 leading-relaxed">
                Every post is built around one tool — the Golden Indicator. Bar-close logic, market structure, regime, key levels, supply/demand. One-time payment. No subscription.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3 flex-wrap">
                <Link href="/sample" className="btn btn-outline btn-lg w-full sm:w-auto justify-center">Skim the free sample</Link>
                <Link href="/product" className="btn btn-primary btn-lg w-full sm:w-auto justify-center">
                  See the bundle <span className="arrow" aria-hidden>→</span>
                </Link>
              </div>
              <p className="mt-5 text-[10.5px] font-mono uppercase tracking-widest text-ink-40">
                Educational content &middot; Not investment advice &middot; Trading carries risk
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
