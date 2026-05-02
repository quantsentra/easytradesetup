# Handoff: EasyTradeSetup Brand Kit

## Overview

This package contains the full EasyTradeSetup brand kit — a high-fidelity interactive HTML reference built in one file (`brand-kit.html`). It covers colors, typography, logo variants, signature gradient, social asset specs, YouTube Shorts playbook, Instagram Reels playbook, voice & copy guidelines, and downloadable logo assets.

**Your task:** Inject this brand kit as a route or page inside your existing Next.js / React site (`easytradesetup.com`). The HTML file is a design reference — recreate each section using your codebase's existing patterns (Tailwind, shadcn/ui, etc.), not by shipping the raw HTML.

---

## Fidelity

**High-fidelity.** Every color, spacing value, font size, weight, letter-spacing, and interaction in the HTML prototype is final and should be reproduced exactly. Use `design-tokens.json` as the ground truth for all token values.

---

## Tech Stack Assumptions

The existing site uses:
- **Next.js** (App Router, `landing-page/` root)
- **Tailwind CSS** (`tailwind.config.ts` + `globals.css`)
- **React** (18+)
- Font imports already live in the project: Space Grotesk, Inter Tight, JetBrains Mono

---

## Suggested Route

```
/brand  →  app/brand/page.tsx
```

Protect behind a simple password or `NEXT_PUBLIC_BRAND_KIT_ENABLED=true` env flag if you don't want it public.

---

## File Structure (suggested)

```
landing-page/
├── app/
│   └── brand/
│       ├── page.tsx               # Route shell
│       ├── layout.tsx             # Optional: full-bleed dark layout override
│       └── components/
│           ├── BrandNav.tsx       # Sidebar navigation
│           ├── BrandMark.tsx      # SVG brand mark component
│           ├── ColorSwatch.tsx    # Clickable swatch with copy-to-clipboard
│           ├── SectionHeader.tsx  # Eyebrow + title + subtitle
│           ├── OverviewSection.tsx
│           ├── ColorsSection.tsx
│           ├── TypographySection.tsx
│           ├── LogoSection.tsx
│           ├── GradientSection.tsx
│           ├── SocialSection.tsx
│           ├── TemplatesSection.tsx
│           ├── YTShortsSection.tsx
│           ├── IGReelsSection.tsx
│           ├── VoiceSection.tsx
│           └── ChecklistSection.tsx
└── public/
    └── brand/
        ├── youtube-banner.png
        ├── yt-profile.png
        ├── yt-endscreen.png
        ├── ig-profile.png
        ├── ig-carousel-template.png
        ├── ig-reel-cover.png
        ├── ig-story-template.png
        ├── wordmark-horizontal.png
        └── wordmark-stacked.png
```

---

## Design Tokens

All tokens live in `design-tokens.json`. Map them to your Tailwind config or CSS variables. Key values:

### Colors

| Token | Value | Usage |
|---|---|---|
| `pageBg` | `#05070F` | Page background, all sections |
| `surface1` | `#0E1530` | Cards, panels |
| `surface2` | `#0a1224` | Tertiary depth |
| `navBg` | `#070B1A` | Sidebar + header |
| `electricBlue` | `#2B7BFF` | Primary accent, buttons, links |
| `cyan` | `#22D3EE` | Secondary accent, gradient pair |
| `brandGold` | `#F0C05A` | CTAs, price badges |
| `violet` | `#8B5CF6` | Tertiary, use sparingly |
| `acidLime` | `#8FCC2A` | Live/active states only |
| `amber` | `#FFB341` | Warnings, eyebrow |
| `up` | `#22C55E` | Win/bullish/success |
| `down` | `#FF4D4F` | Loss/bearish/error |
| `ink` | `rgba(255,255,255,0.92)` | Primary text |
| `ink60` | `rgba(255,255,255,0.60)` | Secondary text |
| `ink40` | `rgba(255,255,255,0.40)` | Captions |
| `divider` | `rgba(255,255,255,0.06)` | Borders, dividers |

### Signature Gradient
```css
background: linear-gradient(135deg, #2B7BFF 0%, #22D3EE 60%, #F0C05A 100%);
```
Use on: hero text (`background-clip: text`), gradient stripe accents, brand mark fill. **One per page/asset — never repeat on same surface.**

### Typography

```css
/* Display */
font-family: 'Space Grotesk', sans-serif;
font-weight: 700;
letter-spacing: -0.02em;

/* Body / UI */
font-family: 'Inter Tight', sans-serif;
font-weight: 400;
line-height: 1.55;

/* Mono / Data / Eyebrow */
font-family: 'JetBrains Mono', monospace;
font-weight: 500;
letter-spacing: 0.16em;
text-transform: uppercase;
```

