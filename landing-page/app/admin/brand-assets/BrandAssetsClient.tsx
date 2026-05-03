"use client";

import Link from "next/link";

// Brand colors / fonts — kept literal here so the generators don't depend on
// CSS vars that aren't available off-screen during canvas rasterisation.
const C = {
  bg: "#05070F",
  surface: "#0E1530",
  blue: "#2B7BFF",
  cyan: "#22D3EE",
  gold: "#F0C05A",
  violet: "#8B5CF6",
  acid: "#8FCC2A",
  amber: "#FFB341",
  up: "#22C55E",
  down: "#FF4D4F",
  ink: "rgba(255,255,255,0.92)",
  ink60: "rgba(255,255,255,0.60)",
  ink40: "rgba(255,255,255,0.40)",
} as const;

// SVG of the brand mark — sized to fit the viewBox, not a fixed pixel size.
// Single source: matches BrandMark in components/nav/TopNav.tsx + the new
// OG image badge.
function brandMarkSvg(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${C.blue}"/>
      <stop offset="1" stop-color="${C.cyan}"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="32" fill="url(#g)"/>
  <path d="M19 33l9 9 18-21" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function downloadSvg(svg: string, filename: string) {
  downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), filename);
}

// SVG → PNG via offscreen canvas. Returns a promise so callers can await.
async function svgToPng(svg: string, w: number, h: number): Promise<Blob> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Fully canvas-rendered wordmark — avoids font-loading races inside the
// rasterised SVG. Mark on the left, "EasyTradeSetup" text on the right.
function wordmarkCanvas(width: number, height: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Transparent bg
  ctx.clearRect(0, 0, width, height);

  // Mark — left side, square, padded
  const padding = height * 0.18;
  const markSize = height - padding * 2;
  const markX = padding;
  const markY = padding;

  // Gradient fill
  const grad = ctx.createLinearGradient(markX, markY, markX + markSize, markY + markSize);
  grad.addColorStop(0, C.blue);
  grad.addColorStop(1, C.cyan);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(markX + markSize / 2, markY + markSize / 2, markSize / 2, 0, Math.PI * 2);
  ctx.fill();

  // Checkmark inside mark
  const cx = markX + markSize / 2;
  const cy = markY + markSize / 2;
  const r = markSize / 2;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = r * 0.18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy + r * 0.05);
  ctx.lineTo(cx - r * 0.05, cy + r * 0.35);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.30);
  ctx.stroke();

  // Wordmark text
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  const fontSize = Math.round(height * 0.45);
  ctx.font = `700 ${fontSize}px "Space Grotesk", "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("EasyTradeSetup", markX + markSize + padding * 0.8, height / 2);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

function wordmarkStackedCanvas(size: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Transparent bg (PNG)
  ctx.clearRect(0, 0, size, size);

  // Mark — top half centred
  const markSize = size * 0.55;
  const markX = (size - markSize) / 2;
  const markY = size * 0.10;

  const grad = ctx.createLinearGradient(markX, markY, markX + markSize, markY + markSize);
  grad.addColorStop(0, C.blue);
  grad.addColorStop(1, C.cyan);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(markX + markSize / 2, markY + markSize / 2, markSize / 2, 0, Math.PI * 2);
  ctx.fill();

  const cx = markX + markSize / 2;
  const cy = markY + markSize / 2;
  const r = markSize / 2;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = r * 0.18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy + r * 0.05);
  ctx.lineTo(cx - r * 0.05, cy + r * 0.35);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.30);
  ctx.stroke();

  // Wordmark below
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  const fontSize = Math.round(size * 0.10);
  ctx.font = `700 ${fontSize}px "Space Grotesk", "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("EasyTradeSetup", size / 2, size * 0.78);

  // Sub-line
  ctx.fillStyle = C.cyan;
  ctx.font = `500 ${Math.round(size * 0.04)}px "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace`;
  ctx.fillText("INDICATOR · COURSE · QUIZ", size / 2, size * 0.88);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

