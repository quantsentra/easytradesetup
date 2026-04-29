import Link from "next/link";
import { resolveHomeMarket } from "@/lib/geo";

type Card = {
  id: "nifty" | "spx" | "btc";
  symbol: string;
  name: string;
  tf: string;
  price: string;
  delta: string;
  deltaPositive: boolean;
  setup: string;
  tone: "cyan" | "gold" | "blue";
};

const NIFTY: Card = {
  id: "nifty",
  symbol: "NIFTY 50",
  name: "NSE Intraday",
  tf: "15m",
  price: "24,852.15",
  delta: "+0.42%",
  deltaPositive: true,
  setup: "Opening-range bias confirmed · long above VWAP",
  tone: "cyan",
};
const SPX: Card = {
  id: "spx",
  symbol: "SPX 500",
  name: "US Futures",
  tf: "1H",
  price: "5,218.40",
  delta: "+0.28%",
  deltaPositive: true,
  setup: "Regime bullish · HH / HL intact · key level 5,200",
  tone: "blue",
};
const BTC: Card = {
  id: "btc",
  symbol: "BTC / USD",
  name: "Crypto",
  tf: "4H",
  price: "71,420",
  delta: "−0.18%",
  deltaPositive: false,
  setup: "Range regime · mean-revert setup at upper band",
  tone: "gold",
};

// Stagger pattern that avoids the lower-card from optically clipping the
// upper one; identical across both market orderings so the visual rhythm
// stays consistent regardless of geo.
const STAGGER: Array<{ rotate: string; marginLeft?: string }> = [
  { rotate: "-1.5deg" },
  { rotate: "0.8deg", marginLeft: "32px" },
  { rotate: "-0.6deg" },
];

export default async function MultiMarket() {
  const market = await resolveHomeMarket();
  // India-first ordering surfaces NIFTY at the top; global ordering leads
  // with SPX so US/EU visitors see a benchmark they recognise instantly.
  const cards =
    market === "in" ? [NIFTY, SPX, BTC] : [SPX, BTC, NIFTY];
  const bullets =
    market === "in"
      ? [
          "Tuned first for NIFTY / BankNifty weekly expiries",
          "Runs clean on SPX, NASDAQ, DAX, FTSE",
          "Commodities: Gold, Silver, Crude — ready",
          "Crypto: BTC, ETH, major alts — bar-close safe",
          "Forex majors + INR pairs included",
        ]
      : [
          "Tuned first for SPX / NASDAQ / Dow morning trends",
          "Runs clean on NIFTY, BankNifty, DAX, FTSE",
          "Commodities: Gold, Silver, Crude — ready",
          "Crypto: BTC, ETH, major alts — bar-close safe",
          "Forex majors + INR pairs included",
        ];
  return (
    <section className="above-bg">
      <div className="container-wide py-20 sm:py-24 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* LEFT — copy */}
          <div>
            <span className="eye">
              <span className="eye-dot" aria-hidden />
              Multi-market coverage
            </span>
            <h2 className="mt-5 font-display text-[40px] sm:text-[48px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              One script.{" "}
              <span className="grad-text-2">Every market you actually trade.</span>
            </h2>
            <p className="mt-5 text-[15px] sm:text-[16px] leading-[1.55] text-ink-60 max-w-[480px]">
              Symbol-agnostic by design. The regime filter, session timing, and volatility
              scaling adapt automatically to whatever chart you paste it on.
            </p>
            <ul className="mt-8 space-y-4">
              {bullets.map((b) => (
                <Check key={b}>{b}</Check>
              ))}
            </ul>
            <div className="mt-9">
              <Link href="/compare" className="btn btn-outline">
                See how it compares <span className="arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT — stacked cards */}
          <div className="flex flex-col gap-4">
            {cards.map((c, i) => (
              <MarketCard key={c.id} card={c} stagger={STAGGER[i] ?? STAGGER[0]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketCard({
  card,
  stagger,
}: {
  card: Card;
  stagger: { rotate: string; marginLeft?: string };
}) {
  const toneColors: Record<Card["tone"], { grad: string; stroke: string }> = {
    cyan: {
      grad: "linear-gradient(180deg, rgba(34,211,238,0.35), rgba(34,211,238,0))",
      stroke: "#22D3EE",
    },
    blue: {
      grad: "linear-gradient(180deg, rgba(43,123,255,0.35), rgba(43,123,255,0))",
      stroke: "#2B7BFF",
    },
    gold: {
      grad: "linear-gradient(180deg, rgba(240,192,90,0.30), rgba(240,192,90,0))",
      stroke: "#F0C05A",
    },
  };
  const t = toneColors[card.tone];

  return (
    <div
      className="term-frame"
      style={{
        transform: `rotate(${stagger.rotate})`,
        marginLeft: stagger.marginLeft,
      }}
    >
      <div className="term-head">
        <div className="term-lights" aria-hidden>
          <span className="r" />
          <span className="y" />
          <span className="g" />
        </div>
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink-40 truncate">
          {card.symbol} · {card.tf} · Golden
        </span>
        <span className="ml-auto chip">{card.name}</span>
      </div>

      <div className="px-5 py-4 flex items-center gap-4">
        <div className="flex items-baseline gap-2">
          <span className="stat-num text-[20px] sm:text-[22px] text-ink">{card.price}</span>
          <span
            className="font-mono text-[11px] font-bold tz-num"
            style={{
              color: card.deltaPositive ? "#22C55E" : "#EF4444",
            }}
          >
            {card.deltaPositive ? "▲" : "▼"} {card.delta}
          </span>
        </div>
        <span className="ml-auto text-[12px] text-ink-60 truncate max-w-[200px] sm:max-w-none">
          {card.setup}
        </span>
      </div>

      <div className="px-5 pb-4">
        <svg viewBox="0 0 500 80" preserveAspectRatio="none" className="w-full h-[60px]" aria-hidden>
          <defs>
            <linearGradient id={`mmg-${card.tone}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={t.stroke} stopOpacity="0.4" />
              <stop offset="1" stopColor={t.stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,55 L40,48 L80,52 L120,40 L160,44 L200,30 L240,36 L280,22 L320,28 L360,18 L400,24 L440,12 L480,18 L500,10 L500,80 L0,80 Z"
            fill={`url(#mmg-${card.tone})`}
          />
          <path
            d="M0,55 L40,48 L80,52 L120,40 L160,44 L200,30 L240,36 L280,22 L320,28 L360,18 L400,24 L440,12 L480,18 L500,10"
            stroke={t.stroke}
            strokeWidth="1.8"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15px] text-ink">
      <span
        className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 grid place-items-center"
        style={{
          background: "rgba(143, 204, 42, 0.20)",
          border: "1px solid rgba(143, 204, 42, 0.40)",
        }}
        aria-hidden
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8FCC2A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 5 5L20 7" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}
