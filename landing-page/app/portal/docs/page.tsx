import Link from "next/link";

type Difficulty = "Foundations" | "Setup" | "Risk";
type Market = "NIFTY" | "BANKNIFTY" | "SPX" | "XAU" | "BTC" | "Universal";

type DocEntry = {
  slug: string;
  title: string;
  blurb: string;
  difficulty: Difficulty;
  markets: Market[];
  estMinutes: number;
};

const groups: { title: string; sub: string; tone: "blue" | "cyan" | "gold"; items: DocEntry[] }[] = [
  {
    title: "Start here — required reading",
    sub: "Read these in order. Trade setups assume you already know what each indicator layer is telling you.",
    tone: "blue",
    items: [
      {
        slug: "install",
        title: "Install on TradingView",
        blurb: "Paste the Pine v5 source, save as a script, add to chart. 3 minutes.",
        difficulty: "Foundations",
        markets: ["Universal"],
        estMinutes: 3,
      },
      {
        slug: "indicator-basics",
        title: "Indicator basics — read this before any trade setup",
        blurb: "What every line, zone, candle colour and signal on your chart means. The one read that makes everything else click.",
        difficulty: "Foundations",
        markets: ["Universal"],
        estMinutes: 8,
      },
      {
        slug: "regime-filter",
        title: "How the regime filter works",
        blurb: "Why we trade in trend regime only and how the filter classifies bias.",
        difficulty: "Foundations",
        markets: ["Universal"],
        estMinutes: 6,
      },
      {
        slug: "reading-levels",
        title: "Reading key levels",
        blurb: "PDH / PDL / PWH / PWL · why these four anchor every intraday plan.",
        difficulty: "Foundations",
        markets: ["Universal"],
        estMinutes: 5,
      },
    ],
  },
  {
    title: "Setups",
    sub: "Eight playbooks. Entry, invalidation, target, journal template.",
    tone: "cyan",
    items: [
      {
        slug: "opening-range-breakout",
        title: "Opening Range Breakout",
        blurb: "Pre-market range break with regime + volume confirmation. India open.",
        difficulty: "Setup",
        markets: ["NIFTY", "BANKNIFTY"],
        estMinutes: 8,
      },
      {
        slug: "trend-pullback",
        title: "Trend pullback",
        blurb: "Buy the dip into a key level inside an uptrend regime. SPX / XAU friendly.",
        difficulty: "Setup",
        markets: ["SPX", "XAU"],
        estMinutes: 7,
      },
      {
        slug: "expiry-gamma-fade",
        title: "Expiry gamma fade",
        blurb: "Thursday BANKNIFTY expiry — fade extension into max-pain band.",
        difficulty: "Setup",
        markets: ["BANKNIFTY"],
        estMinutes: 9,
      },
      {
        slug: "breakout-trap",
        title: "Breakout trap",
        blurb: "Rejection at prior high inside a fake-out window. Crypto + indices.",
        difficulty: "Setup",
        markets: ["BTC", "NIFTY"],
        estMinutes: 7,
      },
    ],
  },
  {
    title: "Risk framework",
    sub: "The boring layer that keeps you alive. Read this first if you skipped setups.",
    tone: "gold",
    items: [
      {
        slug: "position-sizing",
        title: "Position sizing",
        blurb: "Fixed-fractional sizing tied to your account R. The math, no jargon.",
        difficulty: "Risk",
        markets: ["Universal"],
        estMinutes: 5,
      },
      {
        slug: "stop-placement",
        title: "Stop placement",
        blurb: "Structure-based stops vs ATR stops. When each rule applies.",
        difficulty: "Risk",
        markets: ["Universal"],
        estMinutes: 6,
      },
      {
        slug: "daily-loss-limit",
        title: "Daily loss limits",
        blurb: "Cool-down rules so a bad morning doesn't become a bad month.",
        difficulty: "Risk",
        markets: ["Universal"],
        estMinutes: 4,
      },
      {
        slug: "risk-calculator",
        title: "Risk calculator — how to use it",
        blurb: "Plug in stop distance + R%; portal returns position size and contract count.",
        difficulty: "Risk",
        markets: ["Universal"],
        estMinutes: 4,
      },
    ],
  },
];

