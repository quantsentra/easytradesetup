---
name: gumroad-product-packager
description: Use when the user wants to package, update, or create Gumroad product listings for EasyTradeSetup. Triggers on mentions of Gumroad, product listing, pricing, ZIP packaging, tier, upload, or "ready to sell". Handles 3-tier structure (Basic/Pro/Expert), ZIP contents, product descriptions, and Colab packaging updates.
---

# Gumroad Product Packager Skill

## When to use
- Setting up a new Gumroad product listing (copy, pricing, files)
- Adding a new strategy to an existing tier ZIP
- Updating the Colab notebook TIERS config with new files
- Writing Gumroad product descriptions that convert

## Tier structure

| Tier | INR | USD | Contents |
|------|-----|-----|---------|
| Basic | Rs 999 | ~$12 | 1 strategy + 1 Pine Script + PDF + cheat sheet |
| Pro | Rs 1,999 | ~$24 | 2 strategies + 2 scripts + trade journal + risk calculator |
| Expert | Rs 3,999 | ~$48 | 5 strategies + 5 scripts + master playbook + 30 examples + lifetime updates |

Gumroad uses USD. Convert at current rate, round to nearest $1.

## ZIP file structure (always enforce)

```
ETS-[Tier]-Pack-v[X.Y].zip
├── README.txt
├── scripts/
│   └── ETS-[Name]-v1.0.pine
└── guides/
    └── ETS-[Name]-Strategy-Guide-v1.0.pdf
```

## Gumroad product description format

```
[1-line hook — outcome or pain point]

WHAT YOU GET:
• [item 1]
• [item 2]
• [item 3]

WHO IT'S FOR:
Nifty & BankNifty intraday traders — beginner to intermediate.
Works on free TradingView account. Indian market focus.

HOW IT WORKS:
[2-3 sentences, plain English strategy logic]

INSTANT DELIVERY:
Download link sent to your email immediately after payment.
No subscription. Yours forever.

Trading involves risk. Not SEBI-registered financial advice.
```

## Colab TIERS config

When adding a new script/PDF, output the full updated TIERS dict for Step 6 of ETS-Builder.ipynb:

```python
TIERS = {
    'Basic':  {'price':'999',  'output':'ETS-Basic-Pack-v1.0.zip',
               'scripts':['ETS-Intraday-v1.0.pine'],
               'pdfs':['ETS-Intraday-Strategy-Guide-v1.0.pdf']},
    'Pro':    { ... },
    'Expert': { ... },
}
```

Always show the complete dict, not a partial diff.

## Pricing rules

- Launch offer: max 30% discount, 48-hour window only
- Pro should be ~2x Basic (not 2.5x)
- Expert should be ~4x Basic (anchor price)
- Mark Pro as "Most Popular" on landing page

## Output format

1. Updated TIERS dict for Colab notebook
2. Gumroad product description (paste-ready)
3. File checklist before upload
4. Landing page index.html changes needed (Gumroad URL placeholders)
