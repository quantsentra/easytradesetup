import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Prose from "@/components/ui/Prose";
import IndicatorBasicsCourse from "@/components/portal/IndicatorBasicsCourse";

type Doc = {
  title: string;
  eyebrow: string;
  lede: string;
  body: React.ReactNode;
  noProse?: boolean;
};

const DOCS: Record<string, Doc> = {
  install: {
    title: "Install on TradingView",
    eyebrow: "Getting started",
    lede: "Ninety seconds, start to finish. Works on the free plan.",
    body: (
      <>
        <h2>Before you start</h2>
        <ul>
          <li>A TradingView account — the free tier works.</li>
          <li>The <code>golden-indicator.pine</code> file from your Downloads page.</li>
        </ul>
        <h2>Step 1 — Open Pine Editor</h2>
        <p>Log in to TradingView, open any chart, then click <strong>Pine Editor</strong> at the bottom.</p>
        <h2>Step 2 — Paste the script</h2>
        <p>Open <code>golden-indicator.pine</code> in any text editor, select all (<code>Ctrl+A</code>), copy (<code>Ctrl+C</code>), and paste into Pine Editor — replace the default template.</p>
        <h2>Step 3 — Save and add to chart</h2>
        <p>Click <strong>Save</strong>, name it anything, then click <strong>Add to chart</strong>. Signals render immediately.</p>
        <h2>Step 4 — Pin it</h2>
        <p>Open indicator settings (gear icon), tune inputs for your market and timeframe, then click the <strong>favorites star</strong> to pin across every chart.</p>
        <h3>Troubleshooting</h3>
        <ul>
          <li><strong>&ldquo;script has errors&rdquo;</strong> — you pasted a partial file. Copy again, from first line to last.</li>
          <li><strong>Signals differ from the screenshots</strong> — Pine repaints on non-final bars. Trade bar-close only.</li>
          <li><strong>Nothing on chart</strong> — drop to a lower timeframe (15m / 5m) with at least 500 bars loaded.</li>
        </ul>
      </>
    ),
  },
  "indicator-basics": {
    title: "Indicator basics — read this before any trade setup",
    eyebrow: "Start here · required",
    lede: "Eleven short cards + a 3-question quick check. Tap each card open, mark when you've got it, take the quiz. Trade setups in the rest of this portal assume you've cleared this.",
    body: <IndicatorBasicsCourse />,
    noProse: true,
  },

  "regime-filter": {
    title: "How the regime filter works",
    eyebrow: "Getting started",
    lede: "Trend days trade the pullbacks. Range days fade the extremes. Regime says which.",
    body: (
      <>
        <h2>The three states</h2>
        <p>Every bar, the indicator assigns the chart one of three regimes:</p>
        <ul>
          <li><strong>Trend</strong> — directional bias is clean, momentum is expanding, volatility is not spiking.</li>
          <li><strong>Range</strong> — price is mean-reverting inside a band, momentum is flat.</li>
          <li><strong>Transition</strong> — either breaking out of a range or losing a trend. Lowest-edge state — fewer trades, wider stops.</li>
        </ul>
        <h2>What drives the classification</h2>
        <p>A blend of higher-timeframe structure (swing highs/lows), slope of the anchored mean, and volatility contraction. None are published here — the combination is the product.</p>
        <h2>How to use it</h2>
        <ul>
          <li>In <strong>trend</strong> — take continuation setups only. Fade signals are filtered down.</li>
          <li>In <strong>range</strong> — reversal signals at band extremes fire. Breakouts are suppressed.</li>
          <li>In <strong>transition</strong> — wait. If you must trade, halve size.</li>
        </ul>
        <h3>Failure modes</h3>
        <p>Regime can flip intrabar on news. The indicator closes any stale state at the next bar close — do not chase flips mid-bar.</p>
      </>
    ),
  },
  "reading-levels": {
    title: "Reading key levels (PDH / PDL / PWH / PWL)",
    eyebrow: "Getting started",
    lede: "The four levels every session opens near. The indicator plots them automatically.",
    body: (
      <>
        <h2>The four levels</h2>
        <ul>
          <li><strong>PDH</strong> — previous day&apos;s high. Intraday resistance.</li>
          <li><strong>PDL</strong> — previous day&apos;s low. Intraday support.</li>
          <li><strong>PWH</strong> — previous week&apos;s high. Swing resistance, dominant on Mondays.</li>
          <li><strong>PWL</strong> — previous week&apos;s low. Swing support, same rule.</li>
        </ul>
        <h2>Why these four</h2>
        <p>Institutional desks anchor orders at them. Liquidity pools build on both sides. Breakouts either trap late buyers (fade) or run to the next level (continuation) — regime decides which.</p>
        <h2>How they interact with regime</h2>
        <ul>
          <li><strong>Trend + PDH break</strong> — continuation, target the daily +1 ATR extension.</li>
          <li><strong>Range + PDH touch</strong> — fade back to session midpoint.</li>
          <li><strong>Transition + PDH</strong> — no trade. Too noisy.</li>
        </ul>
        <h3>Session note</h3>
        <p>For NIFTY/BANKNIFTY, the opening 15-minute range overrides PDH/PDL until 10:00 IST. The indicator draws the ORB box automatically.</p>
      </>
    ),
  },
  "opening-range-breakout": {
    title: "Opening Range Breakout · NIFTY",
    eyebrow: "Setups",
    lede: "The 9:15–9:30 range sets the day&apos;s bias. Clean break, clean trade.",
    body: (
      <>
        <h2>Setup rules</h2>
        <ol>
          <li>Wait for the 9:15–9:30 IST bar to close.</li>
          <li>Mark the 15-minute high and low — the indicator does this for you.</li>
          <li>Enter on a 5-minute bar close <strong>beyond</strong> the range, in the direction of the higher-timeframe regime.</li>
          <li>Stop = opposite side of the 15-minute range.</li>
          <li>Target 1 = 1R at PDH or PDL. Target 2 = daily +1 ATR extension.</li>
        </ol>
        <h2>Skip conditions</h2>
        <ul>
          <li>Regime = transition.</li>
          <li>Range is wider than 0.8% of spot (volatility spike, high risk of whipsaw).</li>
          <li>VIX gap &gt; 5% — premium dynamics override technicals.</li>
        </ul>
        <h2>Why it works</h2>
        <p>The first 15 minutes aggregate overnight sentiment plus pre-open order imbalance. A clean break in a trending regime means overnight bias survived the auction — it usually extends.</p>
        <h3>Expiry-day variant</h3>
        <p>On Thursday (monthly expiry), breakouts fade 70% of the time after 1:30 PM IST. The indicator flags this window — do not take fresh ORB trades after that mark.</p>
      </>
    ),
  },
  "trend-pullback": {
    title: "Trend pullback · SPX / XAU",
    eyebrow: "Setups",
    lede: "Buy the dip in an uptrend. Sell the rally in a downtrend. Tight stop, 2R minimum.",
    body: (
      <>
        <h2>Setup rules</h2>
        <ol>
          <li>Regime must be <strong>trend</strong>, with slope consistent over the last 20 bars.</li>
          <li>Wait for price to tag the anchored mean from above (long) or below (short).</li>
          <li>Enter on the first 5-minute close that rejects the mean — candle closes back on the trend side.</li>
          <li>Stop = 0.5 ATR beyond the rejection bar&apos;s extreme.</li>
          <li>Target = prior swing high (long) or low (short).</li>
        </ol>
        <h2>Why SPX and XAU</h2>
        <p>Both run overnight sessions and respect technical structure cleanly when regime is trend. News-driven tickers (individual equities) break the setup too often.</p>
        <h2>Risk notes</h2>
        <ul>
          <li>Skip during CPI, NFP, and FOMC release windows (±30 minutes).</li>
          <li>In XAU, a DXY break in the opposite direction invalidates the setup — always cross-check.</li>
        </ul>
      </>
    ),
  },
  "expiry-gamma-fade": {
    title: "Expiry gamma fade · BANKNIFTY",
    eyebrow: "Setups",
    lede: "Weekly expiry days pin to max-pain. Sell edges, buy centers.",
    body: (
      <>
        <h2>The idea</h2>
        <p>BANKNIFTY weekly options expire Wednesday. By mid-session, dealer gamma positioning pins spot toward the strike with the most open interest — &ldquo;max pain.&rdquo; The indicator pulls the max-pain strike via a morning calibration.</p>
        <h2>Setup rules</h2>
        <ol>
          <li>Only after 12:00 IST on expiry day.</li>
          <li>Regime must be <strong>range</strong>.</li>
          <li>Fade 0.5% excursions away from max-pain.</li>
          <li>Stop = 0.3% beyond entry.</li>
          <li>Target = max-pain strike ± 0.1%.</li>
        </ol>
        <h2>When it fails</h2>
        <ul>
          <li>Macro news breaks the pin — RBI surprise, global risk-off. Exit immediately.</li>
          <li>Open interest shifts intraday — re-read max-pain every hour.</li>
        </ul>
        <h3>Capital note</h3>
        <p>BANKNIFTY futures margin is significant. Size for 0.3% stops against your actual equity, not the notional.</p>
      </>
    ),
  },
  "breakout-trap": {
    title: "Breakout trap · BTC / ETH",
    eyebrow: "Setups",
    lede: "Crypto breaks levels constantly. Most fail. Fade the fakes.",
    body: (
      <>
        <h2>The setup</h2>
        <p>BTC and ETH 24/7 markets print breakouts that fail inside the next 3-4 bars. The indicator tags candidate breakouts on the 1-hour chart; regime = range is the filter.</p>
        <h2>Rules</h2>
        <ol>
          <li>Price closes above a marked resistance (or below support) on the 1H.</li>
          <li>Next 1-2 bars fail to extend — no new high / low.</li>
          <li>Enter on the 1H bar that closes back inside the prior range.</li>
          <li>Stop = 0.3 ATR beyond the breakout extreme.</li>
          <li>Target = opposite side of the range, partial at midpoint.</li>
        </ol>
        <h2>Why it works</h2>
        <p>Crypto leverage spikes at obvious levels. Liquidations trigger above resistance and below support; the reversal is the stop cascade running out of fuel.</p>
        <h3>Kill switch</h3>
        <p>During funding-rate extremes (&gt;0.1% / 8h), trend regime often takes over intrabar. Avoid this setup when funding is stretched.</p>
      </>
    ),
  },
  "position-sizing": {
    title: "Position sizing",
    eyebrow: "Risk framework",
    lede: "Fixed fractional risk, calculated per trade. Never size by feel.",
    body: (
      <>
        <h2>The rule</h2>
        <p>Risk a fixed percentage of equity per trade — default 0.5%, cap at 1.0%. If a stop is 20 points away and you&apos;re risking ₹2,500 per trade, the position is 125 units. The Risk Calculator does this automatically.</p>
        <h2>Why fractional</h2>
        <ul>
          <li>Losses scale with size — 10 × 0.5% = 5% drawdown, recoverable.</li>
          <li>Fixed-unit sizing punishes you for taking bigger stops. Fixed-fractional punishes you proportionally.</li>
          <li>It forces you to compute stop distance <strong>before</strong> entry, which already filters out impulse trades.</li>
        </ul>
        <h2>Scaling caveats</h2>
        <ul>
          <li>Intraday futures — use 0.5%.</li>
          <li>Overnight swing — use 0.25% (gap risk).</li>
          <li>Earnings / event — zero, or pure defined-risk spreads only.</li>
        </ul>
        <h3>Compounding</h3>
        <p>Recompute position sizes weekly, not per-trade. Daily recomputation on winning streaks blows up equity faster than you realize.</p>
      </>
    ),
  },
  "stop-placement": {
    title: "Stop placement — structure vs ATR",
    eyebrow: "Risk framework",
    lede: "Structural stops survive noise. ATR stops size consistently. Use both, decide per setup.",
    body: (
      <>
        <h2>Structural stops</h2>
        <p>Place the stop at the level that, if broken, invalidates the trade idea. Below a swing low for longs. Above a swing high for shorts. No fixed distance — it depends on the chart.</p>
        <h2>ATR stops</h2>
        <p>Multiply the 14-period Average True Range by a constant (typically 1.2–2.0) and place the stop that distance from entry. Useful when structure is unclear or for systematic execution.</p>
        <h2>When to use which</h2>
        <ul>
          <li><strong>Trend pullback</strong> — structural. The swing low/high is the level.</li>
          <li><strong>ORB</strong> — structural (opposite end of opening range).</li>
          <li><strong>Expiry fade</strong> — ATR. Structure is too tight inside the pin.</li>
          <li><strong>Breakout trap</strong> — structural (breakout extreme).</li>
        </ul>
        <h3>What not to do</h3>
        <p>Never move a stop further away mid-trade. Trailing toward breakeven or profit is fine. Widening a losing stop is gambling.</p>
      </>
    ),
  },
  "daily-loss-limit": {
    title: "Daily loss limits + cool-down rules",
    eyebrow: "Risk framework",
    lede: "Two losses in a row, stop. Three, walk away for the day.",
    body: (
      <>
        <h2>The mechanical limit</h2>
        <ul>
          <li>Daily loss cap = 2R. Two full stops, you&apos;re done.</li>
          <li>Three losses in a row (even if not full stops) = day over.</li>
          <li>Weekly loss cap = 5R. Hit it, no trading Monday.</li>
        </ul>
        <h2>Why it matters</h2>
        <p>The worst trades come after losing streaks. Tilt compounds — you widen stops, over-size, or chase. The cap exists to stop you before your worst version of you shows up.</p>
        <h2>The cool-down rule</h2>
        <p>After a losing trade, wait 2 bars on the timeframe you&apos;re trading before taking the next setup. On a 15m chart, that&apos;s 30 minutes. Forced delay breaks the revenge-trade impulse.</p>
        <h3>Journal prompt</h3>
        <ul>
          <li>Was the setup A-grade or was I forcing it?</li>
          <li>Did I hit my stop or did I cut early?</li>
          <li>Am I below the daily cap?</li>
        </ul>
        <p>If any answer is &ldquo;no&rdquo; or &ldquo;forced&rdquo; — stop trading for the day.</p>
      </>
    ),
  },
  "risk-calculator": {
    title: "Risk calculator — how to use it",
    eyebrow: "Risk framework",
    lede: "Plug in entry, stop, and risk percent. It returns position size and R-multiple targets.",
    body: (
      <>
        <h2>What it does</h2>
        <p>The Risk Calculator (XLSX + web version in Downloads) takes four inputs — account equity, risk percent, entry price, stop price — and returns:</p>
        <ul>
          <li>Position size in units / contracts.</li>
          <li>Dollar (or rupee) risk exposed.</li>
          <li>1R, 2R, 3R target prices on the profit side.</li>
          <li>Margin required for Indian F&amp;O contracts.</li>
        </ul>
        <h2>Workflow</h2>
        <ol>
          <li>Open calculator before every trade. No exceptions.</li>
          <li>Enter the stop <strong>before</strong> entry — if you can&apos;t define it, you don&apos;t have a trade.</li>
          <li>Check the position size. If it feels too small, your stop is probably too wide.</li>
          <li>Transfer the target levels to your order ticket as GTT / bracket legs.</li>
        </ol>
        <h3>Customization</h3>
        <p>The XLSX has a per-instrument sheet — tick size, lot size, point value. For non-Indian contracts, duplicate the NIFTY sheet and update the constants. See the PDF&apos;s appendix A for a worked example on ES futures.</p>
      </>
    ),
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) return { title: "Not found" };
  return {
    title: `${doc.title} — Strategies`,
    robots: { index: false, follow: false },
  };
}

export default async function PortalDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  return (
    <>
      <Link
        href="/portal/docs"
        className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-widest mb-4"
        style={{ color: "var(--tz-ink-mute)" }}
      >
        ← Back to library
      </Link>

      <div className="tz-topbar">
        <div>
          <span className="tz-chip">
            <span className="tz-chip-dot" style={{ background: "var(--tz-acid)" }} />
            {doc.eyebrow}
          </span>
          <h1 className="tz-topbar-title mt-3">{doc.title}</h1>
          <div className="tz-topbar-sub max-w-[640px]">{doc.lede}</div>
        </div>
      </div>

      <div className="tz-card" style={{ padding: doc.noProse ? "20px" : "32px 40px" }}>
        {doc.noProse ? doc.body : <Prose>{doc.body}</Prose>}
      </div>

      <div className="mt-10 pt-6 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--tz-border)" }}>
        <Link
          href="/portal/docs"
          className="text-[13px]"
          style={{ color: "var(--tz-ink-mute)" }}
        >
          ← All strategies
        </Link>
        <span className="font-mono text-[10.5px] uppercase tracking-widest"
          style={{ color: "var(--tz-ink-mute)" }}>
          Educational · not investment advice
        </span>
      </div>
    </>
  );
}