---

## Layout Shell

The brand kit uses a fixed sidebar + scrollable main layout:

```
┌──────────┬────────────────────────────────────┐
│ Sidebar  │  Header (52px, sticky)             │
│ 220px    ├────────────────────────────────────┤
│ collap-  │                                    │
│ sible    │  Section content (scrollable)      │
│ → 56px   │  padding: 32px 32px 60px           │
│          │                                    │
└──────────┴────────────────────────────────────┘
```

**Sidebar:**
- Width: 220px expanded, 56px collapsed
- Background: `#070B1A`
- Right border: `1px solid rgba(255,255,255,0.06)`
- Active item: `background: rgba(43,123,255,0.12)`, `border-left: 2px solid #2B7BFF`
- Font: Inter Tight 13px, weight 400 inactive / 600 active
- Collapse toggle: hamburger button in header

**Header:**
- Height: 52px
- Background: `#05070F`
- Bottom border: `1px solid rgba(255,255,255,0.06)`
- Left: collapse toggle + current section label (JetBrains Mono 11px, ink40, uppercase)
- Right: domain label + 3 color dots (Blue/Cyan/Gold)

---

## Sections

### 1. Overview
**Purpose:** Brand at a glance — name, tagline, all handles.

**Hero block:**
- Background: `linear-gradient(135deg, #0E1530, #05070F)`
- Border: `1px solid rgba(255,255,255,0.07)`, border-radius 16px
- Padding: 60px 48px
- Radial glow: `rgba(43,123,255,0.15)` top-left, `rgba(34,211,238,0.08)` bottom-right
- Brand mark (56px) + H1 with gradient text clip
- Body: Inter Tight 16px, ink60, max-width 540px
- Badges row: background `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.08)`, radius 8px, padding 8px 16px

**Stats grid:** 4 cards, `gridTemplateColumns: repeat(auto-fill, minmax(160px, 1fr))`, gap 16px
- Each: surface1 bg, number in JetBrains Mono 700 32px `#2B7BFF`, label Inter Tight 13px ink50

**Handles grid:** `repeat(auto-fill, minmax(220px, 1fr))`, click-to-copy

---

### 2. Colors
**Purpose:** Full palette with one-click copy.

Each swatch is a card with:
- Color block: 56px tall (80px for large variant)
- Name: Inter Tight 600 13px
- Hex: JetBrains Mono 10px ink50
- Role: Inter Tight 11px ink35
- Hover: `translateY(-2px)`, border-color `rgba(43,123,255,0.4)`
- Click: copies hex to clipboard, shows toast

Groups: Backgrounds · Brand Accents · Trading Semantic · Ink/Text · Signature Gradient

---

### 3. Typography
**Purpose:** Typeface specimens with live scale preview.

Three font cards (Space Grotesk, Inter Tight, JetBrains Mono):
- Surface1 card, role/weights in eyebrow style
- Sample text rendered in that font at its canonical size
- Divider between meta and specimen

**Scale slider:** `input[type=range]`, min 0.5 max 2.5 step 0.1, accent-color `#2B7BFF`. Multiplies all specimen sizes.

**Type scale reference table:** 6 rows (Hero, Sub-headline, Eyebrow, Price, Body, Button). Grid: 180px label col + 1fr specimen col.

---

### 4. Logo & Mark
**Purpose:** All logo variants across backgrounds + download.

