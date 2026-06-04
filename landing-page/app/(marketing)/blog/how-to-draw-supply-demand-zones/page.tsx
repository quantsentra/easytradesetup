import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPost } from "@/lib/blog";
import Price from "@/components/ui/Price";

const SLUG = "how-to-draw-supply-demand-zones";
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
              Key levels &middot; Supply &amp; demand
            </div>
            <h1 className="font-display font-semibold text-ink leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}>
              How to draw supply and demand zones — <span className="grad-text">the three-part structure every valid zone needs.</span>
            </h1>
            <p className="mt-6 text-ink-60 leading-relaxed" style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)" }}>
              Most traders draw S&amp;D zones at the wrong candle. The zone is not the reversal tip — it is the base
              consolidation before the impulse. Get that distinction right and the zones stop moving your entry into the
              middle of nobody&apos;s order flow.
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
              Golden Indicator on BANKNIFTY &middot; supply &amp; demand zones auto-tagged at reactive levels
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
                Supply and demand zones mark the base consolidation before a strong impulse move — not the reversal tip.
                Every valid zone has three parts: impulse, base, impulse (IBI). Draw the zone boundaries around the base candles,
                grade the zone by how many times price has revisited it, and only trade zones that align with the current regime.
                Fresh zones in trending regimes are the highest-probability context.
              </p>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="container-wide mt-10 sm:mt-14">
          <div className="blog-prose">
            <p>
              Most retail traders who claim to trade supply and demand zones are actually trading horizontal support and
              resistance lines. They draw a line at the wick tip of the last high or the exact body of the last reversal
              candle — and they wonder why price keeps slipping through their level by five to ten ticks before reversing.
            </p>

            <p>
              Those aren&apos;t supply and demand zones. They&apos;re price-reversal markers. Supply and demand zones sit upstream
              of the reversal: at the base consolidation that preceded the impulse move away from the level. That&apos;s where
              unfilled orders from the original imbalance are most likely to rest — and that&apos;s where price is most likely
              to react when it returns.
            </p>

            <p>
              This piece covers the mechanics of drawing them correctly: the three-part structure, how to set the zone
              boundaries, how to grade a zone by freshness, and how regime context decides whether a zone is worth trading
              at all.
            </p>

            <h2>Supply zones versus resistance lines — the real difference</h2>

            <p>
              A resistance line is drawn at the high of the candle where price turned down. It is a single horizontal level
              marking a historical reversal point.
            </p>

            <p>
              A supply zone is drawn around the base candles that appeared just before the strong move down. It is a range —
              typically three to twelve ticks wide — marking where the original selling imbalance occurred.
            </p>

            <p>The distinction matters for two reasons:</p>

            <ul>
              <li>
                <strong>Order location.</strong> Institutional sell orders placed in the base are not executed at the exact
                reversal tip — they are spread across the consolidation. The zone catches that spread. A single line misses it.
              </li>
              <li>
                <strong>Entry precision.</strong> A properly drawn zone gives you a band to work with. Your entry sits inside
                the band, your stop sits just outside it. A resistance line forces a point entry that is either exact or missed.
              </li>
            </ul>

            <p>
              Neither approach is magic. Both fail when the underlying order flow has moved on. But the zone approach
              is structurally closer to where the actual imbalance occurred.
            </p>

            <h2>The three-part structure — IBI</h2>

            <p>
              Every valid supply or demand zone has three parts in sequence. If any part is missing, reconsider before
              drawing the zone.
            </p>

            <ol>
              <li>
                <strong>Impulse (departure leg).</strong> A strong directional move: two or more large bars in the same
                direction with small or minimal opposing wicks. The departure impulse is the evidence that real imbalance
                existed at this location. A slow drift is not an impulse.
              </li>
              <li>
                <strong>Base.</strong> A tight consolidation before the departure impulse. Two to six bars that overlap
                heavily — small bodies, contained high/low range. The base is where orders are likely resting. The tighter
                the base, the cleaner the zone.
              </li>
              <li>
                <strong>Impulse (or confirmation leg).</strong> For a distal zone type, you may also have a prior
                impulse leading into the base. This creates the full IBI sequence: price arrived with force, paused,
                then left with force. Both legs confirm that this base mattered to large participants.
              </li>
            </ol>

            <p>
              Demand zones sit at the base of a move up. Supply zones sit at the base of a move down. The only difference
              is direction.
            </p>

            <h2>How to draw the zone boundaries</h2>

            <p>
              Once you identify the base, you need two boundary lines:
            </p>

            <ul>
              <li>
                <strong>Proximal line</strong> — the boundary closest to where current price is trading. For a demand zone,
                this is the high of the base candles. For a supply zone, it is the low of the base candles.
              </li>
              <li>
                <strong>Distal line</strong> — the boundary farthest from current price. For a demand zone, this is the
                low of the lowest candle in the base. For a supply zone, the high of the highest candle in the base.
              </li>
            </ul>

            <p>
              Your entry should be at or near the proximal line. Your stop goes just beyond the distal line — a few ticks
              outside the zone, not at the zone edge. The logic: if price breaches the entire base, the original imbalance
              is consumed and the zone is no longer valid.
            </p>

            <p>
              One common mistake is drawing both lines from wick to wick rather than body to body. This inflates the zone
              and pushes the stop so far out that the R is poor. The cleaner method: draw the proximal line at the last
              body close before the departure impulse, and the distal line at the body low or high of the base, only
              extending to wick if the wick is more than 20% of the candle range.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              Zone boundaries are interpretive. Two traders looking at the same base candles will sometimes draw slightly
              different boundaries. The practitioner who is consistent in their method — whatever that method is — tends
              to outperform the practitioner who adjusts boundaries to fit a desired entry. Pick a rule and apply it the
              same way every time.
            </div>

            <h2>Grading zones by freshness</h2>

            <p>
              Not all zones are equally likely to react. Freshness grades the zone by how many times price has returned
              to it since it was formed.
            </p>

            <ul>
              <li>
                <strong>Untested (fresh).</strong> Price formed the zone and has not returned to the base since. All
                original orders are potentially still resting. Highest-probability context.
              </li>
              <li>
                <strong>Tested once.</strong> Price returned to the zone and reacted — moved away without breaching the
                distal line. Some orders were filled on the first return. The zone is still valid but slightly weaker.
              </li>
              <li>
                <strong>Tested twice or more.</strong> Each return fills more resting orders. By the third or fourth
                visit, the original imbalance is likely consumed and the zone should be considered expired or low-priority.
              </li>
              <li>
                <strong>Breached.</strong> Price closed beyond the distal line. The zone is broken. Do not trade it as
                a supply or demand zone. It may now act as the opposite (former supply becomes potential demand, and
                vice versa — the flip zone concept) but treat that as a new, separate zone formation.
              </li>
            </ul>

            <p>
              The practical rule: draw fresh zones and tested-once zones. Mark tested-twice zones as watch-only.
              Delete breached zones immediately — leaving them on the chart creates noise and false confirmation bias.
            </p>

            <h2>Regime context — why the same zone behaves differently on different days</h2>

            <p>
              A supply zone in a trending downmarket is a high-probability short entry context. The same supply zone
              in a ranging market is a boundary fade. The same supply zone in a compressing market is uncertain — the
              expansion may fire from the zone or blast through it.
            </p>

            <p>
              Zones do not exist independently of regime. The three-step check before entering a zone:
            </p>

            <ol>
              <li>What is the current regime? (Trend, range, or compression — see the structural sequence + ATR.)</li>
              <li>Is the zone aligned with the regime or against it?</li>
              <li>Is the zone fresh or tested?</li>
            </ol>

            <p>
              The highest-probability setup is a fresh zone aligned with the trending regime. A demand zone in an
              uptrend is a continuation trade — the regime pushes price toward the next supply zone, using demand zones
              as the pullback entry. A supply zone in a downtrend is the same pattern inverted.
            </p>

            <p>
              Fading a zone against the trend is a lower-probability trade. It can work at strong confluent levels but
              the regime creates a headwind. For every zone-against-trend entry that works, two others will see the zone
              breached as the trend continues.
            </p>

            <p>
              For a full treatment of regime classification — structural sequence, ATR, and volume — see the
              <Link href="/blog/trend-vs-range-trading"> trend vs range trading guide</Link>.
            </p>

            <h2>Worked example — BANKNIFTY intraday (illustrative)</h2>

            <p>Educational illustration. Past performance does not predict future performance.</p>

            <p>
              <strong>Setup:</strong> BANKNIFTY is in a confirmed downtrend on the 15-minute chart (LH-LL-LH-LL
              structural sequence, ATR 1.2× the 20-day). A supply zone was formed three sessions earlier when price
              based in a 180-point range for four candles before dropping 620 points in six bars. The zone has not been
              revisited since formation — it is fresh.
            </p>

            <p>
              <strong>Zone boundaries:</strong> Proximal line drawn at the low of the base candle bodies (approximately
              50,400 on BANKNIFTY, illustrative). Distal line drawn at the high of the base candle bodies (approximately
              50,580). Zone width: 180 points.
            </p>

            <p>
              <strong>Trade context:</strong> Price rallies into the zone during a pullback. The short entry is taken
              at the proximal line (50,400). Stop is placed 50 points above the distal line (50,630). The target is
              the prior structural swing low at 49,650 — a 750-point target. The illustrative R ratio: 750 / 230 = 3.3R.
            </p>

            <p>
              <strong>Why this trade has the checklist:</strong> Downtrend regime confirmed on the higher timeframe.
              Zone is fresh (first return). Entry is at the proximal line, not the midpoint. Stop is beyond the distal
              line, not at it. Target is the next structural level. Every element is defined before entry.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              The levels above are fabricated for illustration. No BANKNIFTY session is implied. Real positions require
              real-time confirmation of regime, zone freshness, and structural context — none of which can be reduced to
              a static example. Trading derivatives including BANKNIFTY options carries risk of total capital loss.
              This is educational content, not a recommendation to take any specific trade.
            </div>

            <h2>Common mistakes when drawing supply and demand zones</h2>

            <ul>
              <li>
                <strong>Drawing at the reversal tip, not the base.</strong> The zone is the consolidation before the
                impulse, not the candle that reversed. Tip-based zones put your entry where smart money already left.
              </li>
              <li>
                <strong>Zones that are too wide.</strong> A base that spans 15 candles and covers 400 points is not a
                zone — it is a range. Valid zones are tight: two to six base candles, well-contained boundaries.
              </li>
              <li>
                <strong>Trading breached zones.</strong> When price closes beyond the distal line, the zone is expired.
                Remove it. Leaving breached zones on the chart invites false confluence readings.
              </li>
              <li>
                <strong>Ignoring zone freshness.</strong> A zone tested four times that still holds is impressive —
                but statistically, each test reduces the probability of another reaction. Grade your zones.
              </li>
              <li>
                <strong>No regime check.</strong> A zone without a regime read is a level, not a trade context.
                The same supply zone behaves completely differently in a downtrend versus a range versus compression.
              </li>
              <li>
                <strong>Too many zones on the chart.</strong> If you have eight supply zones and six demand zones on
                a single chart, most of them are noise. Work from the highest-quality two or three per timeframe.
              </li>
            </ul>

            <h2>What a tool can do here</h2>

            <p>
              Manual zone drawing is the best way to learn the mechanics. Every trader should go through the exercise
              of identifying bases, setting proximal and distal lines, and grading freshness by hand — at least for
              the first hundred zones they mark.
            </p>

            <p>
              The downside: it takes five to ten minutes per chart and you will miss zones you didn&apos;t scroll back
              far enough to find. On a live intraday session with multiple instruments, the cognitive load is high.
            </p>

            <p>
              A well-built indicator solves the speed problem, not the judgement problem. It surfaces the zones;
              the trader still decides which ones match the current regime and warrant a position.
              That&apos;s the division of labour we built ours around — zone identification is automated, the trade
              decision stays with the person in the seat.
            </p>

            <p>
              If you want to see the zone layer on a real chart before reading further, the{" "}
              <Link href="/sample">free chart sample</Link> has the full output including supply/demand zones,
              regime classification, and structural swings in one view.
              The <Link href="/indicator/banknifty">BANKNIFTY-specific indicator notes</Link> cover how the zone
              sensitivity adapts to BANKNIFTY&apos;s higher volatility profile.
            </p>

            <h2>FAQ</h2>

            <h3>What is the difference between supply and demand zones and support and resistance?</h3>
            <p>
              Support and resistance lines mark historical price reversal points — the tips and bodies of reversal candles.
              Supply and demand zones mark the base consolidation before the impulse that created the level. Zones are
              typically drawn earlier (further from current price) and represent an area rather than a single line.
              In practice, zones tend to give wider entry windows and more reliable stop placement because they capture
              the range of the original order imbalance, not just the price where someone last changed their mind.
            </p>

            <h3>How many candles should be in a base to qualify as a zone?</h3>
            <p>
              Two to six candles is the practical range for intraday and swing timeframes. A single-candle base (a
              pin bar before an impulse) is a valid but aggressive zone — there is less order concentration in one
              candle than in a cluster. More than eight to ten overlapping candles starts to look like a range rather
              than a base, and the zone loses specificity. The ideal base is two to four tight candles with similar
              highs and lows before the departure leg.
            </p>

            <h3>How do I use supply and demand zones on TradingView?</h3>
            <p>
              On TradingView you can draw zones manually using the rectangle drawing tool. Set the upper boundary to
              the distal line and the lower boundary to the proximal line, then adjust fill opacity to about 20% so
              the zone is visible without obscuring price action. Label the zone with the date formed and whether
              it is fresh or tested. Alternatively, Pine Script indicators can identify and plot zones automatically
              from historical price structure — the{" "}
              <Link href="/product">Golden Indicator</Link> takes this approach, tagging zones at reactive levels
              and updating freshness on each bar-close.
            </p>

            <h3>Does this approach work for NIFTY and BANKNIFTY specifically?</h3>
            <p>
              Yes, though with one adjustment for BANKNIFTY. BANKNIFTY&apos;s higher ATR means valid zones tend to
              be wider in absolute point terms than NIFTY zones — the base candles will cover more ground. Don&apos;t
              compress the zone boundaries to force a tighter range; accept the wider zone and size the position
              accordingly so the stop beyond the distal line stays within your risk parameters.
              See the <Link href="/indicator/nifty">NIFTY indicator page</Link> and{" "}
              <Link href="/indicator/banknifty">BANKNIFTY indicator page</Link> for market-specific setup notes.
            </p>

            <h3>How do I know when a zone is no longer valid?</h3>
            <p>
              A zone is expired when price closes a bar beyond the distal line on the same timeframe you drew the zone
              on. A wick through the distal line is ambiguous — wait for a candle close. Once the close confirms the
              breach, remove the zone. Do not wait for price to come back and re-test the now-broken level hoping it
              flips into the opposite zone type; that flip zone concept requires a fresh confirmation structure before
              it is tradeable.
            </p>

            <h2>Closing</h2>

            <p>
              The mechanics of supply and demand zones are not complicated. Base identification, boundary placement,
              freshness grading, and regime alignment — four steps that most retail traders skip because they were
              never taught the distinction between a reversal marker and a structural zone.
            </p>

            <p>
              The consistent edge is not in finding zones that always hold. It is in trading the right zones in the
              right regime with the right stop logic — and discarding the rest without taking them. The trader who
              marks fewer zones, grades them honestly, and only enters at the proximal line with a clear distal-line
              stop will outperform the trader with twenty zones and no framework for choosing between them.
            </p>

            <p>
              For the regime-first layer that makes zone trading work, the{" "}
              <Link href="/blog/trend-vs-range-trading">trend vs range trading guide</Link> is the natural next read.
              For the full decision system built around zones, structure, and regime in a single chart tool, the{" "}
              <Link href="/product">bundle is here</Link>.
            </p>
          </div>
        </section>

        {/* IN-BODY CTA CARD */}
        <section className="container-wide mt-12 sm:mt-16">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="glass-card p-6 sm:p-8">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">
                Zones auto-tagged. Regime pre-classified.
              </div>
              <h3 className="font-display font-semibold leading-[1.25] text-ink mb-3" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}>
                Golden Indicator — supply &amp; demand zones, structure, and regime in one bar-close view.
              </h3>
              <p className="text-[14px] sm:text-[15px] text-ink-60 leading-[1.6] mb-5">
                Automatically identifies and tags supply and demand zones at reactive levels. Marks structural
                swings (BOS / CHoCH). Auto-classifies regime. Draws PDH / PDL / PWH / PWL.
                Bundle includes the Trade Logic PDF (eight setups with explicit triggers, stops, exits), risk calculator,
                daily market notes, and lifetime updates. One-time payment.
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
              <Link href="/blog/best-indicator-for-nifty-options" className="glass-card-soft p-5 block hover:-translate-y-0.5 transition-transform" style={{ textDecoration: "none" }}>
                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">Indicator literacy</div>
                <div className="text-[14.5px] sm:text-[16px] text-ink font-semibold leading-[1.3]">
                  Best indicator for NIFTY options? Four questions decide it.
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