// Color palette poster — 1200x800, brand bg, swatches in grid.
function paletteCanvas(): Promise<Blob> {
  const W = 1200;
  const H = 800;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Bg
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "top";
  ctx.font = `700 56px "Space Grotesk", -apple-system, sans-serif`;
  ctx.fillText("EasyTradeSetup", 60, 60);
  ctx.fillStyle = C.cyan;
  ctx.font = `500 24px "JetBrains Mono", ui-monospace, monospace`;
  ctx.fillText("BRAND · COLOUR PALETTE", 60, 130);

  // Swatch grid
  const swatches = [
    { name: "Page BG",       hex: C.bg,      role: "Full-bleed page" },
    { name: "Surface 1",     hex: C.surface, role: "Cards, panels" },
    { name: "Electric Blue", hex: C.blue,    role: "Primary brand" },
    { name: "Cyan",          hex: C.cyan,    role: "Secondary accent" },
    { name: "Brand Gold",    hex: C.gold,    role: "CTAs · price tags" },
    { name: "Violet",        hex: C.violet,  role: "Tertiary" },
    { name: "Acid Lime",     hex: C.acid,    role: "Live · free signal" },
    { name: "Amber",         hex: C.amber,   role: "Warnings" },
    { name: "Up / Win",      hex: C.up,      role: "Bullish" },
    { name: "Down / Loss",   hex: C.down,    role: "Bearish" },
  ];

  const cols = 5;
  const cellW = (W - 60 * 2 - 20 * (cols - 1)) / cols;
  const cellH = 230;
  const startY = 200;
  swatches.forEach((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 60 + col * (cellW + 20);
    const y = startY + row * (cellH + 30);

    // Swatch
    ctx.fillStyle = s.hex;
    ctx.fillRect(x, y, cellW, cellH * 0.62);
    // Subtle border
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, cellW - 1, cellH * 0.62 - 1);

    // Label
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "top";
    ctx.font = `600 18px "Inter Tight", -apple-system, sans-serif`;
    ctx.fillText(s.name, x, y + cellH * 0.62 + 12);
    ctx.fillStyle = C.ink60;
    ctx.font = `500 14px "JetBrains Mono", monospace`;
    ctx.fillText(s.hex.toUpperCase(), x, y + cellH * 0.62 + 38);
    ctx.fillStyle = C.ink40;
    ctx.font = `400 12px "Inter Tight", sans-serif`;
    ctx.fillText(s.role, x, y + cellH * 0.62 + 60);
  });

  // Footer
  ctx.fillStyle = C.ink40;
  ctx.font = `500 14px "JetBrains Mono", monospace`;
  ctx.fillText("easytradesetup.com · Single source: tailwind.config.ts", 60, H - 40);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