**BrandMark SVG (48×48 viewBox):**
```tsx
// BrandMark.tsx
export function BrandMark({ size = 48 }: { size?: number }) {
  const id = `bm-${size}-${Math.random().toString(36).slice(2,6)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2B7BFF"/>
          <stop offset="1" stopColor="#22D3EE"/>
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill={`url(#${id})`}/>
      <polyline
        points="13,24 21,32 35,16"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
```

**Background toggle:** 4 states — Dark (`#05070F`), Surface (`#0E1530`), Light (`#F0F4FF`), White (`#FFFFFF`). Pill toggle buttons, active state `rgba(43,123,255,0.12)` + `#2B7BFF` border.

**Logo grid:** 4 cards — Mark only, Wordmark horizontal, Mark large, Wordmark stacked

**Download buttons:**
Use `canvas.toBlob()` to export PNG. For SVG, serialize with `XMLSerializer`. Trigger download via `<a>` with `URL.createObjectURL`. Assets to export:
- Brand mark SVG (viewBox 0 0 200 200)
- Brand mark PNG 800×800 transparent
- Brand mark PNG 200×200 transparent
- Wordmark horizontal PNG 1200×300 (`#05070F` bg)
- Wordmark stacked PNG 600×600 (`#05070F` bg)
- Profile pic PNG 800×800 (`#05070F` bg)

Button style: `rgba(43,123,255,0.08)` bg, `rgba(43,123,255,0.35)` border, `#2B7BFF` text, JetBrains Mono 10px uppercase, hover → `rgba(43,123,255,0.18)`.

---

### 5. Gradient
**Purpose:** Live signature gradient explorer.

- Color block: 160px tall, full width, gradient at current angle
- Angle slider: 0–360°, step 5, default 135
- CSS string updates live
- Reset to 135° button + Copy CSS button

Usage examples: gradient text clip, brand mark, CTA border glow (box-shadow), stripe bar

---

### 6. Social Assets
**Purpose:** Specs + file paths for all 10 asset types.

Two-column layout:
- Left: vertical list of 10 asset tabs (180px min-width)
- Right: spec panel with name, dimensions, format badge, note badge, scaled preview, file path (click to copy)

Active tab: `rgba(43,123,255,0.1)` bg, `#2B7BFF` border, `#2B7BFF` text

Scaled previews: `<div>` mocks using brand colors, not real images (actual images go in `public/brand/`).

---

### 7. Templates
**Purpose:** Full-fidelity visual previews of every designed asset.

Four sub-tabs: YouTube · Instagram · Wordmarks · Email / PDF

**YouTube tab:**
- YT Banner: `aspect-ratio: 2560/1440`, with candlestick decoration, safe area dashed box, brand mark, URL
- YT Profile: square, brand mark centered
- End Screen: 16:9, two-column layout (subscribe left, video slots right)

**Instagram tab:**
- IG Carousel: 1080/1350 aspect ratio, brand mark top-left, hook placeholder text, swipe indicator, page dots
- IG Profile: circle crop preview
- IG Reel: 9/16, stacked LIFE/LINE/RULES in Blue/Cyan/Gold

**Wordmarks tab:**
- Horizontal: mark + wordmark on dark bg
- Stacked: mark above, wordmark below, tagline in mono

**Email/PDF tab:**
- Email signature: mark + name + tagline + URL, blue left border
- PDF cover: A4 aspect ratio, gradient stripe top, section label, title, footer

---

### 8. YouTube Shorts
**Purpose:** Full production playbook for Shorts content.

**Specs grid:** 6 cards (Aspect Ratio, Max Duration, Format, Max File Size, FPS, Safe Zone)

**Safe zone diagram:** 120px wide 9/16 container with:
- Top 12%: `rgba(255,77,79,0.12)` — "TOP UI (avoid)"
- Middle 62%: `rgba(34,197,94,0.06)` — "SAFE CONTENT"
- Bottom 26%: `rgba(255,179,65,0.1)` — "BOTTOM UI"

Legend explains each zone with implementation notes.

**3-Frame Rule** (tab switcher):
- Frame 0 — Hook Frame (0–2s)
- Frame 1 — Chart Frame
- Frame 2 — CTA Frame (last 3s)

Each frame: 140px wide 9/16 preview + rules card

**Title/Description baseline:** Two columns of bullet rules

**Thumbnail rules:** 4 cards in auto-fill grid

---

### 9. Instagram Reels
**Purpose:** Full production playbook for Reels content.

**Four tabs:** Specs & Safe Zones · Cover Design · Caption & Hashtags · Reel Checklist

**Specs tab:**
- 6 spec cards
- IG safe zone diagram (different from Shorts — add right rail 18%, bottom meta 22%)
- YT Shorts vs IG Reels comparison table (10 rows)

**Cover Design tab:**
- 9/16 cover preview (160px wide) with gradient stripe, brand mark, big stacked text, bottom scrim
- 1:1 grid crop preview (160×160) with amber dashed border
- Cover rules: 6 cards

**Caption & Hashtags tab:**
- Caption template block in `#070B1A` bg
- Copy template button
- 3-column hashtag grid: Brand / Product / Reach, click any tag to copy

**Reel Checklist tab:**
- 16-item interactive checklist
- Progress bar: gradient `#22D3EE → #2B7BFF`, turns `#22C55E` when complete

---

### 10. Voice & Copy
**Purpose:** Writing guidelines.

Two-column cards: Always (green border) vs Never (red border).
Each item: bold title + description, separated by subtle divider.

**Sample copy patterns table:** 5 rows, click any row to copy the copy string.
Each row: label (JetBrains Mono 9px) + specimen rendered in its final style.

---

### 11. Checklist
**Purpose:** Pre-publish quality gate.

- 10-item interactive checklist
- Progress bar
- "Check All" + "Reset" buttons
- All-complete success state: `rgba(34,197,94,0.1)` bg card

---

## Interactions

### Copy to clipboard
```ts
async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
  showToast(`Copied ${text}`);
}
```

### Toast notification
```css
/* Fixed bottom-center, slides up on show */
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: #22C55E;
  color: #000;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 40px;
  z-index: 9999;
  opacity: 0;
  transition: all 0.25s ease;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
```

Duration: 1800ms, then remove `.show`.

### Logo PNG download
```ts
function downloadBrandMarkPNG(size: number, filename: string) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2, cy = size / 2, r = size * 0.45;
  const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  grad.addColorStop(0, '#2B7BFF');
  grad.addColorStop(1, '#22D3EE');
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Checkmark
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.55, cy);
  ctx.lineTo(cx - r * 0.05, cy + r * 0.5);
  ctx.lineTo(cx + r * 0.65, cy - r * 0.5);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = r * 0.14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob!);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  });
}
```

### Sidebar collapse
Toggle between `220px` and `56px` width. Persist in `localStorage('brandkit-sidebar-collapsed')`. Hide label text when collapsed; keep icon centered.

---

## Responsive Behavior

The brand kit is a desktop-first internal tool. Minimum supported width: 768px.

- Below 768px: sidebar auto-collapses (icon only)
- Content area: `min-width: 0` to prevent flex overflow
- Cards and grids: `repeat(auto-fill, minmax(...px, 1fr))` — already responsive
- Asset preview diagrams: `max-width` capped, centered in container

---

## State Management (per section)

| Section | State |
|---|---|
| Logo | `bgMode: 'dark' \| 'surface' \| 'light' \| 'white'` |
| Gradient | `angle: number` (0–360, default 135) |
| Typography | `scale: number` (0.5–2.5, default 1.0) |
| Social Assets | `selectedAsset: string` |
| Templates | `activeTab: 'yt' \| 'ig' \| 'wordmark' \| 'email'` |
| YT Shorts | `previewSlide: 0 \| 1 \| 2` |
| IG Reels | `activeTab: 'specs' \| 'cover' \| 'caption' \| 'checklist'` |
| Checklist (all) | `checked: boolean[]` |
| Sidebar | `collapsed: boolean` (persist to localStorage) |

All state is local component state. No global store needed.

---

## Assets

### Fonts (Google Fonts — already loaded on site)
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

### Brand mark
Constructed in SVG/Canvas — no external image needed. See `BrandMark.tsx` spec above.

### Social asset placeholders
All previews in the brand kit use inline CSS + SVG to simulate the final assets. Actual exported PNG files should live in `public/brand/` (see file list in design-tokens.json).

---

## Files in This Package

| File | Purpose |
|---|---|
| `brand-kit.html` | **High-fidelity design reference.** Open in browser to see the full intended UI. Do not ship this file directly. |
| `design-tokens.json` | Machine-readable token file. Import into Tailwind config or CSS variables. |
| `README.md` | This file. |

---

## Quick-start for Claude Code

Paste this into your Claude Code session to get started:

```
I have a design handoff package in design_handoff_brand_kit/. 
Please read README.md and design-tokens.json first, then open brand-kit.html as a visual reference.

My goal: add a /brand route to the existing Next.js app in landing-page/ that recreates 
this interactive brand kit using Tailwind CSS and the existing project patterns.

Start by:
1. Reading landing-page/tailwind.config.ts and landing-page/app/globals.css to understand existing tokens
2. Creating landing-page/app/brand/page.tsx with the sidebar layout shell
3. Implementing sections one by one, starting with Overview and Colors
```

---

## Checklist Before Injecting

- [ ] Fonts (Space Grotesk, Inter Tight, JetBrains Mono) confirmed loaded in project
- [ ] Route `/brand` created and accessible
- [ ] Dark layout override applied (bg `#05070F`, no white body background leaking)
- [ ] `design-tokens.json` values mapped to Tailwind theme extension or CSS variables
- [ ] `public/brand/` directory created for future asset exports
- [ ] Clipboard API confirmed working (requires HTTPS or localhost)
- [ ] Canvas download confirmed working in target browser
- [ ] Sidebar collapse state persisted to localStorage

---

*Handoff generated May 2026. Design reference: brand-kit.html.*
