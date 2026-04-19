---
name: indian-market-strategy-designer
description: Use when the user wants to design, research, or evaluate a new trading strategy for the Indian market (NSE/BSE). Triggers on mentions of "new strategy", "strategy idea", "does this work", "Indian market", "Nifty setup", "what should I build next", or "backtest idea". Produces complete strategy logic before Pine Script is written.
---

# Indian Market Strategy Designer Skill

## When to use
- Designing a new strategy from scratch
- Evaluating whether a strategy idea is worth building
- Deciding what strategy to build next for the product line
- Researching what Indian retail traders respond to

## Indian market context

### Instruments
| Instrument | Lot Size | Daily Range | Best For |
|---|---|---|---|
| Nifty 50 | 75 | 80-150 pts | Beginners, lower margin |
| BankNifty | 30 | 200-400 pts | Higher volatility, Pro traders |
| FinNifty | 65 | 50-120 pts | Growing audience |

### Intraday time zones (NSE)
- 9:15-9:30: High noise — avoid entries
- 9:30-11:00: Trend establishment — best for breakout/momentum
- 11:00-13:00: Range/consolidation — mean reversion works here
- 13:00-14:30: Low volume, choppy — reduce size
- 14:30-15:15: End-of-day moves, stop hunts
- 15:15-15:30: Square-off zone — no new entries

### Key market characteristics
- Gift Nifty drives gap-up/gap-down opens
- Weekly expiry: Thursday (BankNifty/Nifty) — sharp premium decay
- Monthly expiry: last Thursday — avoid scalping
- Budget day, RBI policy days: avoid full size

## Strategy design framework

Define all 6 before writing any Pine Script:

1. **Market condition**: Trending / Ranging / Breakout / Reversal?
2. **Timeframe rationale**: Why this TF? What noise does it filter?
3. **Entry logic**: "Enter LONG when [A] AND [B] AND [C]" — max 3 conditions for Basic tier
4. **Exit logic**: SL method, RR ratio (min 1:1.5), early exit trigger, EOD rule
5. **Filter logic**: What keeps you OUT of bad trades?
6. **Edge assessment**: Win rate expectation, trades/day, market dependency, biggest risk

## Strategy ideas by tier

### Basic (1-2 indicators, visual, beginner-friendly)
- EMA + Supertrend confluence (built)
- VWAP + EMA crossover
- Opening Range Breakout (ORB 9:15-9:30)
- Supertrend + volume confirmation

### Pro (2-3 filters, moderate complexity)
- EMA + RSI + VWAP triple confluence
- Bollinger Band squeeze breakout
- PDH/PDL (Previous Day High/Low) breakout
- Gap-and-go momentum

### Expert (multi-condition, sophisticated)
- Multi-timeframe EMA alignment (5m + 15m + 1h)
- ATR-based dynamic SL trailing
- Intraday mean reversion with BB + RSI divergence

## Sellability checklist

Before recommending a strategy for the product:
- [ ] Entry rule explainable in 1 sentence?
- [ ] Produces 1-4 signals per day?
- [ ] Win rate likely above 45%?
- [ ] RR ratio at least 1:1.5?
- [ ] Works on Nifty or BankNifty?
- [ ] Visually clear on chart (labels, colours)?
- [ ] Different from existing ETS strategies?

## Output format

1. Strategy name + one-line description
2. All 6 design components
3. Sellability checklist (pass/fail each)
4. Recommended tier
5. "Build it" / "Skip it" with reason
6. If "Build it": which indicators to use in Pine Script