// Generic dark template canvas with brand chrome — shared by YT banner /
// IG carousel / IG reel / IG story templates so they all read as one family.
function brandTemplateCanvas(opts: {
  w: number;
  h: number;
  safeArea?: { x: number; y: number; w: number; h: number };
  headline: string;
  sub?: string;
  cta?: string;
  showSafeAreaGuide?: boolean;
}): Promise<Blob> {
  const { w, h, safeArea, headline, sub, cta, showSafeAreaGuide } = opts;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Bg gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, C.bg);
  bg.addColorStop(0.55, C.surface);
  bg.addColorStop(1, "#0a1224");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Radial glow center-top
  const radial = ctx.createRadialGradient(w / 2, -200, 100, w / 2, h * 0.4, w * 0.6);
  radial.addColorStop(0, "rgba(43,123,255,0.22)");
  radial.addColorStop(1, "rgba(43,123,255,0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, w, h);

  // Brand mark — top-left
  const padding = Math.min(w, h) * 0.05;
  const markSize = Math.min(w, h) * 0.07;
  const markX = padding;
  const markY = padding;
  const mg = ctx.createLinearGradient(markX, markY, markX + markSize, markY + markSize);
  mg.addColorStop(0, C.blue);
  mg.addColorStop(1, C.cyan);
  ctx.fillStyle = mg;
  ctx.beginPath();
  ctx.arc(markX + markSize / 2, markY + markSize / 2, markSize / 2, 0, Math.PI * 2);
  ctx.fill();
  // Checkmark
  const cx = markX + markSize / 2;
  const cy = markY + markSize / 2;
  const r = markSize / 2;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = r * 0.18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy + r * 0.05);
  ctx.lineTo(cx - r * 0.05, cy + r * 0.35);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.30);
  ctx.stroke();
  // Wordmark next to mark
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.font = `700 ${Math.round(markSize * 0.55)}px "Space Grotesk", -apple-system, sans-serif`;
  ctx.fillText("EasyTradeSetup", markX + markSize + markSize * 0.4, markY + markSize / 2);

  // Domain — bottom-right
  ctx.fillStyle = C.ink40;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.font = `500 ${Math.round(Math.min(w, h) * 0.022)}px "JetBrains Mono", monospace`;
  ctx.fillText("easytradesetup.com", w - padding, h - padding);

  // Headline center
  const cxText = safeArea ? safeArea.x + safeArea.w / 2 : w / 2;
  const cyText = safeArea ? safeArea.y + safeArea.h / 2 : h / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Brand-gradient effect on headline: render twice — first solid white to
  // get the stroke baseline, then overlay gradient via clip.
  const headlineSize = Math.round(Math.min(w, h) * 0.085);
  ctx.font = `700 ${headlineSize}px "Space Grotesk", -apple-system, sans-serif`;
  ctx.fillStyle = "#fff";
  ctx.fillText(headline, cxText, cyText - (sub ? headlineSize * 0.6 : 0));

  if (sub) {
    ctx.font = `500 ${Math.round(headlineSize * 0.36)}px "Inter Tight", -apple-system, sans-serif`;
    ctx.fillStyle = C.cyan;
    ctx.fillText(sub, cxText, cyText + headlineSize * 0.5);
  }

  if (cta) {
    ctx.font = `500 ${Math.round(Math.min(w, h) * 0.022)}px "JetBrains Mono", monospace`;
    ctx.fillStyle = C.ink60;
    const ctaY = safeArea ? safeArea.y + safeArea.h - 20 : h - padding * 2;
    ctx.fillText(cta.toUpperCase(), cxText, ctaY);
  }

  // Optional safe-area guide (dashed) — for templates the user will edit
  if (showSafeAreaGuide && safeArea) {
    ctx.strokeStyle = "rgba(34,211,238,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(safeArea.x, safeArea.y, safeArea.w, safeArea.h);
    ctx.setLineDash([]);
    // Label
    ctx.font = `500 14px "JetBrains Mono", monospace`;
    ctx.fillStyle = "rgba(34,211,238,0.7)";
    ctx.textAlign = "left";
    ctx.fillText("SAFE AREA", safeArea.x + 12, safeArea.y + 22);
  }

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

type AssetSize = { w: number; h: number; label: string };

