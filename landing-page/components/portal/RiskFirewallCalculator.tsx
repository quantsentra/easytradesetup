"use client";

import { useEffect, useMemo, useState } from "react";

// LocalStorage key — stores the persistent prefs (market, direction,
// account, risk %). Trade levels (entry / SL / TP) are intentionally
// NOT persisted — those are per-trade values, not preferences.
const PREFS_KEY = "ets_rc_prefs_v1";

type Prefs = {
  market: MarketKey;
  direction: Direction;
  account: string;
  riskPct: string;
};

// ---- Market specs --------------------------------------------------------
// Each market carries the metadata the calculator needs to convert a raw
// price-distance stop into broker-meaningful position size + lots.

type MarketKey =
  | "xauusd"
  | "btcusdt"
  | "forex"
  | "indices"
  | "nifty"
  | "banknifty";

type MarketSpec = {
  key: MarketKey;
  label: string;
  unit: string;          // e.g. "oz", "BTC", "units", "contracts"
  lotSize?: number;      // for index futures: 1 lot = lotSize underlyings
  pricePrecision: number;// digits after decimal for display
  hint: string;          // input placeholder hint
  ccy: "USD" | "INR";
};

const MARKETS: Record<MarketKey, MarketSpec> = {
  xauusd:    { key: "xauusd",    label: "XAU / USD (Gold)",      unit: "oz",         pricePrecision: 2, hint: "e.g. 4310.50",   ccy: "USD" },
  btcusdt:   { key: "btcusdt",   label: "BTC / USDT (Bitcoin)",  unit: "BTC",        pricePrecision: 2, hint: "e.g. 67500.00",  ccy: "USD" },
  forex:     { key: "forex",     label: "Forex (e.g. EURUSD)",   unit: "units",      pricePrecision: 5, hint: "e.g. 1.08550",   ccy: "USD" },
  indices:   { key: "indices",   label: "Indices (US 30 / SPX)", unit: "contracts",  pricePrecision: 2, hint: "e.g. 49500.00",  ccy: "USD" },
  nifty:     { key: "nifty",     label: "NIFTY 50",              unit: "qty",        lotSize: 75, pricePrecision: 2, hint: "e.g. 24350.00", ccy: "INR" },
  banknifty: { key: "banknifty", label: "BANKNIFTY",             unit: "qty",        lotSize: 15, pricePrecision: 2, hint: "e.g. 52400.00", ccy: "INR" },
};

const MARKET_KEYS: MarketKey[] = ["xauusd", "btcusdt", "forex", "indices", "nifty", "banknifty"];

type Direction = "buy" | "sell";

// ---- Pure calculation logic ---------------------------------------------
// Lifted out of the component so it stays reusable + unit-testable later.

type CalcInput = {
  account: number;
  riskPct: number;
  market: MarketKey;
  direction: Direction;
  entry: number;
  stop: number;
  target: number;
};

type CalcResult = {
  ok: true;
  riskAmount: number;
  slDistance: number;
  positionSize: number;
  lots?: number;
  reward: number;
  rr: number;
  safetyScore: number;
  status: "safe" | "standard" | "aggressive" | "danger";
  warnings: string[];
  errors: string[];
} | {
  ok: false;
  errors: string[];
};