export default function PortalDocsIndex() {
  const totalDocs = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <>
      {/* HEADER */}
      <section className="tz-hero-card" style={{ padding: "26px 28px" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="tz-chip tz-chip-acid">
            <span className="tz-chip-dot" />
            Strategy library
          </span>
          <span className="tz-chip">{totalDocs} entries</span>
          <span className="tz-chip tz-chip-cyan">8 setups</span>
        </div>
        <h1 className="tz-hero-title" style={{ fontSize: 30 }}>
          Read the rules. Copy the checklists. Trade the plan.
        </h1>
        <p className="tz-hero-sub">
          Every entry links the Pine logic to the trader-side decision: what the script shows,
          what to look for, what invalidates the idea, how to size, when to stand down.
          Educational only — you decide every trade.
        </p>
      </section>

      {/* GROUPS */}
      <div className="flex flex-col gap-10 mt-10">
        {groups.map((g) => (
          <section key={g.title}>
            <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="tz-group-mark"
                    style={{
                      background: toneBg(g.tone),
                      color: toneFg(g.tone),
                      borderColor: toneBorder(g.tone),
                    }}
                  >
                    {markFor(g.title)}
                  </span>
                  <h2 className="tz-section-title" style={{ fontSize: 18 }}>
                    {g.title}
                  </h2>
                  <span className="tz-chip" style={{ height: 20, fontSize: 10.5 }}>
                    {g.items.length}
                  </span>
                </div>
                <p className="tz-section-sub" style={{ marginTop: 4 }}>{g.sub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {g.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/portal/docs/${item.slug}`}
                  className="tz-doc-card"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className="tz-doc-pill"
                      style={{
                        background: toneBg(g.tone),
                        color: toneFg(g.tone),
                        borderColor: toneBorder(g.tone),
                      }}
                    >
                      {item.difficulty}
                    </span>
                    <span className="tz-doc-time">{item.estMinutes} min</span>
                  </div>
                  <h3 className="tz-doc-title">{item.title}</h3>
                  <p className="tz-doc-blurb">{item.blurb}</p>
                  <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex flex-wrap gap-1.5">
                      {item.markets.map((m) => (
                        <span key={m} className="tz-doc-tag">{m}</span>
                      ))}
                    </div>
                    <span className="tz-doc-cta">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* FOOTER NOTE */}
      <div className="tz-card mt-12" style={{
        padding: "18px 22px",
        background: "var(--tz-surface-2)",
      }}>
        <p className="text-[12.5px]" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.55 }}>
          <strong style={{ color: "var(--tz-ink-dim)" }}>Educational, not investment advice.</strong>{" "}
          The strategies above are checklists for personal study. Markets change. Backtest, paper-trade, and
          journal before risking real capital. Past chart behaviour is not a forecast.
        </p>
      </div>
    </>
  );
}

function toneBg(t: "blue" | "cyan" | "gold") {
  return t === "blue" ? "rgba(43,123,255,0.10)"
    : t === "cyan" ? "rgba(34,211,238,0.12)"
    : "rgba(240,192,90,0.16)";
}
function toneFg(t: "blue" | "cyan" | "gold") {
  return t === "blue" ? "var(--tz-acid-dim)"
    : t === "cyan" ? "var(--tz-cyan-dim)"
    : "#9a6e1f";
}
function toneBorder(t: "blue" | "cyan" | "gold") {
  return t === "blue" ? "rgba(43,123,255,0.28)"
    : t === "cyan" ? "rgba(34,211,238,0.30)"
    : "rgba(240,192,90,0.40)";
}
function markFor(t: string) {
  return t === "Getting started" ? "1" : t === "Setups" ? "2" : "3";
}
