---
name: trading-playbook-pdf
description: Use when the user wants to generate, update, or add content to a strategy PDF guide for EasyTradeSetup. Triggers on mentions of PDF, strategy guide, playbook, documentation, or "write the guide for". Produces structured content ready for the Colab PDF generator (ETS_PDF class using fpdf2).
---

# Trading Playbook PDF Skill

## When to use
- Writing a new strategy PDF guide for a Pine Script
- Adding trade examples, screenshots descriptions, or FAQ entries
- Updating existing PDF content for a new version
- Generating the full Colab cell that builds a PDF

## What to produce

Always output two things:
1. Section-by-section copy (final text, not suggestions)
2. Complete Colab Python cell using ETS_PDF class — drop-in ready for ETS-Builder.ipynb

## Standard PDF structure (8 pages minimum)

| Page | Section |
|------|---------|
| 1 | Cover: strategy name, tagline, version, easytradesetup.com |
| 2 | Disclaimer + TradingView setup steps |
| 3 | Indicator guide: what each does, how to read it, why we use it |
| 4 | Long trade rules: entry checklist, SL, target, early exit |
| 5 | Short trade rules: same structure |
| 6 | Risk management: 3 core rules, position sizing, common mistakes |
| 7 | Quick reference cheat sheet |
| 8 | FAQ: 5-6 questions from Indian retail traders |

## Writing style rules

- Audience: Indian retail F&O trader, beginner to intermediate
- Tone: Direct, practical, no jargon without explanation
- Numbers: Indian format (Rs 2,00,000 not Rs 200000)
- Examples: Always use Nifty/BankNifty round numbers (44,000 / 48,000)
- Be definitive — avoid "you might", "consider", "potentially"
- Disclaimer on page 2 is mandatory, never skip

## ETS_PDF class API

```python
pdf.bg_fill()              # dark background fill
pdf.h2("Title")            # section heading with blue underline
pdf.h3("Subtitle")         # subsection heading
pdf.body("text")           # body paragraph, muted colour
pdf.bullet("text")         # indented bullet
pdf.box("Title", [         # coloured content box
    "line 1",
], title_color)            # C_BLUE / C_GREEN / C_RED / C_ORANGE
```

Colours: C_BG, C_SURFACE, C_BLUE, C_GREEN, C_RED, C_TEXT, C_MUTED, C_ORANGE

## Output format

1. Section copy (markdown, ready to paste into Colab strings)
2. Complete Colab Python cell that builds the PDF
3. Filename: ETS-[StrategyName]-Strategy-Guide-v[X.Y].pdf
4. Save path: ETS_ROOT / '02_PDFs' / filename
