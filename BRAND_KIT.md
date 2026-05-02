# EasyTradeSetup — Brand Kit

Single source of truth for every off-platform surface (YouTube, Instagram, Linktree, ad creatives, slide decks, PDF covers). Anything outside the codebase pulls from here.

Source colors / fonts inside the codebase live in [`landing-page/tailwind.config.ts`](landing-page/tailwind.config.ts) and [`landing-page/app/globals.css`](landing-page/app/globals.css). This file mirrors them in human-readable form for designers.

---

## 1. Names & handles

| Surface | Value |
|---|---|
| Brand name (full) | **EasyTradeSetup** |
| Brand name (alt) | Easy Trade Setup |
| Tagline | One indicator. Lifetime. |
| Sub-tagline (long) | Indicator + Course + Quiz · TradingView Pine v5 |
| Domain | easytradesetup.com |
| Primary email | welcome@easytradesetup.com |
| YouTube | @easytradesetups → https://youtube.com/@easytradesetups |
| Instagram | @easytradesetup (target — claim if free) |
| GitHub | quantsentra/easytradesetup |

**Never use:** "ETS" abbreviation. Removed site-wide. Skip on socials, decks, slides, captions.

---

## 2. Color system

### Background (dark mode is the canonical surface)

| Role | Hex | When to use |
|---|---|---|
| Page bg | `#05070F` | Full-bleed page, banners, ad creatives |
| Surface 1 | `#0E1530` | Cards, panels, second layer |
| Surface 2 | `#0a1224` | Tertiary depth (rare) |

### Brand accents (use ONE primary at a time + brand gold for CTAs)

| Role | Hex | Notes |
|---|---|---|
| **Electric Blue** | `#2B7BFF` | Primary brand. Buttons, links, accents. Lead this color. |
| Cyan | `#22D3EE` | Secondary accent. Pairs with blue in gradients. |
| **Brand Gold** | `#F0C05A` | CTAs ("Buy now"), price badges, "Free" tags. High contrast vs navy. |
| Violet | `#8B5CF6` | Tertiary — use sparingly, never alone. |
| Acid Lime | `#8FCC2A` | "Live", "Free", signal-active states only. Never body text. |
| Amber | `#FFB341` | Warnings, "Inaugural offer" eyebrow text. |

### Trading semantic

| Role | Hex |
|---|---|
| Up / win | `#22C55E` |
| Down / loss | `#FF4D4F` |

### Signature gradient

```
linear-gradient(135deg, #2B7BFF 0%, #22D3EE 60%, #F0C05A 100%)
```

Use on: hero text accents, brand mark fill, OG image, YouTube banner headline. **One signature gradient per asset** — don't compete with itself.

### Inverse / muted

| Role | Hex |
|---|---|
| Ink (white text) | `rgba(255,255,255,0.92)` |
| Ink-60 (subhead) | `rgba(255,255,255,0.60)` |
| Ink-40 (caption) | `rgba(255,255,255,0.40)` |

---

## 3. Typography

Three fonts. All Google Fonts free. Already loaded on the site.

| Role | Font | Weights | Usage |
|---|---|---|---|
| Display (headlines) | **Space Grotesk** | 500 / 600 / 700 | H1, H2, big numbers, banner headlines |
| Body / UI | **Inter Tight** | 400 / 500 / 600 / 700 | Paragraphs, buttons, nav |
| Mono / data | **JetBrains Mono** | 400 / 500 / 700 | Prices, ticker symbols, code, eyebrow labels |

**Sizing scale** (rough — for off-platform creative work)

- Hero headline: 72-96px Space Grotesk 700, letter-spacing -0.02em
- Sub-headline: 24-32px Inter Tight 500
- Eyebrow: 12-14px JetBrains Mono 500 UPPERCASE, letter-spacing 0.16em
- Price: 32-48px JetBrains Mono 700
- Body: 15-17px Inter Tight 400, line-height 1.55

---

## 4. Logo / Brand mark

Canonical mark = **gradient circle + white checkmark spike**.

- Shape: filled circle, blue→cyan gradient (`#2B7BFF → #22D3EE`)
- Symbol: white checkmark, stroke 3px round-cap
- SVG source: see [`landing-page/components/nav/TopNav.tsx`](landing-page/components/nav/TopNav.tsx) → `BrandMark` function
- Padding: 25% clear space on all sides

### Variants needed

| Variant | Size | Format | Notes |
|---|---|---|---|
| Profile pic (square) | 800×800 | PNG | All social profiles |
| Favicon | 32×32, 192×192, 512×512 | PNG | Already in `public/` |
| Wordmark horizontal | 1200×300 | PNG (transparent) | Email signature, slide footer |
| Wordmark stacked | 600×600 | PNG (transparent) | IG profile pic if mark too small |

**Wordmark spec:** mark on left (44×44 box), `EasyTradeSetup` text on right (Space Grotesk 700, white, 22px).

---

## 5. Asset specs by surface

