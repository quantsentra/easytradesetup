---
name: pine-script-builder
description: Use when the user asks to create, modify, or debug a TradingView Pine Script indicator or strategy — especially for Indian markets (Nifty, BankNifty, FinNifty, or NSE stocks). Triggers on mentions of Pine Script, TradingView, indicator, alertcondition, plotshape, or intraday strategies. Handles v5 syntax, IST session filters, NSE lot sizes, and ATR-based risk management.
---

# Pine Script Builder (Indian Markets)

## When to Use
- Creating new indicators or strategies for Nifty/BankNifty/NSE stocks
- Adding filters (EMA, RSI, ATR, volume, VWAP) to existing scripts
- Converting a trading rule in English into working Pine Script
- Debugging red errors in the Pine Editor
- Adding IST session filters, mobile alerts, or dashboards

## Core Conventions (always apply)

### Always use v5
Start every script with `//@version=5`. Never mix v4 and v5 syntax.

### Indian market session filters
Use Asia/Kolkata timezone. Market hours: 9:15 AM to 3:30 PM IST.
Intraday trading window: 9:15 to 3:15 (exit by 3:15, never hold overnight).

​```pinescript
sessStart = input.session("0915-1500", "Trading Session")
inSession = not na(time(timeframe.period, sessStart, "Asia/Kolkata"))
​```

### Lot sizes (as of current NSE rules — verify before use)
- Nifty 50: 75
- BankNifty: 30
- FinNifty: 65
- Sensex: 20
- Remind the user to verify current lot sizes on NSE website before sharing with buyers.

### Risk management defaults
- Stop loss: 1.2× to 1.5× ATR(14)
- Target 1: 1.0× ATR (book 50%, move SL to entry)
- Target 2: 2.0× to 2.5× ATR (trail or book remaining)
- Hard exit: 3:15 PM IST

### Alert conventions
Every tradeable script must have `alertcondition` for both LONG and SHORT signals with clear messages. Alert messages should say what to do, not just "signal fired".

### Dashboard pattern
Every indicator gets a top-right `table` dashboard showing filter status. Use green/red/gray for pass/fail/neutral. Update only on `barstate.islast` to avoid performance issues.

## Standard template structure

1. `//@version=5` + `indicator()` declaration with `overlay=true` for price-overlay indicators
2. Inputs grouped by purpose (Trend / Momentum / Volatility / Risk / Session / Visuals)
3. Calculations (EMAs, RSI, ATR, etc.)
4. Session check
5. Filter booleans (each filter as a named bool)
6. Combined entry signals (`longSignal`, `shortSignal`)
7. SL/TP state variables using `var`
8. Plots (EMAs, labels, SL/TP lines)
9. `alertcondition` for each direction
10. Dashboard table (top-right, updated on `barstate.islast`)

## Common pitfalls to avoid
- **Using `na` comparisons with `==`**: always use `na(x)` instead of `x == na`
- **Repainting**: use `barstate.isconfirmed` for signals that should only fire on closed candles
- **Session function misuse**: `time(timeframe.period, session, timezone)` returns `na` outside the session — check with `not na(...)`, not `!= na`
- **Fixed point SL/TP**: always use ATR-based, never hardcoded (e.g., "50 points")
- **Alert spam**: use `alertcondition` with `once_per_bar_close` when creating the alert in TradingView UI

## Testing workflow
After generating a script:
1. Save to `.pine` file in `pine-scripts/v1/` folder (follows existing project structure)
2. Also save as `.txt` in `deliverables/` for Gumroad packaging (buyers prefer `.txt`)
3. Tell the user the exact steps: open TradingView → Pine Editor → paste → Save → Add to Chart
4. Ask them to report the exact red error text if any
5. Common first-try errors: `line X: mismatched input` usually means leftover default code wasn't deleted

## Project conventions for EasyTradeSetup
- Pine scripts live in `pine-scripts/v1/` (version bump to v2 for breaking changes)
- Naming: `ETS-<StrategyName>-v<X>.<Y>.pine` (e.g., `ETS-Intraday-v1.0.pine`)
- Matching playbook PDF should be generated via the `trading-playbook-pdf` skill

## EasyTradeSetup visual standards (apply to every script)

```pinescript
// Colour palette — use these exactly
C_BLUE   = #58A6FF   // fast EMA, panel headers
C_ORANGE = #FF9800   // slow EMA, secondary
C_GREEN  = #00C853   // bull signals, long labels
C_RED    = #F44336   // bear signals, short labels
C_MUTED  = #8B949E   // panel labels, neutral text
C_BG     = #0D1117   // panel background
```

BUY labels: `shape.labelup`, `location.belowbar`, green, text="BUY"
SELL labels: `shape.labeldown`, `location.abovebar`, red, text="SELL"
Background: green tint when bullish session, red tint when bearish (opacity ~94%)

## Mandatory info panel (top-right table)

Every strategy script must show a 2×5 info panel with:
- Row 0: "EasyTradeSetup" | version
- Row 1: "Trend" | BULL/BEAR (coloured)
- Row 2: Primary signal state | value
- Row 3: RSI | current value (coloured by zone)
- Row 4: "Session" | ACTIVE/CLOSED

## Product tier mapping

| Complexity | Indicators | Tier |
|---|---|---|
| Simple (1–2 indicators) | EMA, Supertrend | Basic |
| Medium (2–3 indicators) | + RSI / VWAP / Volume | Pro |
| Advanced (3–4 indicators) | + ATR SL, multi-target | Expert |

## After generating a script

1. Save to `pine-scripts/v1/ETS-<Name>-v1.0.pine`
2. Add the filename to `automation/generate_notebook.js` under the correct tier's `scripts` array
3. Commit: `git add pine-scripts/ && git commit -m "Add ETS-<Name> Pine Script"`
4. Re-run the Colab notebook to rebuild ZIPs with the new script included