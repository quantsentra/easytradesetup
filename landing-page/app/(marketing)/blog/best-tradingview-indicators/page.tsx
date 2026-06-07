import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPost } from "@/lib/blog";
import Price from "@/components/ui/Price";

const SLUG = "best-tradingview-indicators";
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
              Indicator literacy &middot; Chart setup
            </div>
            <h1 className="font-display font-semibold text-ink leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}>
              Best TradingView indicators — <span className="grad-text">four tests before you add anything to your chart.</span>
            </h1>
            <p className="mt-6 text-ink-60 leading-relaxed" style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)" }}>
              The TradingView marketplace has over 100,000 published scripts. Most of them add noise, not clarity.
              Four tests decide which indicators earn a spot on a decision-grade chart — and which ones should come off it.
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
              Golden Indicator on US30 &middot; regime, structure, and key levels — one decision layer, no signal clutter
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
                Most TradingView indicators fail at least one of four tests: regime classification, no-repaint structure marking,
                automatic key levels, and decision simplification. An indicator that fails even one of them is adding noise to your chart.
                An indicator that passes all four is decision-grade. The four tests below take less than five minutes per tool.
              </p>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="container-wide mt-10 sm:mt-14">
          <div className="blog-prose">
            <p>
              Most retail traders cycle through indicators the same way. Year one: RSI and MACD from the YouTube tutorials.
              Year two: three moving average crossovers plus a Supertrend. Year three: an expensive proprietary indicator from a signal group.
              By that point the chart has six layers and the decisions are slower, not faster.
            </p>

            <p>
              The question &quot;what are the best TradingView indicators&quot; is understandable but it frames the problem wrong.
              Indicators are not universally ranked. What matters is whether a specific indicator belongs on your chart — whether it
              answers the questions that decide your trades, in order, without adding conditions you can&apos;t resolve in real time.
            </p>

            <p>
              Four tests decide that. Any indicator that fails even one of them is adding noise to your chart.
              Any indicator that passes all four is worth the screen space.
            </p>

            <h2>Why most TradingView indicators add noise, not signal</h2>

            <p>
              The TradingView public library grew organically — thousands of coders sharing variations of the same underlying ideas.
              The bulk of what is in there is one of four things: a moving average or crossover variant, a momentum oscillator
              (RSI, MACD, Stochastic, CCI) with slightly different parameters, a signal arrow indicator that paints buys and sells
              on the chart, or a single-variable tool that answers one narrow question without any market context.
            </p>

            <p>
              None of these are wrong as concepts. RSI divergence exists. Moving averages track slow trends.
              The problem is that none of them answer the foundational question before any of the others can be useful:
              what regime is the market in right now?
            </p>

            <p>
              Without a regime read, every signal is at best a 50/50 call with extra steps — and usually worse than that,
              because a range-bound market will generate trend-following signals that lose by design and vice versa.
              Start with the regime, then apply everything else.
            </p>

            <h2>Test 1 — Does it classify the regime?</h2>

            <p>
              Regime means: is the market trending, ranging, or compressing? The three regimes behave completely differently.
              Trend-continuation setups win in trends and lose in ranges. Fade setups win at range boundaries and get destroyed
              in trends. Compression setups do not exist — the correct play in compression is to wait for the expansion.
            </p>

            <p>
              Most TradingView charts have no regime classification at all. The indicators fire signals in all three regimes,
              the trader takes them indiscriminately, and the hit rate is lower than it would be from a coin flip because the
              winning-regime signals and the losing-regime signals cancel each other out in expectancy.
            </p>

            <p>
              A regime-classifying indicator answers one question per bar: is the current structure a trend sequence,
              a bounded oscillation, or a converging pattern? Some indicators go further and paint the label on the chart — trend up,
              trend down, range, compression — so the regime communicates at a glance without counting swings manually.
            </p>

            <p>
              The test: load the candidate indicator on three different charts — a clean trending session, a clear range-bound day,
              and a low-ATR compression hour. Does the indicator communicate something different and relevant in each?
              If it fires the same signal density and the same visual output in all three, it is not regime-aware.
            </p>

            <p>
              Red flag: a moving average that turns green on the way up and red on the way down is not regime classification.
              It is trend-following — and it cannot distinguish a genuine trend from a temporary range extension.
              For the full regime-reading framework, see the <Link href="/blog/trend-vs-range-trading">trend vs range trading guide</Link>.
            </p>

            <h2>Test 2 — Does it mark structure without repainting?</h2>

            <p>
              Market structure means: where are the swing highs, swing lows, and the structural events — Break of Structure (BOS)
              and Change of Character (CHoCH)? Structure is the skeleton that price moves inside.
              Trends are sequences of BOS events in the same direction. Ranges are bounded by prior structural pivots.
              Compressions resolve at structural turns.
            </p>

            <p>
              An indicator that marks structure correctly tells you where in the market&apos;s story you currently are.
              An indicator that marks structure incorrectly, or marks it after the fact, is worse than nothing —
              it gives you false confidence at the exact moment you need accurate information.
            </p>

            <p>
              The repaint test is non-negotiable. Repaint means the indicator changes its historical signals as new bars form.
              Many popular TradingView structure indicators repaint. Load them on a finished chart and they look perfect —
              every BOS exactly where it should be, every structural pivot at the turn. That is because the indicator uses
              future data to position past signals. In a live session, those signals do not exist when you need them.
              They appear only after the move is over.
            </p>

            <p>
              How to test for repaint: note where the indicator&apos;s signals appear on a historical chart. Reload the chart or
              change the visible bar range slightly to force a recalculation. Do any historical signals shift position?
              If yes, the indicator repaints. If the signals stay fixed on every reload, the indicator uses bar-close logic.
            </p>

            <p>
              Bar-close logic — signal confirmed only after the bar that generated it is fully closed — is the minimum standard
              for a structure indicator you can act on in real time. If the indicator documentation does not explicitly state
              &quot;bar close&quot; or &quot;no repaint,&quot; run the test before trusting the tool in a live session.
            </p>

            <h2>Test 3 — Does it draw key levels automatically?</h2>

            <p>
              Key levels are the price zones that price has historically respected and is likely to interact with again:
              previous day high and low (PDH / PDL), previous week high and low (PWH / PWL), session opens,
              and structural supply and demand zones from recent high-momentum moves.
            </p>

            <p>
              These levels matter because structural events — BOS, CHoCH, failed breakouts — have their highest probability
              at key levels. A BOS at a clean, untested PDH carries more information than a BOS at a random price.
              A rejected push into PWL in a downtrend is a higher-quality confluence entry than a rejection in the middle of a range.
              The level context upgrades the structure read.
            </p>

            <p>
              Drawing key levels manually works. It is also 10–20 minutes of prep work per instrument, prone to inconsistency
              (what counts as a &quot;structural zone&quot; varies by mood), and easily skipped on a fast-moving morning.
              An indicator that draws them automatically — using a consistent definition — removes the variability and the prep time.
            </p>

            <p>
              Quality test: on a chart where you have already drawn your own key levels manually, add the indicator.
              Do the auto-drawn levels match your manual ones closely? If the indicator uses a materially different definition —
              pivots that don&apos;t match your structural reads — find out why and decide whether its definition is better or worse
              than yours before replacing your manual work.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              Key levels are not guaranteed support or resistance. Price can and does break through any level.
              The value of key levels is probabilistic — they concentrate structural events, not determine them.
              Treat any level that &quot;must hold&quot; as a narrative, not a fact.
            </div>

            <h2>Test 4 — Does it reduce decisions or multiply them?</h2>

            <p>
              The purpose of an indicator is to make the next trade decision clearer and faster.
              If adding an indicator to your chart makes the next five decisions harder — because there is now an extra condition
              to reconcile, or it conflicts with another tool — the indicator is costing you.
            </p>

            <p>
              The decision-multiplication test: add the candidate indicator to your chart. Pull up five historical setups from
              the past two weeks — ideally five you actually traded or considered. For each setup, ask one question:
              did this indicator make that decision clearer or harder?
              If the honest answer is &quot;harder&quot; in three out of five, take the indicator off.
            </p>

            <p>
              A chart with a single decision layer — regime classification, structural events, key levels — answers most of the
              questions worth asking before entry: is the regime aligned with the setup? is there a structural event at a key level?
              is volume confirming the move? That is three questions with binary answers. Six indicators from different frameworks
              create a 20-question checklist that most traders cannot complete before the setup is gone.
            </p>

            <p>
              Fewer, better-chosen tools produce faster decisions at the same or higher quality.
              The indicator ceiling for most working price-action traders is three: one for regime and structure, one for volume context,
              one for key levels. Many serious traders use one tool that layers all three.
            </p>

            <h2>Worked example — two approaches to the same setup</h2>

            <p>Educational. Specific levels and outcomes below are illustrative for teaching, not statements about any historical session.</p>

            <p>
              <strong>Chart A — six-indicator setup.</strong> A trader opens their US30 chart to a Tuesday morning session.
              They have MACD, RSI (14), three exponential moving averages (8 / 21 / 50), Bollinger Bands, and a SuperTrend.
              Price breaks above the prior session&apos;s high on expanding volume. MACD is flat.
              RSI is at 61 — elevated but not overbought. The 8 EMA crossed the 21 three bars ago, but the 50 is still sloping down.
              SuperTrend is green. Bollinger Bands are widening. The trader has five partially conflicting reads.
              They wait for one more bar to confirm. The breakout extends 90 points. They missed it waiting for consensus
              from tools that measure different things on different time horizons and cannot agree by design.
            </p>

            <p>
              <strong>Chart B — one decision layer.</strong> A second trader has one tool on the same chart.
              The regime label reads &quot;trend up&quot; — classified on the prior bar&apos;s close using structural sequence.
              A BOS event printed when price cleared the prior session high. That level is a key level the tool auto-drew at the session open.
              Three inputs, all aligned, all from one tool. The trader sizes and enters on the breakout bar&apos;s close.
              The decision took four seconds.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              Worked examples are illustrative for teaching purposes. Specific price levels, timing, and outcomes are approximated.
              Past chart patterns do not guarantee future performance. Trading carries risk of substantial loss including total capital.
            </div>

            <h2>What a decision-grade chart actually looks like</h2>

            <p>
              A decision-grade chart communicates three things at a glance: what regime the market is in, where the structural
              events are, and where the key levels sit. Everything else is optional.
            </p>

            <p>
              Volume is worth adding as a fourth input — but as a confirmation tool, not as a signal generator.
              You read the regime, find the structural event at a key level, and use volume to confirm or kill the trade.
              That is a four-step checklist. Any indicator that adds a fifth step without providing information the first four
              don&apos;t already give you is noise.
            </p>

            <p>
              The TradingView marketplace has tools that pass all four tests above. They are a small fraction of the total.
              Most require manual searching and the repaint test before committing to them in a live session.
              What you are looking for is a tool that classifies regime on bar close, marks BOS and CHoCH on bar close,
              draws PDH / PDL / PWH / PWL before the session starts, and visually simplifies the chart rather than complicating it.
              Check the <Link href="/sample">free chart sample</Link> to see what that output looks like on real market data.
            </p>

            <h2>FAQ</h2>

            <h3>What are the best free TradingView indicators?</h3>
            <p>
              The TradingView built-in tools include VWAP, standard volume histogram, and a range of moving averages — all free.
              For regime classification and structure marking, the public Pine Script library has free options,
              though quality varies significantly. Apply the four tests above — especially the repaint test — before trusting
              any public-library indicator in a live session. The best free indicator is one that passes all four tests,
              regardless of price.
            </p>

            <h3>How many indicators should I have on my chart?</h3>
            <p>
              Three is a practical ceiling. One for regime and structure, one for key levels, one for volume confirmation.
              Many working price-action traders use one tool that layers all three into a single visual.
              More than three indicators usually means at least one is redundant with another — answering a question already answered,
              at the cost of chart clarity and decision speed.
            </p>

            <h3>What is a &quot;no-repaint&quot; indicator and why does it matter?</h3>
            <p>
              Repaint means the indicator changes its historical signals as new bars arrive.
              A repainting indicator looks perfect on historical charts because it uses data that did not yet exist
              when the trade would have been taken. In live sessions, the signal appears only after the opportunity has passed.
              Bar-close logic — signal fixed once the generating bar is closed — eliminates repaint.
              Always run the repaint test described in Test 2 above before relying on any structure indicator.
            </p>

            <h3>Is there a TradingView indicator that shows market structure automatically?</h3>
            <p>
              Yes — several Pine Script indicators mark BOS and CHoCH automatically. Quality and consistency vary.
              Apply the repaint test to any indicator before trusting it in a live session.
              For a full guide to what market structure means and how to validate auto-marked zones, see the{" "}
              <Link href="/blog/how-to-draw-supply-demand-zones">supply and demand zones guide</Link>.
            </p>

            <h3>Does a regime indicator replace other technical analysis tools?</h3>
            <p>
              It replaces the noise, not all analysis. A regime indicator tells you what kind of market you are in,
              which immediately narrows the valid setups to those that work in that regime. Structure marking tells you
              where in that regime&apos;s story you are. Key levels tell you which price zones matter.
              Those three together answer the questions worth asking before any trade.
              Standard oscillators — RSI, MACD — typically answer a question the regime read already covered,
              at the cost of one more condition to manage under pressure.
            </p>

            <h2>Closing</h2>

            <p>
              The four tests — regime classification, no-repaint structure, automatic key levels, decision simplification —
              are a filter, not a ranking. They find the class of indicator that earns its place on a decision-grade chart.
              Most indicators in the TradingView marketplace fail at least one test. The ones that pass all four are relatively
              rare but they exist, and finding them is faster with the framework than without it.
            </p>

            <p>
              If you want to see what a regime + structure + key-level decision layer looks like on real chart data across multiple markets,
              the <Link href="/sample">free chart sample</Link> is the quickest path.
              For the full decision system — indicator, Trade Logic PDF with eight setups, explicit triggers and exits,
              risk calculator, daily market notes, lifetime updates, one-time payment — the <Link href="/product">product page</Link> has
              the complete detail.
            </p>
          </div>
        </section>

        {/* IN-BODY CTA CARD */}
        <section className="container-wide mt-12 sm:mt-16">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="glass-card p-6 sm:p-8">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">
                One tool that passes all four tests
              </div>
              <h3 className="font-display font-semibold leading-[1.25] text-ink mb-3" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}>
                Golden Indicator — regime, structure, key levels on every chart.
              </h3>
              <p className="text-[14px] sm:text-[15px] text-ink-60 leading-[1.6] mb-5">
                Bar-close logic. Auto-classifies regime. Marks structural swings (BOS / CHoCH). Draws PDH / PDL / PWH / PWL.
                Supply &amp; demand zones tagged at reactive levels. No repaint.
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
                EasyTradeSetup is not a registered investment adviser or research analyst in any jurisdiction.
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
              <Link href="/blog/trend-vs-range-trading" className="glass-card-soft p-5 block hover:-translate-y-0.5 transition-transform" style={{ textDecoration: "none" }}>
                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">Regime classification</div>
                <div className="text-[14.5px] sm:text-[16px] text-ink font-semibold leading-[1.3]">
                  Trend vs range trading — the decision behind every other decision.
                </div>
              </Link>
              <Link href="/blog/luxalgo-alternative" className="glass-card-soft p-5 block hover:-translate-y-0.5 transition-transform" style={{ textDecoration: "none" }}>
                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">Indicator economics</div>
                <div className="text-[14.5px] sm:text-[16px] text-ink font-semibold leading-[1.3]">
                  LuxAlgo alternative — stop renting your indicator. Four questions.
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