function calc(input: CalcInput): CalcResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Number.isFinite(input.account) || input.account <= 0) {
    errors.push("Account balance must be a positive number.");
  }
  if (!Number.isFinite(input.riskPct) || input.riskPct <= 0) {
    errors.push("Risk percentage must be a positive number.");
  }
  if (!Number.isFinite(input.entry) || input.entry <= 0) {
    errors.push("Entry price must be a positive number.");
  }
  if (!Number.isFinite(input.stop) || input.stop <= 0) {
    errors.push("Stop loss must be a positive number.");
  }
  if (!Number.isFinite(input.target) || input.target <= 0) {
    errors.push("Take profit must be a positive number.");
  }

  // Direction sanity — Buy expects SL < entry < TP; Sell expects SL > entry > TP.
  if (errors.length === 0) {
    if (input.direction === "buy") {
      if (input.stop >= input.entry) {
        errors.push("Buy setup: stop loss must be below entry.");
      }
      if (input.target <= input.entry) {
        errors.push("Buy setup: take profit must be above entry.");
      }
    } else {
      if (input.stop <= input.entry) {
        errors.push("Sell setup: stop loss must be above entry.");
      }
      if (input.target >= input.entry) {
        errors.push("Sell setup: take profit must be below entry.");
      }
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  const riskAmount = input.account * (input.riskPct / 100);
  const slDistance = Math.abs(input.entry - input.stop);

  if (slDistance === 0) {
    return { ok: false, errors: ["Stop loss cannot equal entry price."] };
  }

  // Per-unit P/L for the markets we support is just the price distance —
  // i.e. 1 unit moves $1 per $1 of price for spot markets, 1 NIFTY qty
  // moves ₹1 per ₹1 of price for cash equity. For futures lot-sizing we
  // compute lot count separately.
  const positionSize = riskAmount / slDistance;
  const reward = Math.abs(input.target - input.entry) * positionSize;
  const rr = reward / riskAmount;

  const spec = MARKETS[input.market];
  let lots: number | undefined;
  if (spec.lotSize) {
    lots = positionSize / spec.lotSize;
  }

  // ---- Safety scoring ----
  let safetyScore = 100;
  if (input.riskPct > 2) safetyScore -= 20;
  if (input.riskPct > 3) safetyScore -= 30;
  if (rr < 2) safetyScore -= 25;
  // Position-leverage heuristic: if implied notional > 50× equity, flag.
  const notional = positionSize * input.entry;
  if (notional > input.account * 50) safetyScore -= 15;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // ---- Risk tier label ----
  let status: "safe" | "standard" | "aggressive" | "danger";
  if (input.riskPct <= 0.5) status = "safe";
  else if (input.riskPct <= 1) status = "standard";
  else if (input.riskPct <= 2) status = "aggressive";
  else status = "danger";

  // ---- Warnings ----
  if (input.riskPct > 2 && input.riskPct <= 3) {
    warnings.push(
      `Risk per trade is ${input.riskPct}% — above the 2% aggressive ceiling. Reduce to 1% (standard) for sustainable compounding.`,
    );
  }
  if (input.riskPct > 3) {
    warnings.push(
      `Danger zone: ${input.riskPct}% risk per trade. Three losses in a row drains 9%+ of your account. Cap risk at 2% maximum.`,
    );
  }
  if (rr < 2 && rr >= 1) {
    warnings.push(
      `Reward-to-risk is 1:${rr.toFixed(2)}. Below 1:2 you need a >50% win rate to break even. Pick a wider target or tighter stop.`,
    );
  }
  if (rr < 1) {
    warnings.push(
      `Reward-to-risk is below 1:1 — you risk more than you stand to gain. Reject this setup.`,
    );
  }
  if (notional > input.account * 50) {
    warnings.push(
      `Implied position notional is ${Math.round(notional / input.account)}× your account equity. Verify this is within your broker margin / leverage limits before sending.`,
    );
  }

  return {
    ok: true,
    riskAmount,
    slDistance,
    positionSize,
    lots,
    reward,
    rr,
    safetyScore,
    status,
    warnings,
    errors: [],
  };
}

// ---- Number formatting helpers ------------------------------------------

function fmtMoney(n: number, ccy: "USD" | "INR"): string {
  if (!Number.isFinite(n)) return "—";
  const locale = ccy === "INR" ? "en-IN" : "en-US";
  const symbol = ccy === "INR" ? "₹" : "$";
  return `${symbol}${n.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fmtNumber(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ---- Component ----------------------------------------------------------

export default function RiskFirewallCalculator() {
  // Defaults render a worked example on first visit. Returning users get
  // their saved prefs hydrated below in the mount effect.
  const [market, setMarket] = useState<MarketKey>("xauusd");
  const [direction, setDirection] = useState<Direction>("buy");
  const [accountInput, setAccountInput] = useState("100000");
  const [riskPctInput, setRiskPctInput] = useState("1");
  const [entryInput, setEntryInput] = useState("4310.00");
  const [stopInput, setStopInput] = useState("4300.00");
  const [targetInput, setTargetInput] = useState("4340.00");

  // Track that we've finished the mount-time hydration. We only start
  // saving back to localStorage after this — otherwise the very first
  // render would overwrite the saved value with the SSR default.
  const [hydrated, setHydrated] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // ---- Load saved prefs on mount ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Prefs>;
        if (p.market && (MARKET_KEYS as MarketKey[]).includes(p.market as MarketKey)) {
          setMarket(p.market as MarketKey);
        }
        if (p.direction === "buy" || p.direction === "sell") {
          setDirection(p.direction);
        }
        if (typeof p.account === "string") setAccountInput(p.account);
        if (typeof p.riskPct === "string") setRiskPctInput(p.riskPct);
        setPrefsLoaded(true);
      }
    } catch {
      /* ignored — corrupt prefs blob shouldn't break the calculator */
    }
    setHydrated(true);
  }, []);

  // ---- Persist prefs whenever they change (post-mount only) ----
  useEffect(() => {
    if (!hydrated) return;
    try {
      const prefs: Prefs = {
        market,
        direction,
        account: accountInput,
        riskPct: riskPctInput,
      };
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* ignored — quota / private mode */
    }
  }, [hydrated, market, direction, accountInput, riskPctInput]);

  const result = useMemo<CalcResult>(() => {
    return calc({
      account: parseFloat(accountInput),
      riskPct: parseFloat(riskPctInput),
      market,
      direction,
      entry: parseFloat(entryInput),
      stop: parseFloat(stopInput),
      target: parseFloat(targetInput),
    });
  }, [accountInput, riskPctInput, market, direction, entryInput, stopInput, targetInput]);

  const spec = MARKETS[market];
  const ccy = spec.ccy;

  // ---- Reset handler — clears trade levels + saved prefs ----
  const onReset = () => {
    setAccountInput("");
    setRiskPctInput("");
    setEntryInput("");
    setStopInput("");
    setTargetInput("");
    try {
      localStorage.removeItem(PREFS_KEY);
    } catch {
      /* ignored */
    }
  };

  return (
    <div className="tz-rc">
      {/* ============ INPUTS ============ */}
      <section className="tz-rc-grid">
        {/* Step 01 — pick the market FIRST so account currency + price
            precision + lot size all derive from a known instrument
            before the user enters their balance. */}
        <div className="tz-rc-input-card">
          <h2 className="tz-rc-section-title">
            <span className="tz-rc-section-num">01</span>
            Market &amp; direction
          </h2>

          <Field label="Market">
            <div className="tz-rc-select-wrap">
              <select
                className="tz-rc-select"
                value={market}
                onChange={(e) => setMarket(e.target.value as MarketKey)}
              >
                {MARKET_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {MARKETS[k].label}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Direction">
            <div className="tz-rc-toggle">
              <button
                type="button"
                className={`tz-rc-toggle-btn tz-rc-toggle-buy ${direction === "buy" ? "is-active" : ""}`}
                onClick={() => setDirection("buy")}
                aria-pressed={direction === "buy"}
              >
                <span aria-hidden>▲</span> Buy / Long
              </button>
              <button
                type="button"
                className={`tz-rc-toggle-btn tz-rc-toggle-sell ${direction === "sell" ? "is-active" : ""}`}
                onClick={() => setDirection("sell")}
                aria-pressed={direction === "sell"}
              >
                <span aria-hidden>▼</span> Sell / Short
              </button>
            </div>
          </Field>
        </div>

        {/* Step 02 — once market is set, account currency label + risk
            tier strip are correct. */}
        <div className="tz-rc-input-card">
          <h2 className="tz-rc-section-title">
            <span className="tz-rc-section-num">02</span>
            Account &amp; risk
          </h2>

          <Field
            label={`Account balance (${ccy === "INR" ? "INR" : "USD"})`}
            hint={ccy === "INR" ? "e.g. 100,000" : "e.g. 10,000"}
          >
            <input
              type="number"
              inputMode="decimal"
              className="tz-rc-input"
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              placeholder="0.00"
              min="0"
              step="any"
            />
          </Field>

          <Field
            label="Risk per trade (%)"
            hint="0.5% safe · 1% standard · 2% aggressive · 3%+ danger"
          >
            <input
              type="number"
              inputMode="decimal"
              className="tz-rc-input"
              value={riskPctInput}
              onChange={(e) => setRiskPctInput(e.target.value)}
              placeholder="1"
              min="0"
              step="0.1"
            />
            <RiskTierStrip value={parseFloat(riskPctInput)} />
          </Field>
        </div>

        <div className="tz-rc-input-card">
          <h2 className="tz-rc-section-title">
            <span className="tz-rc-section-num">03</span>
            Trade levels
          </h2>

          <Field label="Entry price" hint={spec.hint}>
            <input
              type="number"
              inputMode="decimal"
              className="tz-rc-input"
              value={entryInput}
              onChange={(e) => setEntryInput(e.target.value)}
              placeholder="0.00"
              min="0"
              step="any"
            />
          </Field>

          <Field
            label="Stop loss"
            hint={direction === "buy" ? "Below entry" : "Above entry"}
          >
            <input
              type="number"
              inputMode="decimal"
              className="tz-rc-input"
              value={stopInput}
              onChange={(e) => setStopInput(e.target.value)}
              placeholder="0.00"
              min="0"
              step="any"
            />
          </Field>

          <Field
            label="Take profit"
            hint={direction === "buy" ? "Above entry" : "Below entry"}
          >
            <input
              type="number"
              inputMode="decimal"
              className="tz-rc-input"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="0.00"
              min="0"
              step="any"
            />
          </Field>
        </div>
      </section>

      {/* ============ ACTIONS ============ */}
      <div className="tz-rc-actions">
        <button type="button" className="tz-rc-btn tz-rc-btn-ghost" onClick={onReset}>
          Reset all
        </button>
        <span className="tz-rc-action-note">
          {prefsLoaded ? (
            <>
              <span className="tz-rc-saved-dot" aria-hidden /> Prefs restored ·
              auto-saved
            </>
          ) : hydrated ? (
            <>Live calc · auto-saves your prefs</>
          ) : (
            <>Live calc · updates as you type</>
          )}
        </span>
      </div>

      {/* ============ RESULTS ============ */}
      {!result.ok ? (
        <div className="tz-rc-error-card" role="alert">
          <div className="tz-rc-error-title">⚠ Fix these to see your numbers</div>
          <ul className="tz-rc-error-list">
            {result.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {/* Safety score banner */}
          <SafetyBanner score={result.safetyScore} status={result.status} />

          {/* Result tiles */}
          <section className="tz-rc-results-grid">
            <ResultTile
              label="Risk amount"
              value={fmtMoney(result.riskAmount, ccy)}
              accent="blue"
              sub={`${riskPctInput}% of account`}
            />
            <ResultTile
              label="Stop-loss distance"
              value={fmtNumber(result.slDistance, spec.pricePrecision)}
              accent="ink"
              sub={`Entry → SL price diff`}
            />
            <ResultTile
              label="Position size"
              value={fmtNumber(result.positionSize, 2)}
              accent="cyan"
              sub={spec.unit}
            />
            {result.lots !== undefined && (
              <ResultTile
                label="Lot equivalent"
                value={fmtNumber(result.lots, 2)}
                accent="cyan"
                sub={`1 lot = ${spec.lotSize} ${spec.unit}`}
              />
            )}
            <ResultTile
              label="Reward potential"
              value={fmtMoney(result.reward, ccy)}
              accent="green"
              sub={`If TP hits cleanly`}
            />
            <ResultTile
              label="Risk-reward"
              value={`1 : ${fmtNumber(result.rr, 2)}`}
              accent={result.rr >= 2 ? "green" : result.rr >= 1 ? "gold" : "red"}
              sub={result.rr >= 2 ? "Acceptable" : result.rr >= 1 ? "Tight — needs >50% hit rate" : "Reject the setup"}
            />
          </section>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <section className="tz-rc-warnings" aria-label="Warnings">
              {result.warnings.map((w) => (
                <div key={w} className="tz-rc-warning">
                  <span className="tz-rc-warning-icon" aria-hidden>!</span>
                  <span>{w}</span>
                </div>
              ))}
            </section>
          )}

          {/* Trading Firewall Advice */}
          <FirewallAdvice score={result.safetyScore} rr={result.rr} riskPct={parseFloat(riskPctInput)} />
        </>
      )}
    </div>
  );
}

// ---- Sub-components -----------------------------------------------------

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="tz-rc-field">
      <span className="tz-rc-field-label">{label}</span>
      {children}
      {hint && <span className="tz-rc-field-hint">{hint}</span>}
    </label>
  );
}

function RiskTierStrip({ value }: { value: number }) {
  const tier = !Number.isFinite(value) || value <= 0
    ? null
    : value <= 0.5
      ? "safe"
      : value <= 1
        ? "standard"
        : value <= 2
          ? "aggressive"
          : "danger";

  return (
    <div className="tz-rc-tier" aria-hidden>
      <span className={`tz-rc-tier-pill tz-rc-tier-safe ${tier === "safe" ? "is-active" : ""}`}>0.5% Safe</span>
      <span className={`tz-rc-tier-pill tz-rc-tier-standard ${tier === "standard" ? "is-active" : ""}`}>1% Standard</span>
      <span className={`tz-rc-tier-pill tz-rc-tier-aggressive ${tier === "aggressive" ? "is-active" : ""}`}>2% Aggressive</span>
      <span className={`tz-rc-tier-pill tz-rc-tier-danger ${tier === "danger" ? "is-active" : ""}`}>3%+ Danger</span>
    </div>
  );
}

function SafetyBanner({
  score,
  status,
}: {
  score: number;
  status: "safe" | "standard" | "aggressive" | "danger";
}) {
  const tone =
    score >= 80 ? "green" : score >= 60 ? "cyan" : score >= 40 ? "gold" : "red";
  const verdict =
    score >= 80
      ? "Trade is mechanically sound. Send it."
      : score >= 60
        ? "Acceptable, with one or two compromises."
        : score >= 40
          ? "Borderline. Tighten your levels before sending."
          : "Reject this setup. Math is against you.";

  return (
    <div className={`tz-rc-safety tz-rc-safety-${tone}`}>
      <div className="tz-rc-safety-left">
        <div className="tz-rc-safety-label">Safety score</div>
        <div className="tz-rc-safety-score">
          {score}
          <span className="tz-rc-safety-100">/100</span>
        </div>
      </div>
      <div className="tz-rc-safety-meter" aria-hidden>
        <div className="tz-rc-safety-meter-fill" style={{ width: `${score}%` }} />
      </div>
      <div className="tz-rc-safety-right">
        <div className="tz-rc-safety-tier">
          {status === "safe" && "Safe risk tier"}
          {status === "standard" && "Standard risk tier"}
          {status === "aggressive" && "Aggressive risk tier"}
          {status === "danger" && "DANGER risk tier"}
        </div>
        <div className="tz-rc-safety-verdict">{verdict}</div>
      </div>
    </div>
  );
}

function ResultTile({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string;
  accent: "blue" | "cyan" | "green" | "gold" | "red" | "ink";
  sub?: string;
}) {
  return (
    <div className={`tz-rc-tile tz-rc-tile-${accent}`}>
      <div className="tz-rc-tile-label">{label}</div>
      <div className="tz-rc-tile-value">{value}</div>
      {sub && <div className="tz-rc-tile-sub">{sub}</div>}
    </div>
  );
}

function FirewallAdvice({
  score,
  rr,
  riskPct,
}: {
  score: number;
  rr: number;
  riskPct: number;
}) {
  const advice: string[] = [];

  if (riskPct <= 0.5) advice.push("Risk-per-trade at 0.5% is conservative — long-term survival territory. Compounding works at this risk level even with average win rates.");
  else if (riskPct <= 1) advice.push("1% risk-per-trade is the standard professional level. You can absorb 5+ consecutive losses without psychological damage.");
  else if (riskPct <= 2) advice.push("2% risk-per-trade is the aggressive ceiling. Limit yourself to 3 attempts per day — a 3-loss streak still costs only 6%.");
  else advice.push("Above 2% risk is danger zone. One losing day can erase a week of gains. Drop to 2% or below before continuing.");

  if (rr >= 3) advice.push("R:R above 1:3 is asymmetric — you can be wrong more than you're right and still profit. This is the type of trade you want.");
  else if (rr >= 2) advice.push("R:R 1:2 is the floor for a sustainable strategy. Anything tighter requires you to be right more often than the market lets you.");
  else advice.push("R:R below 1:2 is a coin-flip dressed up as an edge. Pick a wider target or tighter stop, or skip the trade.");

  if (score >= 80) advice.push("Use this calc as your pre-flight check. If a trade doesn't pass through here cleanly, don't send it. The firewall protects you from yourself.");
  else if (score < 60) advice.push("Low safety scores mean the math is fighting you. Even a 70% win rate can't save a -1.2:1 strategy. Fix the inputs, then send.");

  return (
    <section className="tz-rc-advice">
      <h2 className="tz-rc-advice-title">
        <span className="tz-rc-advice-icon" aria-hidden>🛡</span>
        Trading Firewall Advice
      </h2>
      <ul className="tz-rc-advice-list">
        {advice.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </section>
  );
}