function Section({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="tz-card mb-4" style={{ padding: 20 }}>
      <h3 style={{ font: "600 16px var(--tz-display)", margin: "0 0 4px", color: "var(--tz-ink)" }}>
        {title}
      </h3>
      {subtitle && (
        <p className="text-[12.5px]" style={{ color: "var(--tz-ink-mute)", margin: "0 0 16px", lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
      {/* Auto-fit grid keeps every button equal-height + equal-width per row.
          Cell min 200px so labels never wrap awkwardly; max 1fr so they
          fill on wide screens. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 10,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function DownloadButton({ onClick, label, hint, primary }: {
  onClick: () => void | Promise<void>;
  label: string;
  hint?: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 4,
        padding: "12px 14px",
        minHeight: 64,
        background: primary
          ? "linear-gradient(135deg, rgba(43,123,255,0.18), rgba(34,211,238,0.10))"
          : "var(--tz-surface-2, rgba(255,255,255,0.02))",
        border: `1px solid ${primary ? "rgba(43,123,255,0.45)" : "var(--tz-border, rgba(255,255,255,0.08))"}`,
        borderRadius: 8,
        color: "var(--tz-ink)",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color .15s, background .15s",
        font: "inherit",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--tz-cyan, #22D3EE)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = primary
          ? "rgba(43,123,255,0.45)"
          : "var(--tz-border, rgba(255,255,255,0.08))";
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25 }}>↓ {label}</span>
      {hint && (
        <span
          className="font-mono"
          style={{
            fontSize: 10.5,
            opacity: 0.55,
            lineHeight: 1.3,
            letterSpacing: "0.04em",
          }}
        >
          {hint}
        </span>
      )}
    </button>
  );
}

function ExternalLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 4,
        padding: "12px 14px",
        minHeight: 64,
        background: "var(--tz-surface-2, rgba(255,255,255,0.02))",
        border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
        borderRadius: 8,
        color: "var(--tz-ink)",
        textDecoration: "none",
        transition: "border-color .15s",
        width: "100%",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25 }}>↗ {label}</span>
    </a>
  );
}

export default function BrandAssetsClient() {
  const markSizes: AssetSize[] = [
    { w: 32,   h: 32,   label: "Favicon" },
    { w: 192,  h: 192,  label: "PWA / Apple touch" },
    { w: 512,  h: 512,  label: "App icon" },
    { w: 800,  h: 800,  label: "YouTube profile" },
    { w: 1024, h: 1024, label: "Instagram profile" },
  ];

  const dlMarkSvg = (size: number) => downloadSvg(brandMarkSvg(size), `easytradesetup-mark-${size}.svg`);
  const dlMarkPng = async (size: number) => {
    const blob = await svgToPng(brandMarkSvg(size), size, size);
    downloadBlob(blob, `easytradesetup-mark-${size}.png`);
  };

  const dlWordmark = async (w: number, h: number, name: string) => {
    const blob = await wordmarkCanvas(w, h);
    downloadBlob(blob, `easytradesetup-wordmark-${name}.png`);
  };
  const dlWordmarkStacked = async (size: number) => {
    const blob = await wordmarkStackedCanvas(size);
    downloadBlob(blob, `easytradesetup-wordmark-stacked-${size}.png`);
  };

  const dlPalette = async () => {
    const blob = await paletteCanvas();
    downloadBlob(blob, `easytradesetup-palette-1200x800.png`);
  };

  const dlYtBanner = async () => {
    const w = 2560;
    const h = 1440;
    const blob = await brandTemplateCanvas({
      w, h,
      safeArea: { x: (w - 1546) / 2, y: (h - 423) / 2, w: 1546, h: 423 },
      headline: "EasyTradeSetup",
      sub: "Indicator + Course + Quiz · TradingView Pine v5",
      cta: "easytradesetup.com",
      showSafeAreaGuide: true,
    });
    downloadBlob(blob, `easytradesetup-yt-banner-2560x1440.png`);
  };

  const dlIgCarousel = async () => {
    const blob = await brandTemplateCanvas({
      w: 1080, h: 1350,
      headline: "[ HOOK GOES HERE ]",
      sub: "Replace with your slide-1 line",
      cta: "swipe →",
    });
    downloadBlob(blob, `easytradesetup-ig-carousel-1080x1350.png`);
  };

  const dlIgReel = async () => {
    const blob = await brandTemplateCanvas({
      w: 1080, h: 1920,
      safeArea: { x: 60, y: 280, w: 960, h: 1350 },
      headline: "[ REEL HOOK ]",
      sub: "60s walkthrough",
      cta: "watch the kit",
      showSafeAreaGuide: true,
    });
    downloadBlob(blob, `easytradesetup-ig-reel-1080x1920.png`);
  };

  const dlIgStory = async () => {
    const blob = await brandTemplateCanvas({
      w: 1080, h: 1920,
      headline: "[ STORY ]",
      sub: "Free risk calculator now live",
      cta: "tap link in bio",
    });
    downloadBlob(blob, `easytradesetup-ig-story-1080x1920.png`);
  };

  const dlIgProfile = async () => {
    const blob = await wordmarkStackedCanvas(1024);
    downloadBlob(blob, `easytradesetup-ig-profile-1024.png`);
  };

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Brand assets.</h1>
          <div className="tz-topbar-sub">
            One-click download — logos, wordmarks, palette poster, and ready-to-edit social templates.
            Generated client-side from canonical brand tokens. Drop into Canva / Figma / direct upload.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/brand-kit" className="tz-btn">↗ Brand kit reference</Link>
          <a href="/opengraph-image" target="_blank" rel="noopener" className="tz-btn">↗ OG image</a>
        </div>
      </div>

      <Section
        title="Brand mark — gradient circle + checkmark"
        subtitle="Vector source. PNG sizes auto-generated for every common social / app target."
      >
        {markSizes.map((s) => (
          <DownloadButton
            key={`mark-png-${s.w}`}
            label={`PNG ${s.w}×${s.h}`}
            hint={s.label}
            onClick={() => dlMarkPng(s.w)}
          />
        ))}
        <DownloadButton label="SVG vector" hint="scalable, prefer this" onClick={() => dlMarkSvg(512)} />
      </Section>

      <Section
        title="Wordmark — mark + EasyTradeSetup"
        subtitle="Use horizontal for email signatures, slide footers; stacked for square social profile slots."
      >
        <DownloadButton label="Horizontal 1200×300 PNG" hint="email sig / slide footer" onClick={() => dlWordmark(1200, 300, "1200x300")} />
        <DownloadButton label="Horizontal 600×150 PNG" hint="compact" onClick={() => dlWordmark(600, 150, "600x150")} />
        <DownloadButton label="Stacked 600×600 PNG" hint="square slots" onClick={() => dlWordmarkStacked(600)} />
        <DownloadButton label="Stacked 1024×1024 PNG" hint="IG profile" onClick={() => dlWordmarkStacked(1024)} />
      </Section>

      <Section
        title="Social templates — ready-to-edit"
        subtitle="Pre-branded blank canvas with brand chrome + safe-area guides. Open in Canva / Figma; replace the headline + drop a chart on top."
      >
        <DownloadButton label="YouTube banner 2560×1440" hint="with safe-area guide" onClick={dlYtBanner} />
        <DownloadButton label="Instagram carousel 1080×1350" hint="4:5 portrait, slide template" onClick={dlIgCarousel} />
        <DownloadButton label="Instagram reel cover 1080×1920" hint="9:16 with safe-area guide" onClick={dlIgReel} />
        <DownloadButton label="Instagram story 1080×1920" hint="9:16 generic" onClick={dlIgStory} />
        <DownloadButton label="Instagram profile picture 1024×1024" hint="brand-stacked" onClick={dlIgProfile} />
      </Section>

      <Section
        title="Color palette poster"
        subtitle="Reference card — 10 swatches with hex codes and roles. Drop into a slide deck or share with a designer."
      >
        <DownloadButton label="Palette 1200×800 PNG" hint="all 10 brand swatches" onClick={dlPalette} />
      </Section>

      <Section
        title="Generated dynamically — production assets"
        subtitle="Live URLs Vercel renders on demand. Right-click → save image."
      >
        <ExternalLinkButton href="/opengraph-image" label="OG image (1200×630)" />
        <ExternalLinkButton href="/api/admin/brand-kit/design-tokens.json" label="design-tokens.json" />
      </Section>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.6 }}>
        All assets generated from canonical brand colors in tailwind.config.ts · Edit the source colors there to refresh everything · Download → Canva / Figma / direct upload
      </p>
    </>
  );
}
