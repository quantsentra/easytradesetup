"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    mermaid?: {
      initialize: (cfg: Record<string, unknown>) => void;
      run: (opts?: { nodes?: HTMLElement[] }) => Promise<void>;
      render?: (id: string, text: string) => Promise<{ svg: string }>;
    };
  }
}

let loaderPromise: Promise<void> | null = null;

function loadMermaid(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.mermaid) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-mermaid-loader="1"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("mermaid load failed")), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";
    s.async = true;
    s.dataset.mermaidLoader = "1";
    s.onload = () => {
      if (window.mermaid) {
        window.mermaid.initialize({
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
        });
        resolve();
      } else {
        reject(new Error("mermaid global missing after load"));
      }
    };
    s.onerror = () => reject(new Error("Failed to load mermaid"));
    document.head.appendChild(s);
  });

  return loaderPromise;
}

let renderCounter = 0;

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then(async () => {
        if (cancelled || !ref.current || !window.mermaid?.render) return;
        try {
          const id = `mmd-${++renderCounter}-${Date.now()}`;
          const { svg } = await window.mermaid.render(id, chart);
          if (!cancelled && ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (e) {
          if (!cancelled) {
            setError(e instanceof Error ? e.message : "render failed");
          }
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "load failed");
      });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <div className="tz-card" style={{ overflowX: "auto", padding: 20 }}>
      <div ref={ref} style={{ minWidth: 520, textAlign: "center", minHeight: 60 }} />
      {error && (
        <div style={{
          marginTop: 8, fontSize: 12, color: "var(--tz-loss)",
          fontFamily: "var(--tz-mono)",
        }}>
          Diagram render error: {error}
        </div>
      )}
    </div>
  );
}
