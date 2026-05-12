import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPost } from "@/lib/blog";
import Price from "@/components/ui/Price";

const SLUG = "how-to-trade-spx-overnight-gaps";
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
              US markets &middot; Session structure
            </div>
            <h1 className="font-display font-semibold text-ink leading-[1.1] tracking-tight" style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}>
              How to trade SPX overnight gaps — <span className="grad-text">three regimes, three plays.</span>
            </h1>
            <p className="mt-6 text-ink-60 leading-relaxed" style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)" }}>
              Most overnight gaps on SPX resolve in one of three ways. Three tells classify the gap before 9:45 ET — and the play that fits each.
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
              Golden Indicator on a US index &middot; pre-market range and prior-day levels do most of the gap-classification work
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
                SPX overnight gaps resolve as gap-and-go, gap-fill, or gap-trap. Three tells classify the regime before the first 15 minutes are over:
                pre-market range relative to overnight ATR, where the gap leaves price against the prior day&apos;s structure, and opening-volume conviction.
                Read the gap first; the play follows. Trading every gap as a fade — or every gap as continuation — guarantees you fight half the days you trade.
              </p>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="container-wide mt-10 sm:mt-14">
          <div className="blog-prose">
            <p>
              The US cash open at 9:30 ET is one of the most-traded windows in the world. SPX, NASDAQ, and the Dow all open with a print that almost never equals the prior 4:00 ET close. That print difference is the gap — and how the gap resolves over the next 30 to 90 minutes drives a meaningful portion of the day&apos;s P&amp;L for intraday traders.
            </p>

            <p>
              Retail traders typically pick one rule and stick to it: &quot;gaps always fill&quot; or &quot;gap-and-go is the only edge&quot;. Both rules are wrong half the time. Gaps don&apos;t all behave the same way because the conditions around them differ. The reliable approach is to classify the gap before you trade it.
            </p>

            <p>
              This piece covers three things: the three gap regimes you&apos;ll see, the three tells that classify them inside the first 15 minutes of the cash session, and how sizing and stop placement change with the read. By the end you&apos;ll have a checklist to run before clicking buy or sell on the open.
            </p>

            <h2>The three gap regimes</h2>

            <ul>
              <li>
                <strong>Gap-and-go</strong> — Gap in one direction, no meaningful pullback into the gap, price extends in the direction of the gap. The pre-market move is real demand or real supply showing up before the cash session catches up.
              </li>
              <li>
                <strong>Gap-fill</strong> — Gap opens away from prior close, then price rotates back toward the prior close and fills the gap fully or partially within the session. The overnight move was positioning or thin-liquidity noise, not real conviction.
              </li>
              <li>
                <strong>Gap-trap</strong> — Gap opens with apparent conviction, gets faded hard in the first 15 to 30 minutes, fails to fill cleanly, then chops in a tight range without either continuing or reversing. The most painful regime to size into because both gap-and-go and gap-fill plays get stopped.
              </li>
            </ul>

            <p>
              Most retail commentary collapses the picture into &quot;fill vs continuation&quot;. The third regime — the trap — is where two-rule frameworks lose money. It looks like a fade for the first 10 minutes, then like a breakout, then like a fade again. Recognising it early lets you stand aside.
            </p>

            <h2>Tell 1 — pre-market range vs overnight ATR</h2>

            <p>
              Between 4:00 ET (prior close) and 9:30 ET (cash open), SPX/ES, NASDAQ/NQ, and the Dow/YM trade in the futures and ETF pre-market. The range that prints during that window is a strong signal about whether the gap has conviction behind it.
            </p>

            <p>
              Compare the pre-market range to the 20-day average overnight ATR. The overnight ATR is the bar size of the typical overnight session — easily approximated by the average of the difference between cash open and prior close over the last 20 sessions.
            </p>

            <ul>
              <li>Pre-market range <em>greater than</em> the 20-day overnight ATR, directional and one-sided → conviction is real. Gap-and-go is the base case.</li>
              <li>Pre-market range <em>roughly equal to</em> the 20-day overnight ATR, with a mid-session reversal → mixed signal. Gap-fill is more likely than gap-and-go.</li>
              <li>Pre-market range <em>well below</em> the 20-day overnight ATR but the gap still prints → noise gap. Gap-fill probability is highest.</li>
              <li>Pre-market range large but choppy with multiple direction changes → gap-trap. The pre-market itself couldn&apos;t agree; the cash session usually can&apos;t either.</li>
            </ul>

            <div className="risk-note">
              <strong>Risk note</strong>
              ATR is a lagging measure of realised volatility. Specific events — Fed days, CPI prints, large earnings — can produce gaps that override the historical baseline. Always cross-check the calendar before assuming a pre-market range is &quot;quiet&quot;. ATR is a regime hint, not a trade signal.
            </div>

            <h2>Tell 2 — where the gap leaves price against prior-day structure</h2>

            <p>
              The same gap size can mean very different things depending on where it lands.
            </p>

            <ul>
              <li>
                <strong>Gap opens beyond the prior day&apos;s range</strong> (above PDH or below PDL) → breakout context. Gap-and-go probability rises. The market has already absorbed the prior session&apos;s liquidity and is offering or bidding at new levels.
              </li>
              <li>
                <strong>Gap opens inside the prior day&apos;s range but past the prior day&apos;s VWAP</strong> → mean-reversion context. Gap-fill probability rises. Price is testing the other side of yesterday&apos;s acceptance zone.
              </li>
              <li>
                <strong>Gap opens near the prior day&apos;s high-volume node</strong> (the value-area middle, where most of yesterday&apos;s volume printed) → magnet context. Gap-trap risk is highest because price will oscillate around that node.
              </li>
            </ul>

            <p>
              You don&apos;t need a full volume-profile tool to do this. Prior day high (PDH), prior day low (PDL), and a rough eye for where price spent most of the prior session is enough for the regime read. A serious indicator marks those levels automatically.
            </p>

            <h2>Tell 3 — opening-15-minute volume conviction</h2>

            <p>
              The first 15 minutes of the cash session — 9:30 to 9:45 ET — is the highest-volume window of the day. What that volume looks like tells you almost everything about which regime you&apos;re in.
            </p>

            <ul>
              <li>
                <strong>Heavy volume in the direction of the gap, no meaningful retrace</strong> → gap-and-go confirmed. Look for continuation pullback entries after the first 15 minutes, not chasing the open.
              </li>
              <li>
                <strong>Heavy volume against the direction of the gap inside the first 15 minutes</strong> → gap-fill confirmed. The opening drive is being absorbed. Look for trend entries in the direction of the fade.
              </li>
              <li>
                <strong>Heavy volume, both directions, no clear winner</strong> → gap-trap. Stand aside until 10:00 to 10:15 ET when one side typically commits, or wait for a clean break of the opening range.
              </li>
              <li>
                <strong>Light volume in either direction</strong> → low-conviction session. Reduce sizing across the board; expectancy is poor in this regime.
              </li>
            </ul>

            <p>
              The first 15-minute range — the &quot;opening range&quot; — is itself a usable level once it&apos;s formed. A clean break of the opening range with continuation volume is one of the cleaner intraday triggers on US indices, in any of the three regimes.
            </p>

            <h2>How sizing changes with the read</h2>

            <p>
              Same setup, different gap regime — the math changes. Take an SPX 5-minute long after a pullback to opening-range high, account $25,000, 1% risk = $250.
            </p>

            <ul>
              <li>
                <strong>In a gap-and-go regime</strong>: stop sits below the opening-range midpoint, maybe 4 SPX points away. Target is +1% from the open or the next prior-day extension, maybe 12 points. 3R trade. Take it at standard size.
              </li>
              <li>
                <strong>In a gap-fill regime</strong>: the same long is fighting the dominant flow. Either skip it or reduce sizing to a half-position because the target — the next leg up — has to overcome unfilled gap pull.
              </li>
              <li>
                <strong>In a gap-trap regime</strong>: same entry, same stop, but the move never extends. You&apos;ll get stopped on a wick or time-stop out flat. The fix isn&apos;t a tighter stop; it&apos;s not taking the trade in this regime.
              </li>
            </ul>

            <p>
              Most retail traders run the same position size on every gap. Then they blame the indicator or the broker when the win-rate collapses on trap days. The position size should be a function of the regime confidence, not a fixed rule.
            </p>

            <h2>The pre-trade checklist for the US open</h2>

            <ol>
              <li>What does the pre-market range vs overnight ATR say?</li>
              <li>Where does the gap leave price against prior-day structure (PDH, PDL, VWAP, value area)?</li>
              <li>What does opening-15-minute volume conviction look like?</li>
            </ol>

            <p>
              When all three agree, you have a high-conviction regime read — take the play that matches the regime.
              When two agree and one is mixed, half-size or wait for a confirming structural break.
              When all three disagree, sit out the open and re-read at 10:15 ET — most session edges still exist after the opening hour.
            </p>

            <h2>Worked example — SPX, three sessions, three regimes</h2>

            <p>Educational. Past performance does not predict future performance.</p>

            <p>
              <strong>Monday.</strong> SPX gaps up 0.5% on positive overnight earnings. Pre-market range is 1.4× the 20-day overnight ATR, one-directional, no meaningful pullback. The gap opens above prior-day high. Opening 15-minute volume confirms in the direction of the gap, 1.6× the average opening-15 volume, no retrace deeper than 30% of the opening range. Gap-and-go regime confirmed. A pullback long taken at opening-range high around 10:05 ET extends to +1% by 11:30 ET — 2.6R on the standard sizing. The setup matched the regime.
            </p>

            <p>
              <strong>Tuesday.</strong> SPX gaps up 0.4% with no clear overnight catalyst. Pre-market range is 0.7× the 20-day overnight ATR, choppy, both directions. The gap opens just past prior-day VWAP but inside prior-day range. Opening volume is heavy against the gap direction — the open prints, then sellers step in. Gap-fill regime. A long taken at opening-range high gets stopped within 20 minutes. A short on the failed break, by contrast, traces back to prior close by 12:00 ET. Same chart, opposite trade.
            </p>

            <p>
              <strong>Wednesday.</strong> SPX gaps down 0.3% on light overnight volume. Pre-market range is 0.5× the 20-day overnight ATR but with three direction changes. The gap opens right at the prior-day value-area middle. Opening volume is moderate in both directions with no clear winner. Gap-trap. Both a fade and a continuation taken in the first hour get stopped or time-stopped. The most profitable trade is the one not taken. By 12:30 ET price is in a 6-point box; the day finishes flat.
            </p>

            <div className="risk-note">
              <strong>Risk note</strong>
              The example uses approximated SPX price action for teaching. Specific levels, percentages, and outcomes are illustrative — not statements about any historical session or recommendations to take any specific trade. US index futures and ETFs carry overnight risk and substantial intraday volatility; trading them can result in total loss of capital.
            </div>

            <h2>Common mistakes</h2>

            <ul>
              <li>
                <strong>Treating every gap as a fill.</strong> The &quot;gaps always fill&quot; heuristic is one of the most-quoted retail rules and one of the most expensive. Gap-and-go days punish faders hard, especially when the gap is past prior-day extremes.
              </li>
              <li>
                <strong>Chasing the open.</strong> The first five minutes of the cash session is the worst place to enter — spreads are wide, the regime isn&apos;t classified yet, and stops are too tight. Wait for the opening range to form before sizing in.
              </li>
              <li>
                <strong>Ignoring the calendar.</strong> Fed days, CPI prints, and major earnings reorder the rules. A pre-market range that looks &quot;huge&quot; on a Fed day is normal; treating it as conviction is a recipe for buying the top.
              </li>
              <li>
                <strong>Forcing a trade on a trap day.</strong> The hardest move in trading is to recognise the trap regime and stand aside. The trader who skips two trap sessions a month outperforms the one who takes them at full size.
              </li>
              <li>
                <strong>Confusing SPX with NASDAQ behaviour.</strong> NASDAQ runs faster overnight ATR and reacts more aggressively to single names (mega-cap earnings). The framework holds, but the numerical thresholds — what counts as &quot;large&quot; pre-market range — differ. Calibrate per market.
              </li>
            </ul>

            <h2>FAQ</h2>

            <h3>Does this framework work on NASDAQ and the Dow as well as SPX?</h3>
            <p>
              The three regimes and three tells apply to all three US indices. The thresholds shift — NASDAQ runs roughly 1.5× the overnight ATR of SPX, and the Dow tends to grind slower. Recalibrate the &quot;large pre-market range&quot; threshold per market and the framework holds.
            </p>

            <h3>How is this different from trading the Indian open?</h3>
            <p>
              The Indian cash open at 9:15 IST follows a 15-minute pre-open auction that compresses overnight discovery into a single price print. SPX has a 5.5-hour pre-market window with continuous trading on futures. That gives you far more pre-classification data on the US session than on NIFTY or BANKNIFTY — but also more time for false signals. See the companion piece on <Link href="/blog/trend-vs-range-trading">regime classification</Link> for the framework the US framework sits on top of.
            </p>

            <h3>What about gaps caused by overnight news vs technical gaps?</h3>
            <p>
              News-driven gaps with clear catalysts (earnings, macro prints, geopolitical events) tend to behave as gap-and-go more often than technical gaps. The three tells still classify correctly because volume and pre-market structure both reflect the news; you don&apos;t need to read the headline to read the chart.
            </p>

            <h3>Can I use this on SPY and QQQ instead of futures?</h3>
            <p>
              Yes. The cash-session ETFs (SPY for SPX, QQQ for NASDAQ, DIA for Dow) print the same gap behaviour and tell the same story. Futures (ES, NQ, YM) give you the cleanest pre-market range read because they trade continuously; ETFs only print pre-market quotes after 4:00 ET with thinner volume.
            </p>

            <h3>How does the indicator help with this specific read?</h3>
            <p>
              The Golden Indicator marks PDH, PDL, prior-day VWAP, and the high-volume node automatically — so Tell 2 (where the gap lands against prior-day structure) is a one-second read. It also classifies the regime live, so by the time the opening 15 minutes close you have the regime label on the chart and don&apos;t need to eyeball the volume bars yourself. See the <Link href="/sample">free chart sample</Link> for the same overlay on a real US session.
            </p>

            <h2>Closing</h2>

            <p>
              Three gap regimes, three tells, one decision before the open. The traders who outperform on US indices aren&apos;t the ones with the cleverest entry triggers — they&apos;re the ones who read the gap, match the play to the regime, and skip the days where the chart isn&apos;t offering a trade.
            </p>

            <p>
              That&apos;s what the framework is for, and what the indicator and trade-logic rules in the bundle are built around. The chart will tell you which day you&apos;re in; the job is to listen before clicking.
            </p>

            <p>
              If you want to see the regime + structure + key-levels overlay on a real US index chart, the <Link href="/sample">free sample</Link> is the shortest path.
              For the full decision system — eight setups, sizing math, daily SPX/NIFTY/XAU/BTC notes — the <Link href="/product">bundle is here</Link>.
            </p>
          </div>
        </section>

        {/* IN-BODY CTA CARD */}
        <section className="container-wide mt-12 sm:mt-16">
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <div className="glass-card p-6 sm:p-8">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">
                Read the gap, then trade the open
              </div>
              <h3 className="font-display font-semibold leading-[1.25] text-ink mb-3" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}>
                Golden Indicator — regime, structure, and key US-session levels on every chart.
              </h3>
              <p className="text-[14px] sm:text-[15px] text-ink-60 leading-[1.6] mb-5">
                Bar-close logic. Auto-classifies regime. Marks PDH / PDL / prior-day VWAP / value area on SPX, NASDAQ, and the Dow.
                Pre-market range tagged automatically. Bundle includes the Trade Logic PDF (eight setups with explicit triggers, stops, exits), risk calculator, daily NIFTY / SPX / XAU / BTC notes, lifetime updates.
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
                EasyTradeSetup is not a SEBI-registered research analyst and is not regulated by the SEC, FINRA, or any US regulatory body.
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
                <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40 mb-2">Market structure</div>
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
