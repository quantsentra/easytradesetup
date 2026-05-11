import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPost } from "@/lib/blog";
import Price from "@/components/ui/Price";

const SLUG = "trend-vs-range-trading";
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
              Market structure &middot; Regime classification
            </div>
            <h1 className="font-display font-semibold text-ink leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}>
              Trend vs range trading — <span className="grad-text">the decision behind every other decision.</span>
            </h1>
            <p className="mt-6 text-ink-60 leading-relaxed" style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)" }}>
              Same chart, three regimes — and every setup behaves differently in each.
              Three tells that classify the regime, plus why your sizing breaks when the read is wrong.
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
              Golden Indicator on NIFTY &middot; structure + supply/demand zones make the regime read fast
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
                Trend, range, and compression behave differently. The same setup wins in one and loses in the others.
                Three tells classify the regime quickly: structural sequence, ATR compression, and volume profile.
                Get the regime read right and sizing, stops, and exits sort themselves out. Get it wrong and you fight the chart all day.
              </p>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="container-wide mt-10 sm:mt-14">
          <div className="blog-prose">
            <p>
              Most retail trade postmortems blame the entry. Wrong direction, bad fill, late by a candle.
              Reality is usually upstream of that: the trader read the regime wrong.
              They took a trend-continuation setup inside a range. They faded a breakout that turned into a real expansion. They scalped a compression like it was a trend.
            </p>

            <p>
              Setups are not universal. Each one has a regime where it has positive expectancy and at least one regime where it has the opposite. The single decision that decides every other decision is which regime you&apos;re in.
            </p>

            <p>
              This piece covers three things: the three regimes you&apos;ll see most days, the three tells that classify them, and why sizing and stops change with the regime read. By the end you&apos;ll know which question to ask before you take any setup.
            </p>

            <h2>The three regimes you&apos;ll actually trade</h2>

            <p>Forget the two-regime framing. There are three:</p>

            <ul>
              <li>
                <strong>Trending</strong> — Price stacks higher highs and higher lows (uptrend) or lower highs and lower lows (downtrend). Pullbacks are shallow. Volume confirms in the direction of trend.
              </li>
              <li>
                <strong>Ranging</strong> — Price oscillates between a clear upper and lower bound. Failed breakouts. Both sides get rejected. Volume is mixed, no directional bias.
              </li>
              <li>
                <strong>Compressing</strong> — Higher lows and lower highs converging. Volatility collapsing. Volume tapers. The market is loading for an expansion but you don&apos;t yet know in which direction.
              </li>
            </ul>

            <p>
              Compression is the regime most retail traders mis-classify. It looks like a range, so traders fade the boundaries. It feels like a quiet day, so they reduce attention. Then the expansion fires and they&apos;re on the wrong side or sidelined.
              The same NIFTY chart can rotate through all three regimes within a single trading day.
            </p>

            <h2>Tell 1 — the structural sequence</h2>

            <p>
              Look at the last five swing highs and lows. Mark each in order.
            </p>

            <ul>
              <li><strong>HH-HL-HH-HL-HH</strong> sequence → clean uptrend. Pullbacks into the prior HL are continuation entries.</li>
              <li><strong>LH-LL-LH-LL-LH</strong> sequence → clean downtrend. Pullbacks into prior LH are continuation entries.</li>
              <li><strong>HH-LL-HH-LL</strong> within a defined band → range. Boundary entries are the higher-probability play.</li>
              <li><strong>HH-LL-HL-LH-HL-LH</strong> with each high lower and each low higher than the prior swing of the same type → compression. Wait.</li>
            </ul>

            <p>
              You don&apos;t need every swing to be perfect. Three out of the last five is enough to call the regime. The point is to count, not to interpret a feeling.
            </p>

            <h2>Tell 2 — ATR contraction</h2>

            <p>
              Average True Range is volatility expressed in price points. A 14-period ATR on a 5-minute NIFTY chart is a single number that tells you the typical bar size.
            </p>

            <p>
              Compare today&apos;s ATR against the 20-day average ATR.
            </p>

            <ul>
              <li>Today&apos;s ATR <em>greater than</em> 20-day avg → expansion regime in play. Trend setups work. Range setups break.</li>
              <li>Today&apos;s ATR <em>roughly equal to</em> 20-day avg → mature trend or stable range. Setups behave normally.</li>
              <li>Today&apos;s ATR <em>less than 70% of</em> 20-day avg → compression regime. Reduce sizing or wait.</li>
            </ul>

            <p>
              The trap is treating low-ATR days like normal trading days at full size. Your stop is fine but the move you&apos;re targeting won&apos;t arrive. You&apos;ll time-stop out flat or take small losses for hours.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              ATR is a lagging measure of realised volatility, not implied. Real expansions can start from compressed ATR readings and ATR will catch up after the move begins. ATR is a regime hint, not a trade signal. Combine with structural tells before sizing.
            </div>

            <h2>Tell 3 — volume profile</h2>

            <p>
              Volume confirms or contradicts what price is doing. In a healthy trend, expansion bars show higher volume and pullback bars show lower volume. In a healthy range, volume is mixed — neither side has consistent conviction.
            </p>

            <p>
              The diagnostic question: in the last 10 bars, did volume confirm the direction of the move or contradict it?
            </p>

            <ul>
              <li><strong>Confirming volume</strong> in a directional move → trend regime, fade at your own risk.</li>
              <li><strong>Contradicting volume</strong> (price up on falling volume, or vice versa) → likely range or compression, breakout will fail.</li>
              <li><strong>Climactic volume</strong> after a sustained directional move → exhaustion, expect regime shift.</li>
            </ul>

            <p>
              You don&apos;t need a volume profile indicator to read this. The standard volume histogram at the bottom of the chart, compared visually to recent bars, gets you 80% of the signal.
            </p>

            <h2>Why this matters for sizing</h2>

            <p>
              Same setup, different regime — the math changes completely.
            </p>

            <p>
              Take a NIFTY pullback-to-VWAP long, account ₹1 lakh, 1% risk = ₹1,000.
            </p>

            <ul>
              <li>
                In a trending regime: stop sits below the structural pullback low, maybe 25 NIFTY points away. Target is the next swing high, maybe 75 points. 3R trade, take it.
              </li>
              <li>
                In a range: same stop, but target is the upper boundary which is closer — say 35 points. 1.4R trade. Less attractive but workable.
              </li>
              <li>
                In compression: same setup is a trap. The pullback isn&apos;t a pullback, it&apos;s the lower swing of an interior chop. Stop hits before any meaningful move.
              </li>
            </ul>

            <p>
              The trader who took all three trades has identical entries and identical stops. Their P&amp;L differs because the regime differed. Most retail traders blame the indicator or the broker. The signal blamed the regime.
            </p>

            <h2>The regime question before any trade</h2>

            <p>Before you click buy or sell, ask:</p>

            <ol>
              <li>What does the structural sequence say — trend, range, or compression?</li>
              <li>What does ATR vs the 20-day average say?</li>
              <li>What does volume in the last 10 bars say?</li>
            </ol>

            <p>
              When all three agree, you have a high-conviction regime read. Take the setups that match the regime.
              When two agree and one is mixed, reduce sizing.
              When all three disagree, sit out — the chart is between regimes and your hit-rate will collapse.
            </p>

            <h2>What a tool can actually help with</h2>

            <p>
              You can do all three tells manually. Count swings, read ATR off a sub-pane, eyeball volume.
              A serious indicator collapses the work to two seconds: the regime label is already on the chart, the structural sequence is already marked, the key levels are already drawn.
            </p>

            <p>
              That&apos;s what we built ours to do — regime first, structure second, signals never. Read the chart for yourself; the tool just makes the read fast.
              See the <Link href="/sample">free chart sample</Link> if you want to look at the regime layer on a real chart before reading more.
            </p>

            <h2>Worked example — NIFTY, three days, three regimes</h2>

            <p>Educational. Past performance does not predict future performance.</p>

            <p>
              <strong>Monday.</strong> NIFTY opens, runs +0.6% in the first 90 minutes on rising volume. Structural sequence: HH-HL-HH. ATR 1.3× the 20-day. Trending regime, confirmed. A pullback-to-VWAP long taken at midday returns 2.4R. The setup matched the regime.
            </p>

            <p>
              <strong>Tuesday.</strong> NIFTY opens flat. After the first hour, price oscillates in a 30-point band. ATR is 0.6× the 20-day. Volume is mixed. Structural sequence: HH-LL-HH-LL inside the band. Range regime. The same VWAP-pullback long taken here gets stopped because there&apos;s no trend to continue. The setup didn&apos;t match the regime.
            </p>

            <p>
              <strong>Wednesday.</strong> NIFTY is dead quiet. ATR 0.5× the 20-day. The structural swings are converging: LH-HL-LH-HL with each lower high getting lower and each higher low getting higher. Compression regime. A trader who takes either a long or a short here is fighting noise. The avoided trade is the trade — until the expansion fires, then trend-continuation rules apply.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              The example uses approximated NIFTY price action for teaching purposes. Specific levels, percentages, and outcomes are illustrative — not statements about any historical session or recommendations to take any specific trade. Trading carries risk of substantial loss including total capital.
            </div>

            <h2>Common mistakes</h2>

            <ul>
              <li>
                <strong>Forcing trend setups in a range.</strong> The setup is real; the regime is wrong. The fix isn&apos;t a better entry — it&apos;s waiting for the regime to shift or switching to a range-appropriate setup.
              </li>
              <li>
                <strong>Fading the first expansion bar of a regime shift.</strong> Compression doesn&apos;t resolve into another range — it resolves into an expansion. Fading that first impulse is one of the highest-loss-rate trades in retail.
              </li>
              <li>
                <strong>Ignoring ATR because it&apos;s slow.</strong> ATR doesn&apos;t fire signals, it sets context. Used as context it&apos;s reliable; used as a signal it&apos;s late.
              </li>
              <li>
                <strong>Calling the regime once and forgetting.</strong> NIFTY regime can shift within a single session. The morning trend can become an afternoon range. Re-check the three tells every 60–90 minutes.
              </li>
            </ul>

            <h2>FAQ</h2>

            <h3>Is one of the three regimes more profitable than the others?</h3>
            <p>
              Trends are usually the highest-R-per-trade regime. Ranges have higher hit rates with smaller R. Compression has near-zero expected value until it resolves. Most working traders skew their trade count toward trends and treat ranges as auxiliary income.
            </p>

            <h3>Can I use just one of the three tells?</h3>
            <p>
              You can, and most retail traders do — usually the structural sequence. Adding ATR catches compression, which structure alone misses. Adding volume catches exhausted trends. Each tell handles a regime the others miss. Together, they triangulate.
            </p>

            <h3>What timeframe should I check the regime on?</h3>
            <p>
              Read the regime on the timeframe one step above your entry timeframe. Trading 5-minute entries? Read the regime on the 15-minute or hourly. Trading swing? Read regime on the daily. The point is to size the regime read to the trade horizon.
            </p>

            <h3>Does this work for BANKNIFTY or only NIFTY?</h3>
            <p>
              Same framework, different volatility profile. BANKNIFTY tends to expansion faster than NIFTY, so the compression regime resolves quicker. The three tells still classify it correctly — just expect transitions to happen on shorter timeframes.
              See the <Link href="/indicator/banknifty">BANKNIFTY page</Link> for the volatility-specific notes.
            </p>

            <h3>How is this different from just &quot;reading the chart&quot;?</h3>
            <p>
              &quot;Reading the chart&quot; without a framework is a feeling. The three tells turn it into a checklist with binary answers. Two traders looking at the same NIFTY chart should arrive at the same regime read — if they don&apos;t, one of them is using feelings instead of rules.
            </p>

            <h2>Closing</h2>

            <p>
              Trend, range, compression — three regimes, one decision. Structural sequence, ATR, volume — three tells, one answer.
              Get the regime read right and most setup-level mistakes disappear because you stop taking trades the chart isn&apos;t offering.
            </p>

            <p>
              The trader who outperforms isn&apos;t the one with the cleverest entries.
              They&apos;re the one who sits out the wrong regime, sizes for the right one, and lets the chart hand them the trade.
              That&apos;s what a working framework is for — and that&apos;s what the indicator and rules in the bundle are built around.
            </p>

            <p>
              If you want to see what a regime + structure + key-levels view looks like on a real chart, the <Link href="/sample">free chart sample</Link> is the shortest path.
              For the full decision system — rules, sizing maths, eight setups — the <Link href="/product">bundle is here</Link>.
            </p>
          </div>
        </section>

        {/* IN-BODY CTA CARD */}
        <section className="container-wide mt-12 sm:mt-16">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="glass-card p-6 sm:p-8">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">
                Read the regime, then trade
              </div>
              <h3 className="font-display font-semibold leading-[1.25] text-ink mb-3" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}>
                Golden Indicator — regime, structure, key levels on every chart.
              </h3>
              <p className="text-[14px] sm:text-[15px] text-ink-60 leading-[1.6] mb-5">
                Bar-close logic. Auto-classifies regime. Marks structural swings (BOS / CHoCH). Draws PDH / PDL / PWH / PWL.
                Supply &amp; demand zones tagged at reactive levels.
                Bundle includes the Trade Logic PDF (eight setups with explicit triggers, stops, exits), risk calculator, daily market notes, lifetime updates.
                One-time payment.
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
                Worked examples and price references are illustrative for teaching, not recommendations to take any specific trade.
              </p>
            </div>
          </div>
        </section>

        {/* READ NEXT */}
        <section className="container-wide pb-12 sm:pb-20">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-3">Read next</div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <Link href="/blog/best-indicator-for-nifty-options" className="glass-card-soft p-5 block hover:-translate-y-0.5 transition-transform" style={{ textDecoration: "none" }}>
                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">Indicator literacy</div>
                <div className="text-[14.5px] sm:text-[16px] text-ink font-semibold leading-[1.3]">
                  Best indicator for NIFTY options? Four questions decide it.
                </div>
              </Link>
              <Link href="/blog/are-paid-trading-signals-worth-it" className="glass-card-soft p-5 block hover:-translate-y-0.5 transition-transform" style={{ textDecoration: "none" }}>
                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">Signal fatigue</div>
                <div className="text-[14.5px] sm:text-[16px] text-ink font-semibold leading-[1.3]">
                  Are paid trading signals worth it? Run these 4 numbers first.
                </div>
              </Link>
            </div>
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
