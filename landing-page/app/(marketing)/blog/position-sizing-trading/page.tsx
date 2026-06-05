import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPost } from "@/lib/blog";
import Price from "@/components/ui/Price";

const SLUG = "position-sizing-trading";
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
              Risk management &middot; Position sizing
            </div>
            <h1 className="font-display font-semibold text-ink leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}>
              Position sizing in trading —{" "}
              <span className="grad-text">the variable that decides your survival.</span>
            </h1>
            <p className="mt-6 text-ink-60 leading-relaxed" style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)" }}>
              Most retail traders optimise their entries. Position sizing is the variable that actually
              decides whether they survive the losing streaks every strategy delivers.
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
              Golden Indicator on BANKNIFTY &middot; swing structure marked — the same levels that anchor stop placement
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
                Your entry, stop, and target are on the chart. Your position size is a choice — and it is the
                only choice that determines whether a losing run wipes you out or leaves you in the game.
                The R-multiple framework converts &ldquo;how much?&rdquo; from a feeling into a formula:
                stop distance in points, risk amount in cash, size in contracts or lots.
                Regime read first, then size. That order matters.
              </p>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="container-wide mt-10 sm:mt-14">
          <div className="blog-prose">
            <p>
              Most retail trade postmortems blame the entry or the stop. The candle blew through support.
              The fill was late. The market reversed at the exact wrong moment. Almost none of the postmortems
              land on the real culprit: the trader risked too much on a single trade and had no room to absorb
              the normal variance every strategy produces.
            </p>

            <p>
              Entry, stop, and target live on the chart. A decent reading of market structure gets you
              close enough on all three. Position size is different. It is a choice made entirely off the
              chart, in advance, by you. It is the only variable in every trade that is completely within
              your control — and it is the one most retail traders set by feel rather than by formula.
            </p>

            <p>
              This piece covers the R-multiple framework for position sizing, the three-step formula that
              produces the number, how regime changes the sizing decision, and the three mistakes that drain
              accounts slowly enough that traders rarely notice until the damage is done.
            </p>

            <h2>What an R-multiple is</h2>

            <p>
              R stands for the cash amount you risk on a single trade — your &ldquo;one R.&rdquo;
              If you risk $100 and the trade hits 3× that distance in profit, you made 3R.
              If the stop is hit, you lose 1R. If you close at half the stop distance, you lose 0.5R.
            </p>

            <p>
              R is useful because it normalises trades across different markets and different stop distances.
              A $200 winner on a trade where you risked $50 is a 4R win.
              A $200 winner on a trade where you risked $200 is a 1R win.
              Same dollar gain, very different outcome relative to what was at risk.
            </p>

            <p>
              Expectancy — the number that decides whether a strategy makes money over time — is calculated from R:
            </p>

            <ul>
              <li>
                <strong>Expectancy = (Win rate × Avg win R) − (Loss rate × Avg loss R)</strong>
              </li>
            </ul>

            <p>
              A strategy with a 40% win rate and a 2.5R average winner has positive expectancy:
              (0.40 × 2.5) − (0.60 × 1.0) = 1.0 − 0.6 = +0.4R per trade.
              That is a workable edge. Most retail traders know their win rate roughly.
              Almost none track their average R — so they have no idea whether their strategy has positive expectancy
              or whether they have just been lucky.
            </p>

            <h2>The three-step position sizing formula</h2>

            <p>
              The formula is three steps. You run them before you place the order, not after.
            </p>

            <h3>Step 1 — define the stop distance</h3>

            <p>
              The stop goes at the level where the trade thesis is wrong — below the swing low for a long,
              above the swing high for a short. Measure the distance from entry to stop in points (or pips, or ticks).
              This is your stop distance. Do not round it.
            </p>

            <h3>Step 2 — set the risk amount</h3>

            <p>
              Decide the maximum cash you will lose if the stop hits. This is your 1R for this trade.
              Most working frameworks use 0.5–2% of total account equity per trade, with 1% as a common starting point
              for traders still building their track record.
              The percentage is not sacred — what matters is that you can absorb 10 consecutive losses at this level
              without hitting a drawdown that affects your decision-making.
            </p>

            <h3>Step 3 — calculate the size</h3>

            <p>
              <strong>Size = Risk Amount ÷ Stop Distance</strong>
            </p>

            <p>
              If your risk amount is $100 and your stop is 20 points away, your size is $5 per point
              (or 2 micro-lots if each micro-lot is $1 per point, etc.).
              The formula is the same regardless of the instrument — adjust the denomination to match how the
              instrument is quoted.
            </p>

            <h2>Worked example — illustrative</h2>

            <p>
              <em>
                The following is a simplified illustrative example for teaching the formula.
                It does not represent any historical trade or session. Past results do not predict future performance.
              </em>
            </p>

            <p>
              A trader sees a BANKNIFTY pullback into a demand zone after a structural break of structure.
              The zone base is at 52,300. The swing low that created the zone is at 52,150. The entry trigger
              fires at 52,340. The stop is placed 10 points below the zone base at 52,290.
            </p>

            <ul>
              <li><strong>Entry:</strong> 52,340</li>
              <li><strong>Stop:</strong> 52,290 (50-point stop distance)</li>
              <li><strong>Account equity:</strong> ₹5,00,000</li>
              <li><strong>Risk per trade:</strong> 1% = ₹5,000</li>
              <li><strong>Size:</strong> ₹5,000 ÷ 50 = ₹100 per point</li>
            </ul>

            <p>
              If BANKNIFTY moves 150 points in favour, the trade returns ₹15,000 = 3R.
              If the stop hits, the loss is exactly ₹5,000 = 1R.
              The trader knows the outcome range before clicking.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              The example uses approximated levels and outcomes for teaching purposes. Actual BANKNIFTY tick
              values, lot sizes, and brokerage costs change the real P&amp;L. Options positions have non-linear
              payoff profiles — the formula above applies directly to futures, CFDs, and spot instruments.
              For options, risk is capped at premium paid (long) or theoretically unlimited (short naked) — account
              for this difference separately. Trading carries risk of substantial loss including total capital.
            </div>

            <h2>How regime changes your sizing</h2>

            <p>
              The formula gives you a number. The regime tells you whether to use that number, halve it, or not trade.
            </p>

            <p>
              <strong>Trending regime.</strong> Structural stop sits further from entry — below the pullback low in an
              uptrend, which may be 50–100 points away. But the target is also further — the next structural swing high.
              The R:R is often 2.5–4R. Take full calculated size. The regime supports the target.
            </p>

            <p>
              <strong>Ranging regime.</strong> Stop is tighter (boundary entry, so the invalidation is the boundary
              break). Target is closer (the opposite boundary). R:R is typically 1.5–2R — workable but not exceptional.
              Full calculated size is appropriate if the range boundaries are clean.
            </p>

            <p>
              <strong>Compression regime.</strong> Any stop placed inside the compression structure will get hit before
              the expansion fires. You do not know the direction of the expansion. Reduce size to 25–50% of calculated,
              or sit out entirely until the expansion candle closes and the direction is confirmed.
              The lost opportunity cost of waiting is lower than the expected loss of entering compression at full size.
            </p>

            <p>
              The regime read — trending, ranging, or compressing — is the first question. Sizing is the second.
              Reverse that order and the formula breaks down.
            </p>

            <h2>ATR as a stop-distance reference</h2>

            <p>
              ATR (Average True Range) gives you the typical bar size for the instrument and timeframe.
              It is a useful sanity check on stop distance: if your structural stop is tighter than 1× ATR,
              it is likely to be hit by noise before the trade has room to develop.
            </p>

            <p>
              A common ATR-based stop rule: <strong>stop = structural level − 1.5× ATR</strong>.
              The 1.5× multiplier absorbs normal volatility without pushing the stop so far that the R:R collapses.
            </p>

            <p>
              On a 15-minute NIFTY chart, if ATR is 35 points and your structural low is 40 points below entry,
              your ATR-adjusted stop might sit at 52 points (structural low − 12 extra points). The size
              calculation then uses 52 as the stop distance, not 40. This is how ATR and structure combine —
              structure gives the level, ATR gives the buffer.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              ATR is a lagging measure. Volatility can expand suddenly during macro events, earnings releases, or
              policy announcements — real moves will exceed the ATR buffer in those sessions.
              On high-volatility days, widen the ATR multiplier or reduce position size before checking ATR.
            </div>

            <h2>The three sizing mistakes that drain accounts slowly</h2>

            <ul>
              <li>
                <strong>Flat lot sizing regardless of stop distance.</strong>
                Trading 2 lots every trade regardless of whether the stop is 10 points or 80 points means
                risk varies 8× across trades. A 10-point stop feels safe. An 80-point stop on the same 2 lots
                is 8R risk. One of those stops hitting costs as much as eight &ldquo;normal&rdquo; losses.
                The formula eliminates this.
              </li>
              <li>
                <strong>Oversizing after a winning run.</strong>
                A five-trade winning streak feels like skill confirming itself. It is also the exact moment
                when many traders double their size — right before mean reversion in their hit rate arrives.
                Winning streaks do not change the underlying expectancy. Size stays fixed until there is a
                statistically meaningful track record (minimum 200 trades) suggesting expectancy has genuinely improved.
              </li>
              <li>
                <strong>Undersizing to avoid further losses after a drawdown.</strong>
                This one is counterintuitive. After a losing run, traders often reduce size to &ldquo;protect
                the account.&rdquo; But a strategy with positive expectancy recovers faster at correct size
                than at half size. Halving the size after a drawdown also halves the recovery speed —
                the trader digs a smaller hole but climbs out at half pace.
                The correct response to a normal drawdown is no size change. The correct response to a
                drawdown that suggests the strategy has stopped working is to stop trading and diagnose, not to shrink size.
              </li>
            </ul>

            <h2>What a chart tool can actually help with</h2>

            <p>
              The formula is arithmetic. You can run it manually in your head or with a spreadsheet.
              What a serious chart tool helps with is the inputs: structural swing levels are marked for you,
              so the stop placement is fast. The regime is classified bar by bar, so you know before sizing
              whether you are in a trend, range, or compression. ATR is calculated automatically in the sub-pane.
            </p>

            <p>
              That is the upstream problem most sizing mistakes trace back to — not bad arithmetic, but slow or
              wrong inputs. See the <Link href="/sample">free chart sample</Link> to look at how regime
              classification and structural levels appear on a real chart, then read the
              <Link href="/product"> full bundle</Link> to see the sizing maths in the Trade Logic PDF.
            </p>

            <h2>FAQ</h2>

            <h3>What percentage should I risk per trade?</h3>
            <p>
              There is no universal answer. 1% per trade is a common starting point for traders still building
              a track record — it allows 100 consecutive full losses before account ruin, which is more runway
              than any viable strategy should need. Traders with a verified positive-expectancy track record
              over 200+ trades sometimes move to 1.5–2%. Above 2% per trade concentrates risk to the point
              where a normal losing run creates account-threatening drawdowns.
            </p>

            <h3>How do I calculate position size for NIFTY options?</h3>
            <p>
              For long options (buying calls or puts), risk is capped at the premium paid — so risk per trade
              is simply the number of contracts × lot size × premium per lot.
              If a NIFTY call premium is ₹80, one lot is 25 units, and you want to risk ₹2,000:
              max contracts = ₹2,000 ÷ (25 × ₹80) = 1 lot. For short options, risk is theoretically unlimited —
              margin requirements, not the R formula, govern the exposure. The <Link href="/indicator/nifty">NIFTY page</Link> has
              additional context on lot sizes.
            </p>

            <h3>What is a good R:R ratio for a trade?</h3>
            <p>
              The minimum useful R:R is determined by your win rate. A 40% win rate needs at least 1.5R average
              winner to break even. A 50% win rate needs 1.0R average winner.
              Most working intraday strategies sit in the 2–3R target range with 40–50% hit rates.
              Chasing 5R or 10R targets raises R but collapses hit rate — the expectancy arithmetic works out
              roughly the same at similar loss rates.
            </p>

            <h3>Does position sizing apply to intraday trading?</h3>
            <p>
              The formula is instrument and timeframe agnostic. For intraday NIFTY or BANKNIFTY futures,
              run the exact same calculation before each trade: stop distance in points, risk amount in rupees,
              size in lots. The only intraday-specific adjustment is that ATR should be measured on the same
              timeframe as the entry — using daily ATR to size a 5-minute trade gives you a number that is
              too wide for the timeframe.
            </p>

            <h3>Should I use ATR-based stops or fixed-point stops?</h3>
            <p>
              ATR-based stops adapt to current volatility — they widen on high-volatility days and tighten
              on low-volatility days, keeping the stop relationship to market noise roughly constant.
              Fixed-point stops are simpler but can be too tight on volatile days (getting stopped by noise)
              and too wide on quiet days (poor R:R). ATR-based is generally the better default;
              fixed-point is acceptable when the market has a known daily range (e.g. NIFTY in compression).
            </p>

            <h2>Closing</h2>

            <p>
              Every other trading decision — entry, target, timeframe, setup selection — matters less than
              position sizing over a large enough sample. The trader who enters a tick late but sizes correctly
              outperforms the trader with a perfect entry who oversizes by 3×.
              That is not intuitive. It becomes obvious after the first proper drawdown.
            </p>

            <p>
              The formula is three steps and takes thirty seconds. Run it before every trade,
              not after. Regime first — then size. The chart gives you the levels.
              The formula gives you the number.
              If you want to see the structural levels and regime classification that feed the stop placement
              calculation, the <Link href="/sample">free chart sample</Link> is the fastest way in.
              For the full sizing rules, eight setup triggers, and the stops-and-exits framework,
              the <Link href="/product">bundle</Link> has the Trade Logic PDF.
            </p>
          </div>
        </section>

        {/* IN-BODY CTA CARD */}
        <section className="container-wide mt-12 sm:mt-16">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="glass-card p-6 sm:p-8">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">
                Regime first — then size
              </div>
              <h3 className="font-display font-semibold leading-[1.25] text-ink mb-3" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}>
                Golden Indicator — regime, structure, and key levels. The inputs your size formula needs.
              </h3>
              <p className="text-[14px] sm:text-[15px] text-ink-60 leading-[1.6] mb-5">
                Bar-close logic. Auto-classifies regime. Marks structural swings (BOS / CHoCH). Draws PDH / PDL / PWH / PWL.
                Supply &amp; demand zones tagged at reactive levels.
                Bundle includes the Trade Logic PDF (eight setups with explicit triggers, stops, exits), risk calculator,
                daily market notes, lifetime updates. One-time payment.
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
              <Link href="/blog/are-paid-trading-signals-worth-it" className="glass-card-soft p-5 block hover:-translate-y-0.5 transition-transform" style={{ textDecoration: "none" }}>
                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">Risk math</div>
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