### YouTube banner
- Size: **2560 × 1440 px**
- Safe area (visible everywhere): 1546 × 423 px (centered)
- TV-safe (visible on TV apps): 1235 × 338 px
- Format: PNG or JPG, max 6 MB
- File: `landing-page/public/brand/youtube-banner.png`

### YouTube profile picture
- Size: **800 × 800 px**, served as 98×98 max
- Format: PNG (transparent) or JPG
- File: `landing-page/public/brand/yt-profile.png`

### YouTube end-screen template
- Size: **1920 × 1080 px**
- Slots: 1 large subscribe button (left), 2 video cards (right)
- Last 20s of every video — overlay this template
- File: `landing-page/public/brand/yt-endscreen.png`

### Instagram profile picture
- Size: **320 × 320 px** (uploaded; IG renders at 110×110)
- File: `landing-page/public/brand/ig-profile.png`

### Instagram feed post (carousel)
- Size: **1080 × 1350 px** (4:5 portrait — most real estate)
- Carousel: up to 10 slides, all same size
- Slide 1 = hook. Slide 2-N = value. Slide last = CTA.
- File: `landing-page/public/brand/ig-carousel-template.png`

### Instagram reel cover
- Size: **1080 × 1920 px** (9:16)
- Crop-safe area: middle 1080 × 1350 px (top/bottom hidden by IG UI)
- File: `landing-page/public/brand/ig-reel-cover.png`

### Instagram story
- Size: **1080 × 1920 px**
- Same as reel cover
- File: `landing-page/public/brand/ig-story-template.png`

### Linktree / link-in-bio
- Profile pic: **320 × 320 px** (reuse IG profile)
- Theme: dark, accent `#2B7BFF`

### Email signature
- 600 × 150 px PNG
- Mark + name + tagline + URL

### PDF cover (strategy guides)
- A4 portrait
- Cover: full-bleed `#05070F` + signature gradient stripe + brand mark + title
- Already implemented for in-app PDF prints — reuse style

---

## 6. AI generation prompts

Paste these into Midjourney / DALL-E / Ideogram / Claude (with image). Adjust aspect ratio per surface.

### Prompt — YouTube banner (2560 × 1440)

```
A professional minimalist YouTube banner for a trading indicator brand
called "EasyTradeSetup". 16:9 aspect ratio, 2560x1440 pixels.

Background: deep navy gradient #05070F to #0E1530, subtle radial blue
glow centered. Soft starfield texture. No noise.

Center safe area (1546x423 in middle): big bold headline reading
"EasyTradeSetup" in Space Grotesk Bold, white. Below in smaller cyan
text: "Indicator + Course + Quiz · TradingView Pine v5". Bottom right
corner: "easytradesetup.com" in mono font, 60% white opacity.

Left of safe area: faint stylized candlestick chart in electric blue
(#2B7BFF) and cyan (#22D3EE), lifeline curve flowing across, 30% opacity
so text remains dominant.

Right of safe area: brand mark — gradient circle (blue to cyan) with
white checkmark inside, 200x200px.

Style: clean, modern, fintech, professional. No people. No emojis. No
flashy effects. No drop shadows. No noise. Pure flat-modern dark UI
aesthetic.
```

### Prompt — YouTube profile picture (800 × 800)

```
A circular brand mark logo, 800x800 pixels.

Filled circle with linear gradient from #2B7BFF (top-left) to #22D3EE
(bottom-right), 135 degree angle. Inside, a white checkmark glyph,
3px stroke weight, rounded line caps, centered. Checkmark fills 50%
of the circle.

Soft outer glow in the same blue-cyan tone, 8px radius. Transparent
background outside the circle.

Style: vector, clean, minimal, fintech. No text. No additional shapes.
```

### Prompt — Instagram profile picture (1024 × 1024 — IG crops to circle)

```
A square 1024x1024 profile graphic for an Instagram trading brand
called EasyTradeSetup.

Center: filled circle, gradient #2B7BFF to #22D3EE, white checkmark
inside (3px stroke, rounded). Circle takes up 75% of frame.

Background: solid #05070F (dark navy). Tiny faint gradient glow
behind the mark, same blue-cyan tone.

Below the mark: small "EasyTradeSetup" wordmark in white Space
Grotesk Bold, 60px font size, letter-spacing -0.02em.

Style: dark mode, minimal, fintech. Will be cropped to circle by
Instagram, so keep all critical content within the central 768x768
safe area.
```

### Prompt — Instagram carousel slide template (1080 × 1350)

