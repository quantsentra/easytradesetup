# Impeccable Design Skill

Apply this skill to every UI component and page built for EasyTradeSetup.

## Core principles

### Spacing is the message
- Never crowd elements. When in doubt, add more vertical space.
- Section padding: `py-24` minimum. Hero: `py-32` or more.
- Use `gap-` and `space-y-` over margin hacks.

### Typography hierarchy
- One dominant headline per section. Max 2 type sizes per visual block.
- Headlines: `font-black tracking-tight` — weight carries authority
- Body: `text-ink-muted`, `leading-relaxed` — ease of reading
- Captions/labels: `text-xs uppercase tracking-widest text-ink-faint`

### Colour discipline
- Accent blue (`#58A6FF`) = information, links, primary actions
- Accent green (`#00C853`) = buy, confirm, positive outcomes
- Accent orange (`#FF9800`) = warnings, urgency — use sparingly
- Accent red (`#F44336`) = errors, risk disclaimers only
- Never use more than 2 accent colours in one section

### Depth and surface
- Background stack: `bg-bg-primary` → `bg-bg-surface` → `bg-bg-raised`
- Cards always on `bg-bg-surface` with `border border-border rounded-card`
- Use `shadow-glow` only on the single most important CTA per page

### Motion
- Hover transitions: `transition-all duration-200` — fast, subtle
- Page-level reveals: `duration-300` max
- Never animate layout shifts — only opacity, transform, color

### Mobile first
- Every component must work at 375px width before desktop
- Tap targets: minimum 44px height
- Bottom drawers (vaul) for any mobile overlay — never modal pop-ups

## Anti-patterns — never do these
- Full-width buttons on desktop
- Centred body text blocks wider than 65ch
- Gradients on text unless it's a single hero headline
- Borders and shadows on the same element (pick one)
- Placeholder grey boxes — build real content or skip the section
