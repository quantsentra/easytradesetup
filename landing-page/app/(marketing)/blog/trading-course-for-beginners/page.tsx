import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPost } from "@/lib/blog";
import Price from "@/components/ui/Price";

const SLUG = "trading-course-for-beginners";
const post = getPost(SLUG)!;
const SITE = "https://www.easytradesetup.com";

export const metadata: Metadata = {
  title: post.metaTitle,
  description: post.metaDescription,
  keywords: [post.primaryKeyword, ...post.secondaryKeywords],
  alternates: { canonical: `${SITE}/blog/${SLUG}` },
  openGraph: {
    title:         post.title,
    description:   post.metaDescription,
    type:          "article",
    url:           `${SITE}/blog/${SLUG}`,
    publishedTime: post.datePublished,
    authors:       ["EasyTradeSetup Editorial"],
    images:        [{ url: post.heroImage, width: 1200, height: 630, alt: post.heroAlt }],
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
              Beginner fundamentals &middot; Context before signals
            </div>
            <h1 className="font-display font-semibold text-ink leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}>
              Trading course for beginners —{" "}
              <span className="grad-text">five concepts before you look at a signal.</span>
            </h1>
            <p className="mt-6 text-ink-60 leading-relaxed" style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)" }}>
              Most courses teach entries. None teach context — the regime, structure, and key levels that decide whether the entry belongs on the chart in the first place.
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
            <div
              className="rounded-lg overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--c-rule, rgba(255,255,255,0.08))",
              }}
            >
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
              Golden Indicator on NIFTY &middot; regime, structure, and key levels in a single bar-close view
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
                Entries without context have near-zero expected value. Five concepts come before any signal matters: reading the
                regime, marking structure, identifying key levels, sizing the risk, and building a repeatable checklist. Nail
                these five and most indicator outputs start to make sense. Skip them and every new indicator is just a different
                way to lose money at a higher speed.
              </p>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="container-wide mt-10 sm:mt-14">
          <div className="blog-prose">
            <p>
              The typical beginner&apos;s path looks like this. Buy an indicator, maybe a course with an entry checklist. Place ten
              trades following the rules exactly. Lose money on six. Conclude the indicator doesn&apos;t work and buy a different
              one. Repeat until the account is smaller or the trader gives up.
            </p>

            <p>
              The indicator is usually fine. The problem is that entries without context are approximately coin flips. A
              pullback entry in a trending market is a high-expectancy setup. The same pullback entry in a ranging market is a
              fade setup that hasn&apos;t decided which direction to fail in. The entry is identical — the outcome distribution
              is opposite.
            </p>

            <p>
              What decides which one you&apos;re in is not the indicator. It&apos;s the five concepts that come before the indicator
              fires. This piece covers those five in the order they matter, with a worked example and a 90-day practice
              structure at the end.
            </p>

            <h2>What most trading courses get wrong</h2>

            <p>
              Most trading courses for beginners teach pattern recognition: cup and handle, MACD crossover, RSI oversold
              bounce. The patterns are real — they do occur, and some have positive expectancy in the right conditions.
            </p>

            <p>
              The missing clause is &quot;in the right conditions.&quot; A head-and-shoulders pattern in a trending market is
              continuation, not reversal. An RSI oversold reading in a strong downtrend is momentum confirmation, not a bounce
              trigger. The pattern is technically present; the context read is absent.
            </p>

            <p>
              Teaching entries before regime is like teaching a surgeon to make an incision before teaching them to read the
              imaging. The mechanical skill is real — the prior judgment is what makes it safe. The five concepts below are
              that prior judgment.
            </p>

            <h2>Concept 1 — read the regime before the entry</h2>

            <p>
              The market is always in one of three regimes: trending, ranging, or compressing. Each demands a different
              playbook and rejects the others.
            </p>

            <ul>
              <li>
                <strong>Trending</strong> — price stacks directional swing highs and lows, volume confirms direction, pullbacks
                are shallow. Continuation setups work. Fade setups fail.
              </li>
              <li>
                <strong>Ranging</strong> — price oscillates between defined bounds, both sides get rejected, no directional
                bias. Boundary setups work. Continuation setups get stopped at the opposite wall.
              </li>
              <li>
                <strong>Compressing</strong> — higher lows and lower highs converging, ATR contracting, volume tapering.
                Neither continuation nor boundary setups have edge here. The market is loading for an expansion and has not
                yet declared direction.
              </li>
            </ul>

            <p>
              Regime classification is the first decision — before looking at any indicator output, any entry pattern, any
              news. Ask: what sequence of swings do I see in the last five to eight bars on my primary timeframe? That sequence
              answers the regime question.
            </p>

            <p>
              The mechanics — three tells that classify the regime with a checklist — are covered in the{" "}
              <Link href="/blog/trend-vs-range-trading">trend vs range article</Link>. Read that alongside this one if you
              want the structural detail.
            </p>

            <h2>Concept 2 — mark your structure</h2>

            <p>
              Structure is the sequence of swing highs and lows. Two signals inside that sequence matter for decision-making:
            </p>

            <ul>
              <li>
                <strong>Break of Structure (BOS)</strong> — a swing high or low exceeded in the direction of the existing
                trend. Confirms regime continuation. In an uptrend, a BOS above the prior swing high says the trend is intact.
              </li>
              <li>
                <strong>Change of Character (CHoCH)</strong> — a swing high or low exceeded against the direction of the
                existing trend. First warning that regime may be shifting. In an uptrend, a CHoCH below the prior swing low
                says the trend is weakening — not a reversal confirmation, a flag.
              </li>
            </ul>

            <p>
              Neither BOS nor CHoCH is a trade signal on its own. They are structural reads. A BOS into a prior liquidity zone
              is a higher-probability continuation entry. A CHoCH at a key level is a potential reversal entry — but only
              after the regime has reclassified, not on the first CHoCH alone.
            </p>

            <p>
              Beginning traders often draw too many swings. Three to five clear swing points on the primary timeframe is
              enough. More than seven is noise, not information.
            </p>

            <h2>Concept 3 — know your key levels</h2>

            <p>
              Price has memory at certain levels more than others. The reason is not technical mysticism — institutional order
              books cluster at round numbers, previous session boundaries, and prior liquidity zones. These are the levels
              every professional desk has on their screen.
            </p>

            <p>Four levels that update automatically and matter consistently:</p>

            <ul>
              <li>
                <strong>PDH / PDL</strong> — Previous Day High and Low. The most-watched intraday boundaries across equity,
                forex, and commodity markets.
              </li>
              <li>
                <strong>PWH / PWL</strong> — Previous Week High and Low. Often the boundary for swing trades and the
                re-test level after breakouts.
              </li>
              <li>
                <strong>Monthly open</strong> — Acts as a macro pivot. Frequently referenced by institutional desks for
                longer-term positioning.
              </li>
              <li>
                <strong>Unfilled supply and demand zones</strong> — Imbalance zones where aggressive order flow entered
                previously. Price tends to revisit and react at these before moving through.
              </li>
            </ul>

            <p>
              These levels are self-updating — yesterday&apos;s PDH becomes today&apos;s reference; next week&apos;s open
              updates the PWH/PWL. You do not need to redraw them. NIFTY traders can see how these levels behave in practice
              on the <Link href="/indicator/nifty">NIFTY indicator page</Link>.
            </p>

            <p>
              A rejection at PDH is more predictive than a rejection at a hand-drawn trendline because PDH is the level
              everyone is watching. Trendlines are private; PDH is public information.
            </p>

            <h2>Concept 4 — size the risk before the signal</h2>

            <p>
              Risk sizing is taught last in most courses and should be taught first. Compounding requires consistency of
              account survival. You cannot compound from zero.
            </p>

            <p>
              The baseline rule is 1% risk per trade — meaning if the trade hits your stop, you lose 1% of the account. Not
              1% of the trade value; 1% of the total account.
            </p>

            <p>The R-multiple framework formalises this:</p>

            <ul>
              <li>
                Define 1R — the maximum amount you will lose if the trade fails. This is your stop distance expressed in
                account currency.
              </li>
              <li>
                Target a minimum of 2R — the trade only makes sense if the potential win is at least twice what you risk.
              </li>
              <li>
                Your position size is derived from 1R divided by the stop distance in price points. The maths forces the
                right position size; you do not choose it by feel.
              </li>
            </ul>

            <p>
              Illustrative example using round numbers — not a recommendation or prediction of any outcome:
            </p>

            <p>
              Account: $10,000. One percent risk = $100. A setup on SPX has a stop 20 points away from entry. Position
              size = $100 ÷ $20 per point = 5 units. Target is 60 points away — 3R. If the target is reached: +$300. If the
              stop hits: -$100. Risk is always $100 regardless of which market or instrument. The maths, not the mood,
              decides size.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              The example above uses simplified arithmetic for illustration. Real position sizing must account for commission,
              spread, slippage, and your broker&apos;s exact margin structure. Always verify your position calculator outputs
              against your broker&apos;s requirements before trading. The 1% guideline is a general principle, not a guarantee
              of any outcome. Trading carries risk of substantial loss including total capital.
            </div>

            <h2>Concept 5 — build a repeatable process</h2>

            <p>
              Entries, stops, and targets are decisions. Decisions under real-time pressure with live capital degrade in
              quality unless anchored to a written checklist. The checklist replaces willpower with procedure.
            </p>

            <p>Five questions before every trade:</p>

            <ol>
              <li>
                What is the current regime on the primary timeframe — trend, range, or compression?
              </li>
              <li>
                What does the structural sequence show — BOS or CHoCH on the last swing?
              </li>
              <li>
                Is the entry near a key level — PDH, PDL, supply zone, demand zone?
              </li>
              <li>
                Where is the stop and what is 1R in account currency?
              </li>
              <li>
                What is the minimum target in R — is this trade at least 2R?
              </li>
            </ol>

            <p>
              Any trade that cannot answer all five should not be taken. Not &quot;probably fine to skip one&quot; — not taken.
            </p>

            <p>
              The checklist produces a journal entry automatically. You have the regime read, the structural context, the key
              level, the 1R, and the target on record before the trade opens. After the trade closes, add the outcome in R and
              one sentence on what you learned. Three fields, 60 seconds. After 50 trades that log is the most valuable data
              you own — far more useful than any course or indicator.
            </p>

            <h2>What an indicator can actually do for a beginner</h2>

            <p>
              Once the five concepts are manual habits, a well-built indicator speeds up the context read rather than
              replacing the judgment.
            </p>

            <p>
              The problem with most entry-first indicators is that they deliver a signal — a green arrow, an alert — without
              regime context. The beginner sees the arrow, takes the trade, and loses because the regime was wrong for that
              setup. The indicator was technically correct; the context was absent.
            </p>

            <p>
              A decision-layer indicator works differently. It classifies the regime on the chart, marks BOS and CHoCH on the
              structural sequence, draws PDH/PDL/PWH/PWL automatically, and tags supply and demand zones at reactive levels.
              The trader reads all five foundational concepts in two seconds rather than five minutes. The judgment is still
              theirs — the tool compresses the preparation time.
            </p>

            <p>
              That is the principle behind what we built: regime first, structure second, signals never. If you want to see
              what a completed context view looks like on a real chart before committing to anything, the{" "}
              <Link href="/sample">free chart sample</Link> shows the full decision layer without a paywall.
            </p>

            <h2>A 90-day practice structure</h2>

            <p>
              Ninety days is not a timeline to profitability. It is the minimum sample size needed to evaluate a process. Less
              than 30 trades is opinions. Thirty to 50 trades is signal. Above 50 you have data.
            </p>

            <ul>
              <li>
                <strong>Weeks 1–2: chart replay, no live money.</strong> Use TradingView bar-replay mode on historical charts.
                Label the regime, mark structure, identify key levels. Do this on 20 charts before placing anything. The goal
                is to develop a visual vocabulary — trending, ranging, and compressing should feel immediately distinct, not
                debatable.
              </li>
              <li>
                <strong>Weeks 3–4: paper trades.</strong> Apply the five-question checklist to live market hours without live
                capital. Record regime, entry reason, 1R, and target for every trade. Track outcomes in R, not in currency.
                The money numbers are noise at this stage.
              </li>
              <li>
                <strong>Months 2–3: minimum position live account.</strong> Trade the smallest position size your broker
                allows. The point is to experience real P&amp;L emotion at low cost, not to make meaningful income. Track R
                and hit rate. After 30 trades you have a real sample. Before 30, you have anecdotes.
              </li>
            </ul>

            <p>
              The target at the end of 90 days is not a particular profit — it is a written process with 30–50 logged trades,
              an R-expectancy calculation, and a list of the three most common process violations you committed. That is the
              asset. The early P&amp;L is tuition.
            </p>

            <h2>Worked example — three trades, same week, three different outcomes</h2>

            <p>
              Educational. Outcomes are illustrative — not statements about any historical session or recommendations to take
              any position.
            </p>

            <p>
              <strong>Monday.</strong> NIFTY opens and stacks two consecutive higher highs on the 15-minute chart. ATR is 1.4×
              the 20-day average. Volume confirms on each expansion bar. Trending regime, three-tell confirmation. A
              pullback-to-VWAP long taken at the prior BOS level targets the next swing high — 2.8R. The checklist clears all
              five questions. The trade matches the regime.
            </p>

            <p>
              <strong>Wednesday.</strong> NIFTY opens flat. After the first 45 minutes, price oscillates in a 30-point band.
              ATR is 0.65× the 20-day average. Volume is mixed, no directional bias. Structural sequence: HH-LL-HH-LL inside
              the band. Ranging regime. A pullback-to-VWAP long is taken — same entry as Monday. The stop is hit because there
              is no trend to continue into. The setup was correct for a trending market; the regime was not trending. Question
              1 on the checklist would have blocked this trade.
            </p>

            <p>
              <strong>Friday.</strong> NIFTY is dead quiet before the close. ATR is 0.5× the 20-day average. Structural swings
              are converging — lower highs, higher lows. Compression regime. No trade is taken. The compression resolves with
              a 45-point expansion into the close. The trader who waited for a confirmed BOS after the break takes the follow
              continuation long in the new trend regime. The avoided Friday morning trade was the right call.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              The above example uses approximated NIFTY price action for teaching purposes. Specific levels, percentages, and
              outcomes are illustrative — not statements about any historical session or recommendations to take any specific
              trade. Past results, including illustrative examples, do not predict future performance.
            </div>

            <h2>FAQ</h2>

            <h3>How long does it take to become consistently profitable trading?</h3>
            <p>
              There is no universal answer. Most traders who reach consistent profitability do so after 1–3 years of
              deliberate practice with real capital at risk. The key variable is not time — it is quality of feedback. A
              trader who journals every trade and reviews it weekly learns faster than one who trades for years without a log.
              Prioritise the feedback loop quality over account growth speed.
            </p>

            <h3>Should I start with paper trading or a live demo account?</h3>
            <p>
              Paper trading eliminates the emotional component of loss, which is useful for learning mechanics but misleading
              for learning decision-making under pressure. The best sequence is: chart replay (mechanics) → demo or paper
              (process discipline) → minimum live position (real pressure at low financial stake). Do not stay in demo for
              more than four to six weeks. The lessons that matter require real loss at stake — even a small amount.
            </p>

            <h3>How many indicators should a beginner use on one chart?</h3>
            <p>
              One, and only after the five foundational concepts are manual habits. The purpose of an indicator is to speed up
              a read you already know how to make by hand. If you cannot manually classify the regime, mark structure, and
              identify key levels without a tool, adding an indicator compounds confusion rather than reducing it. One
              indicator. Understand exactly what it reads and what it does not read before trusting any output from it.
            </p>

            <h3>Which market should a beginner learn first — NIFTY, SPX, gold, or BTC?</h3>
            <p>
              Trade the market whose primary session you can watch live. NIFTY F&amp;O runs 9:15–15:30 IST. SPX cash opens
              at 9:30 ET. Gold is near-24-hour but most liquidity is in the London–New York overlap. BTC never closes. The
              market matters less than being present during its high-liquidity window. Choose the one that fits your timezone,
              stick to it for at least three months, and only add a second instrument after your process is documented and
              your 30-trade sample is logged.
            </p>

            <h3>What is the single biggest mistake beginner traders make?</h3>
            <p>
              Changing the system after every losing trade. A process with a 50% hit rate and an average winner of 2R has
              positive expectancy — but it will produce four or five consecutive losses regularly. Beginners interpret a
              losing streak as evidence the system is broken and switch. Switching resets the sample to zero. The losing
              streak was inside the expected distribution; the next five trades could have been winners. Commit to a minimum
              30-trade sample before evaluating any system change. The sample, not the streak, is the signal.
            </p>

            <h2>Closing</h2>

            <p>
              A trading course for beginners that starts at entries is starting at the fourth step. Regime, structure, key
              levels, sizing, and process — these five are the prior steps. Get them in order before any entry rule or
              indicator output and those rules and outputs start to make sense on their own terms.
            </p>

            <p>
              The trader who survives the first year is not the one with the cleverest entries. It is the one who read the
              regime correctly before each trade, sized consistently at 1R, and built a log of real trades to learn from.
              That is the foundation. Everything compound-able sits on top of it.
            </p>

            <p>
              When you are ready to add a tool to the process, the{" "}
              <Link href="/sample">free chart sample</Link> shows the decision layer on a real chart. The{" "}
              <Link href="/product">bundle page</Link> covers everything included: indicator, Trade Logic PDF (eight setups
              with explicit triggers, stops, and exits), risk calculator, and daily market notes. One-time payment, no
              subscription. The <Link href="/checkout">checkout page</Link> has the current offer.
            </p>
          </div>
        </section>

        {/* IN-BODY CTA CARD */}
        <section className="container-wide mt-12 sm:mt-16">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="glass-card p-6 sm:p-8">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">
                Context before signals
              </div>
              <h3
                className="font-display font-semibold leading-[1.25] text-ink mb-3"
                style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}
              >
                Golden Indicator — regime, structure, key levels on every chart.
              </h3>
              <p className="text-[14px] sm:text-[15px] text-ink-60 leading-[1.6] mb-5">
                Bar-close logic. Auto-classifies regime. Marks structural swings (BOS / CHoCH). Draws PDH / PDL / PWH / PWL.
                Supply &amp; demand zones tagged at reactive levels. Bundle includes the Trade Logic PDF (eight setups with
                explicit triggers, stops, exits), risk calculator, daily market notes, lifetime updates. One-time payment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                <Link href="/sample" className="btn btn-outline w-full sm:w-auto justify-center">
                  Skim the free sample
                </Link>
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
          <div
            className="mx-auto pt-6 border-t border-rule font-mono text-[10.5px] uppercase tracking-widest text-ink-40 flex flex-wrap gap-x-4 gap-y-1"
            style={{ maxWidth: 680 }}
          >
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
                EasyTradeSetup is not a registered investment adviser or research analyst in any jurisdiction. Past results do
                not predict future performance. Worked examples and price references are illustrative for teaching, not
                recommendations to take any specific trade.
              </p>
            </div>
          </div>
        </section>

        {/* READ NEXT */}
        <section className="container-wide pb-12 sm:pb-20">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-3">Read next</div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <Link
                href="/blog/trend-vs-range-trading"
                className="glass-card-soft p-5 block hover:-translate-y-0.5 transition-transform"
                style={{ textDecoration: "none" }}
              >
                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">Regime classification</div>
                <div className="text-[14.5px] sm:text-[16px] text-ink font-semibold leading-[1.3]">
                  Trend vs range trading — the decision behind every other decision.
                </div>
              </Link>
              <Link
                href="/blog/are-paid-trading-signals-worth-it"
                className="glass-card-soft p-5 block hover:-translate-y-0.5 transition-transform"
                style={{ textDecoration: "none" }}
              >
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