```
A 1080x1350 (4:5 portrait) Instagram carousel slide template for a
trading indicator brand called EasyTradeSetup.

Background: deep navy #05070F base, subtle radial gradient #0E1530
glow in center, fades to corners.

Top-left corner: small brand mark (gradient circle + white checkmark)
+ wordmark "EasyTradeSetup" in white Space Grotesk Medium, 28px.

Center: large empty headline space — replace later with actual hook
copy. Use placeholder "[ HOOK GOES HERE ]" in Space Grotesk Bold 72px,
white. Below it, smaller subtitle space (40px Inter Tight Regular,
60% white opacity).

Bottom-right: page indicator dots (5 dots, current = electric blue
#2B7BFF, others = 30% white).

Bottom-left: "Swipe →" prompt in JetBrains Mono uppercase, 18px,
60% white opacity, letter-spacing 0.16em.

Top-right: subtle accent — diagonal gradient stripe (blue to cyan),
12px tall, 200px wide, 25% opacity.

Style: dark fintech, minimal, professional, clean grid alignment.
No drop shadows. No noise. No emojis. No people.
```

### Prompt — Instagram reel cover (1080 × 1920)

```
A 1080x1920 (9:16 vertical) Instagram reel cover image for a trading
indicator brand called EasyTradeSetup.

Background: deep navy #05070F gradient to #0E1530, subtle stars.

Top 20%: brand mark (gradient circle + checkmark) + small wordmark
"EasyTradeSetup", white, 28px Space Grotesk Medium.

Middle 60% (the safe-zone for thumbnails): one giant headline word
in Space Grotesk Bold 180px, electric blue #2B7BFF, with the second
word in cyan #22D3EE. Example layout: "LIFELINE / RULES" stacked,
two lines, very tight leading.

Bottom 20%: small ribbon — "Free indicator walkthrough" in JetBrains
Mono uppercase 24px, 60% white opacity, letter-spacing 0.12em.

Optional: faint candlestick pattern in background, 15% opacity, blue
and cyan candles. Single Lifeline curve flowing.

Style: dark fintech, vertical, mobile-first, very high contrast for
thumbnail legibility. No people. No emojis.
```

### Prompt — End-screen template (1920 × 1080)

```
A 1920x1080 YouTube end-screen overlay template for EasyTradeSetup.

Full-bleed background: deep navy #05070F to #0E1530 gradient, subtle
radial blue glow center.

Left half (subscribe area, 960x1080):
  - Brand mark + "EasyTradeSetup" wordmark, top, 80px high
  - Headline "Subscribe for setup walkthroughs" Space Grotesk Bold,
    white, 60px
  - Below: arrow pointing down to where YouTube auto-injects the
    subscribe circle (centered around y=540, x=480, 300px diameter)
  - Bottom: "easytradesetup.com" mono 24px, 60% white

Right half (video cards, 960x1080):
  - Two large empty rectangles top + bottom (where YouTube auto-inserts
    next-video thumbnails). Each 600x340px, 8px gap, with subtle
    1px border in #2B7BFF 40% opacity.
  - Above top rectangle: "↑ Watch next" in JetBrains Mono uppercase
    20px, 60% white, letter-spacing 0.16em.

Style: minimal, dark, fintech, no clutter. Empty zones explicitly
left for YouTube to inject native widgets — do not fill them.
```

---

## 7. Voice & copy guidelines

### Always

- Founder-first. "I built…", "I lost on…", "I spent two years…"
- Show the chart. Talk numbers. Trader voice.
- Hindi-friendly: phrases like "no signal calls", "no copy-trade", "lifetime, no subscription" land harder than abstract benefit copy.
- "Educational. You decide every trade." on every commercial surface.

### Never

- "Guaranteed returns" / "100% accurate" / "win every trade" — illegal in India under SEBI, off-brand globally.
- "Game-changer" / "revolutionary" / "secret formula" — generic-marketer slop.
- Fake testimonials. Fake screenshots. Fake P&L.
- "ETS" abbreviation.
- Emojis in body copy. (One emoji in eyebrow / hook is fine — don't pepper.)

---

## 8. File organisation

Drop all generated assets here:

```
landing-page/public/brand/
├── youtube-banner.png            (2560×1440)
├── yt-profile.png                (800×800)
├── yt-endscreen.png              (1920×1080)
├── ig-profile.png                (1024×1024)
├── ig-carousel-template.png      (1080×1350)
├── ig-reel-cover.png             (1080×1920)
├── ig-story-template.png         (1080×1920)
├── wordmark-horizontal.png       (1200×300, transparent)
└── wordmark-stacked.png          (600×600, transparent)
```

Source files (Figma / Canva / Photoshop master files) live outside the repo. Don't commit `.psd` / `.fig` / `.ai`.

---

## 9. Quick checklist before publishing any new asset

- [ ] Background = `#05070F` (or matches site bg)
- [ ] Brand mark uses `#2B7BFF → #22D3EE` gradient + white checkmark
- [ ] Headline font = Space Grotesk Bold
- [ ] Body font = Inter Tight
- [ ] Eyebrow / data = JetBrains Mono uppercase, letter-spacing 0.16em
- [ ] No "ETS" abbreviation anywhere
- [ ] No fake testimonials, no fake numbers
- [ ] Disclaimer "Educational. You decide every trade." on commercial surfaces
- [ ] URL bottom-right: `easytradesetup.com` in mono, 60% white opacity
- [ ] Saved to `landing-page/public/brand/` with the canonical filename above
