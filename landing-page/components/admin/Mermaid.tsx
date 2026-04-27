"use client";

import { useEffect, useRef, useState } from "react";

let renderCounter = 0;
let initPromise: Promise<typeof import("mermaid").default> | null = null;

async function getMermaid() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const mod = await import("mermaid");
    const m = mod.default;
    m.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#ffffff",
        primaryTextColor: "#15181a",
        primaryBorderColor: "#2B7BFF",
        lineColor: "#2B7BFF",
        secondaryColor: "#22D3EE",
        tertiaryColor: "#faf9f5",
        fontFamily: "Inter Tight, system-ui, sans-serif",
        fontSize: "13px",
      },
      flowchart: { curve: "basis", padding: 16 },
      sequence: { actorMargin: 50, boxMargin: 10 },
      securityLevel: "loose",
    });
    return m;
  })();
  return initPromise;
}

export default function Mermaid({
  chart,
  title = "diagram",
}: {
  chart: string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMermaid()
      .then(async (m) => {
        if (cancelled || !ref.current) return;
        try {
          const id = `mmd-${++renderCounter}-${Date.now()}`;
          const { svg } = await m.render(id, chart);
          if (!cancelled && ref.current) {
            ref.current.innerHTML = svg;
            setSvg(svg);
            setError(null);
          }
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : "render failed");
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "load failed");
      });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  function fileName(ext: string) {
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.${ext}`;
  }

  function downloadSvg() {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    triggerDownload(URL.createObjectURL(blob), fileName("svg"));
  }

  async function downloadPng() {
    if (!svg || !ref.current) return;
    const svgEl = ref.current.querySelector("svg");
    if (!svgEl) return;

    // Inline computed sizes so the rasterized PNG isn't 0×0.
    const bbox = svgEl.getBBox();
    const width = Math.ceil(bbox.width + 32);
    const height = Math.ceil(bbox.height + 32);
    const clone = svgEl.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(width));
    clone.setAttribute("height", String(height));
    const xml = new XMLSerializer().serializeToString(clone);
    const utf8 = new TextEncoder().encode(xml);
    let bin = "";
    for (const b of utf8) bin += String.fromCharCode(b);
    const dataUrl = `data:image/svg+xml;base64,${btoa(bin)}`;

    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("svg→img conversion failed"));
      img.src = dataUrl;
    });

    const scale = 2; // retina
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      triggerDownload(URL.createObjectURL(blob), fileName("png"));
    }, "image/png");
  }

  function triggerDownload(href: string, filename: string) {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(href), 5_000);
  }

  function openInNewTab() {
    if (!svg) return;
    const html = `<!doctype html><html><head><title>${title}</title>
      <style>body{margin:0;padding:24px;background:#faf9f5;font-family:system-ui,sans-serif}
      svg{max-width:100%;height:auto;display:block;margin:0 auto}</style></head>
      <body>${svg}</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    window.open(URL.createObjectURL(blob), "_blank", "noopener");
  }

  return (
    <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", borderBottom: "1px solid var(--tz-border)",
        background: "var(--tz-surface-2)",
        flexWrap: "wrap", gap: 8,
      }}>
        <span className="font-mono text-[10.5px]" style={{
          textTransform: "uppercase", letterSpacing: ".14em",
          color: "var(--tz-ink-mute)",
          minWidth: 0, overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {title}
        </span>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={openInNewTab}
            disabled={!svg}
            className="tz-btn"
            style={{ height: 28, padding: "0 10px", fontSize: 11.5 }}
            aria-label="Open diagram in new tab"
          >
            ⤢ Fullscreen
          </button>
          <button
            type="button"
            onClick={downloadSvg}
            disabled={!svg}
            className="tz-btn"
            style={{ height: 28, padding: "0 10px", fontSize: 11.5 }}
          >
            SVG
          </button>
          <button
            type="button"
            onClick={downloadPng}
            disabled={!svg}
            className="tz-btn"
            style={{ height: 28, padding: "0 10px", fontSize: 11.5 }}
          >
            PNG
          </button>
        </div>
      </div>

      {/* Diagram canvas */}
      <div style={{ overflowX: "auto", padding: 20 }}>
        <div ref={ref} style={{ minWidth: 520, textAlign: "center", minHeight: 60 }} />
      </div>

      {error && (
        <div style={{
          padding: "0 16px 14px", fontSize: 12,
          color: "var(--tz-loss)", fontFamily: "var(--tz-mono)",
        }}>
          Diagram render error: {error}
        </div>
      )}
    </div>
  );
}
