import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPost } from "@/lib/blog";
import Price from "@/components/ui/Price";

const SLUG = "are-paid-trading-signals-worth-it";
const post = getPost(SLUG)!;
const SITE = "https://www.easytradesetup.com";

export const metadata: Metadata = {
  title: post.metaTitle,
  description: post.metaDescription,
  keywords: [post.primaryKeyword, ...post.secondaryKeywords],
  alternates: { canonical: `${SITE}/blog/${SLUG}` },
  openGraph: {
    title:       post.title,
    description: post.metaDescription,
    type:        "article",
    url:         `${SITE}/blog/${SLUG}`,
    publishedTime: post.datePublished,
    authors:     ["EasyTradeSetup Editorial"],
    images:      [{ url: post.heroImage, width: 1200, height: 630, alt: post.heroAlt }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       post.title,
    description: post.metaDescription,
    images:      [post.heroImage],
  },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.metaDescription}
        slug={SLUG}
        datePublished={post.datePublished}
        dateModified={post.dateModified}
        keywords={[post.primaryKeyword, ...post.secondaryKeywords]}
        image={`${SITE}${post.heroImage}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE}/` },
          { name: "Blog", url: `${SITE}/blog` },
          { name: post.title, url: `${SITE}/blog/${SLUG}` },
        ]}
      />

      <article>
        {/* HERO */}
        <header className="container-wide pt-8 sm:pt-14 md:pt-20">
          <nav className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-6">
            <Link href="/" className="hover:text-ink-60">Home</Link>
            <span className="mx-2 text-ink-40/60">/</span>
            <Link href="/blog" className="hover:text-ink-60">Blog</Link>
          </nav>

          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="font-mono text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
              Trading-tool literacy &middot; Signal fatigue
            </div>
            <h1 className="font-display font-semibold text-ink leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}>
              Are paid trading signals worth it? <span className="grad-text">Run these 4 numbers first.</span>
            </h1>
            <p className="mt-6 text-ink-60 leading-relaxed" style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)" }}>
              The honest economics of paid signals. Four numbers decide every trader&apos;s edge —
              none of which sit on a signal seller&apos;s screen.
            </p>
            <div className="mt-7 pb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-ink-40 border-b border-rule">
              <span>EasyTradeSetup Editorial</span>
              <span aria-hidden>&middot;</span>
              <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
              <span aria-hidden>&middot;</span>
              <span>{post.readMinutes} min read</span>
              <span aria-hidden>&middot;</span>
              <span style={{ color: "var(--tz-amber, #FFB341)" }}>Educational, not advice</span>
            </div>
          </div>
        </header>

        {/* HERO IMAGE */}
        <figure className="container-wide mt-8 sm:mt-10">
          <div className="mx-auto" style={{ maxWidth: 1024 }}>
            <div className="rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--c-rule, rgba(255,255,255,0.08))" }}>
              <Image
                src={post.heroImage}
                alt={post.heroAlt}
                width={1600}
                height={900}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
                className="w-full h-auto block"
              />
            </div>
            <figcaption className="mt-3 text-center font-mono text-[10.5px] uppercase tracking-widest text-ink-40">
              Golden Indicator on BANKNIFTY &middot; structural levels and regime, no external signals required
            </figcaption>
          </div>
        </figure>

        {/* TL;DR */}
        <section className="container-wide mt-10 sm:mt-14">
          <div className="mx-auto" style={{ maxWidth: 680 }}>
            <div
              className="px-5 py-4 sm:px-6 sm:py-5 rounded-md"
              style={{
                borderLeft: "3px solid var(--tz-cyan, #22D3EE)",
                background: "rgba(34, 211, 238, 0.05)",
              }}
            >
              <div className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-ink-40 mb-2">
                TL;DR
              </div>
              <p className="text-[14.5px] sm:text-[15.5px] text-ink leading-[1.65] m-0">
                Paid trading signals optimise the seller&apos;s economics, not yours. Four numbers — win rate, R per trade, sample size, drawdown — decide every trader&apos;s edge. None of them sit on a signal seller&apos;s screen. The honest fix isn&apos;t a better signal service. It&apos;s a tool that helps you read the chart yourself.
              </p>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="container-wide mt-10 sm:mt-14">
          <div className="blog-prose">
            <p>
              You&apos;ve probably joined a Telegram channel. Or two. Or five.
              ₹1,500 a month for &quot;sure-shot&quot; calls. ₹500 for an &quot;intraday tips&quot; channel.
              Free tips with a paid &quot;premium&quot; tier behind them.
              At some point you stopped reading the calls. Maybe at some point you stopped subscribing.
            </p>

            <p>
              The next time you&apos;re tempted, run the maths first. Not the moralising — the maths.
              Below are the four numbers that decide whether a trader has an edge. Run any signal seller through them. Your money will sort itself out.
            </p>

            <h2>Why this question is hard to answer honestly</h2>

            <p>
              Most reviews of signal services are written by people selling competing signal services.
              The rest are testimonials curated by the seller. The actual question — does buying signals make me money over time — is almost never answered, because nobody who runs the numbers stays subscribed long enough to write a review.
            </p>

            <p>
              The honest answer is in arithmetic, not vibes. Edge is a math object, not a feeling.
              And the math has four inputs.
            </p>

            <h2>1. Win rate — the number you can&apos;t fake</h2>

            <p>
              Win rate is the percentage of trades that end positive. A signal seller advertising &quot;90% accuracy&quot; is making a claim about win rate.
            </p>

            <p>
              Two problems with that claim. First, win rate alone tells you nothing about edge — a 90% win rate with 10:1 reward-to-risk losing trades is a losing strategy. Second, the seller controls the sample. A seller showing 90% wins is showing the trades they want shown.
            </p>

            <p>
              The number you actually need is <em>your</em> win rate — on a sample of at least 100 trades you took yourself. Not the seller&apos;s. Not curated. Yours. Until you have that number on real account statements, signals are just expensive guesses dressed in confidence.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              Any service advertising specific win-rate percentages without disclosing sample size, time period, slippage assumptions, and unrealised drawdown should be treated as advertising, not data. Past results do not predict future performance.
            </div>

            <h2>2. Average R per trade — the number sellers hide</h2>

            <p>
              R is the size of your stop-loss in money terms. If you risk ₹500 to make ₹1,500, that trade had a 3R outcome. A losing trade is -1R.
            </p>

            <p>
              Average R per trade across your sample is what tells you whether your edge is real. Math:
            </p>

            <ul>
              <li>Win rate × average winner = positive contribution</li>
              <li>Loss rate × 1R = negative contribution</li>
              <li>Edge = positive minus negative, expressed in R</li>
            </ul>

            <p>
              A 50% win rate with average winners of 2R is a +0.5R edge per trade. A 90% win rate with average winners of 0.3R is a -0.07R edge per trade — losing money on every trade. The flashy number is win rate. The number that decides your account is average R.
            </p>

            <p>
              No signal seller publishes their average R per trade. Some don&apos;t even know what it is. The ones that do, hide it.
            </p>

            <h2>3. Sample size — the number that destroys most claims</h2>

            <p>
              A trader with 12 trades doesn&apos;t have results, they have anecdotes. A trader with 60 trades has a small sample. A trader with 300 trades has a working dataset. A trader with 1,000 trades has an opinion worth listening to.
            </p>

            <p>
              When a signal channel screenshots its &quot;winning calls last week&quot;, that&apos;s a sample of maybe 8 trades. The variance on 8 trades is so wide that even a coin-flip random strategy can show 7 wins. You cannot conclude anything from 8 trades. Most paid signal services have not been around long enough to generate a sample anyone should care about.
            </p>

            <p>
              The honest minimum: 100 trades, in conditions like the ones you trade, with full disclosure of losers. If you can&apos;t see 100 sample trades with the math attached, the sample is an advertisement.
            </p>

            <h2>4. Drawdown tolerance — the number you don&apos;t know about yourself yet</h2>

            <p>
              Drawdown is how far your account drops from its peak before recovering. Maximum drawdown is what your strategy needs you to sit through.
            </p>

            <p>
              Even a profitable strategy with a +0.4R edge can have stretches of 10 consecutive losers. That&apos;s a -10R drawdown. On a ₹1 lakh account at 1% risk, that&apos;s a ₹10,000 drawdown — 10% of your account, gone in two weeks.
            </p>

            <p>
              Most retail traders quit during drawdown, regardless of whether the strategy is real. They quit because their <em>tolerance</em> is lower than their strategy&apos;s drawdown. A signal service handing you trades doesn&apos;t fix this — it makes it worse, because you didn&apos;t build the conviction to sit through losers. You just bought confidence and watched it evaporate.
            </p>

            <p>
              The fix isn&apos;t buying calls from someone who promises smaller drawdowns. The fix is knowing your own drawdown tolerance and sizing your trades to match.
            </p>

            <h2>The seller&apos;s economics vs. yours</h2>

            <p>
              Now zoom out. Why does a profitable trader sell signals?
            </p>

            <p>
              They don&apos;t. Profitable traders compound their capital. A trader with a 20% annual edge running ₹50 lakh has no reason to chase ₹1,500/month subscribers — the upside doesn&apos;t move the needle and the downside is regulatory exposure.
            </p>

            <p>
              Signal sellers are running a different business. The math is straightforward:
            </p>

            <ul>
              <li>1,000 subscribers × ₹1,500/month = ₹15 lakh/month, ₹1.8 crore/year</li>
              <li>Their edge is volume of subscribers, not edge in markets.</li>
              <li>Their incentive is to keep you subscribed, not to make you profitable.</li>
              <li>Churn is built into the model — most subs quit after 2-3 months. The seller targets the next batch.</li>
            </ul>

            <p>
              This isn&apos;t cynical. It&apos;s the structure of the product. The seller&apos;s economics and your economics are not aligned. They are misaligned by design.
            </p>

            <h2>What works instead</h2>

            <p>
              The trader who outlasts signal services has three things:
            </p>

            <ul>
              <li>A repeatable framework for reading the chart — regime, structure, key levels, volume — without being told what to do.</li>
              <li>Sizing rules that match their drawdown tolerance, calculated once, applied every trade.</li>
              <li>A trade journal that lets them compute their own win rate, average R, and sample size — so the four numbers above are <em>their</em> numbers.</li>
            </ul>

            <p>
              That&apos;s not glamorous. It&apos;s also the only thing that compounds.
            </p>

            <p>
              Tools help with the first part. A serious indicator classifies the regime, marks the structural levels, and flags supply/demand zones — so you&apos;re reading the chart, not waiting for someone else to read it for you.
              That&apos;s what we built ours to do. See the <Link href="/sample">free chart sample</Link> if you want to look at one before reading more arguments.
            </p>

            <h2>The honest comparison</h2>

            <p>
              A ₹1,500/month signal service costs ₹54,000 over three years. The buyer churns out at month 4 and the seller&apos;s next subscriber takes their seat — the buyer has spent ₹6,000 for 4 months of lottery tickets and zero retained skill.
            </p>

            <p>
              A one-time-pay indicator + the rules that ship with it costs <Price variant="amount" /> once. Three years later the buyer still owns the tool, has built the screen time, has 300 trades in their journal, and is past the four-numbers test on themselves.
            </p>

            <p>
              The first model sells you the seller&apos;s confidence. The second sells you the materials to build your own. Different products entirely.
            </p>

            <h2>Common objections</h2>

            <h3>&quot;But I don&apos;t have time to learn the chart.&quot;</h3>
            <p>
              Then you don&apos;t have time to trade. Buying signals doesn&apos;t solve the time problem — it adds a layer of dependency on top of an already-busy life. The trades still need to be sized, stopped, exited. If you don&apos;t have time for the framework, you don&apos;t have time for the trade.
            </p>

            <h3>&quot;What if I just copy the calls and learn slowly?&quot;</h3>
            <p>
              That&apos;s the seller&apos;s preferred outcome. It funds three more months of subscription. The data on copy-trading is consistent: the win rate of copiers degrades because slippage, late fills, and conviction gaps stack against them. Copy-trading is a loss leader for signal sales, not an entry point to a real career.
            </p>

            <h3>&quot;Some signals seem to actually work.&quot;</h3>
            <p>
              Some do — for short stretches. The question isn&apos;t whether a service has a winning week. It&apos;s whether you, the buyer, end up positive over your full subscription period after fees and slippage. That number is rarely measured and almost never disclosed.
            </p>

            <h3>&quot;What about copy-trading on regulated platforms?&quot;</h3>
            <p>
              The regulation reduces fraud risk, not market-edge risk. The buyer still pays a fee and still has to be aligned with the lead trader&apos;s drawdown — which they almost never are. Same four-numbers problem, different wrapper.
            </p>

            <h2>Closing</h2>

            <p>
              The question isn&apos;t whether paid trading signals are worth it. The question is whether the buyer ends up profitable. The four numbers above answer that — and almost no signal service can show those numbers honestly across a real sample.
            </p>

            <p>
              If you&apos;re where most retail traders are — burnt by signals, looking for something that compounds — the honest move is to stop renting confidence and start building your own framework. Pick a tool that helps you read the chart. Size your trades to your drawdown. Track your numbers.
            </p>

            <p>
              The <Link href="/sample">free chart sample</Link> shows what a regime + structure + key-levels view looks like. The <Link href="/compare">comparison page</Link> shows what changes when you stop relying on someone else&apos;s screen. Neither will tell you what to trade tomorrow. Both will help you decide for yourself, which is the only thing that survives signal-seller rotation.
            </p>
          </div>
        </section>

        {/* IN-BODY CTA CARD */}
        <section className="container-wide mt-12 sm:mt-16">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="glass-card p-6 sm:p-8">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">
                Tool, not signals
              </div>
              <h3 className="font-display font-semibold leading-[1.25] text-ink mb-3" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}>
                Golden Indicator — read the chart yourself.
              </h3>
              <p className="text-[14px] sm:text-[15px] text-ink-60 leading-[1.6] mb-5">
                Bar-close logic. Regime classification. Market structure. Key levels. Supply/demand zones. One Pine v5 script.
                Bundle includes the Trade Logic PDF (8 setups with rules), risk calculator, daily market notes, lifetime updates.
                One-time payment. No subscription. No calls. No copy-trading.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <Link href="/sample" className="btn btn-outline w-full sm:w-auto justify-center">Skim the free sample</Link>
                <Link href="/product" className="btn btn-primary w-full sm:w-auto justify-center">
                  See the bundle <span className="arrow" aria-hidden>→</span>
                </Link>
                <Link href="/checkout" className="btn btn-ghost w-full sm:w-auto justify-center">
                  Lock <Price variant="amount" /> inaugural →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* AUTHOR / META FOOTER */}
        <section className="container-wide mt-12 sm:mt-16">
          <div className="mx-auto pt-6 border-t border-rule font-mono text-[10.5px] uppercase tracking-widest text-ink-40 flex flex-wrap gap-x-4 gap-y-1" style={{ maxWidth: 680 }}>
            <span>Last reviewed: {formatDate(post.datePublished)}</span>
            <span aria-hidden>&middot;</span>
            <span>Author: EasyTradeSetup Editorial</span>
            <span aria-hidden>&middot;</span>
            <span>Reviewed monthly</span>
          </div>
        </section>

        {/* FOOTER DISCLAIMER */}
        <section className="container-wide mt-8 sm:mt-10 mb-10 sm:mb-14">
          <div className="mx-auto" style={{ maxWidth: 680 }}>
            <div className="glass-flat p-5 sm:p-6">
              <div className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-ink-40 mb-2">
                Disclaimer
              </div>
              <p className="text-[12px] sm:text-[13px] text-ink-60 leading-[1.6] m-0">
                Educational content. Not investment advice. Trading carries risk of substantial loss including total capital.
                EasyTradeSetup is not a SEBI-registered research analyst.
                Past results do not predict future performance.
                References to specific subscription pricing or signal-service economics are illustrative for teaching, not recommendations to engage or avoid any specific service.
              </p>
            </div>
          </div>
        </section>

        {/* READ NEXT */}
        <section className="container-wide pb-12 sm:pb-20">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-3">Read next</div>
            <Link href="/blog/best-indicator-for-nifty-options" className="glass-card-soft p-5 sm:p-6 block hover:-translate-y-0.5 transition-transform" style={{ textDecoration: "none" }}>
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">Indicator literacy</div>
              <div className="text-[15px] sm:text-[17px] text-ink font-semibold">
                Best indicator for NIFTY options? Four questions decide it.
              </div>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
