"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    mermaid?: {
      initialize: (cfg: Record<string, unknown>) => void;
      run: (opts?: { nodes?: HTMLElement[] }) => Promise<void>;
    };
  }
}

let loaderPromise: Promise<void> | null = null;

function loadMermaid(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.mermaid) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.type = "module";
    s.innerHTML = `
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
      window.mermaid = mermaid;
      window.dispatchEvent(new Event('mermaid-ready'));
    `;
    s.onerror = () => reject(new Error("Failed to load mermaid"));
    document.head.appendChild(s);
    window.addEventListener("mermaid-ready", () => resolve(), { once: true });
  });

  return loaderPromise;
}

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadMermaid().then(() => {
      if (cancelled || !ref.current || !window.mermaid) return;
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
      window.mermaid.run({ nodes: [ref.current] }).catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <div className="tz-card" style={{ overflowX: "auto", padding: 20 }}>
      <div ref={ref} className="mermaid" style={{ minWidth: 520, textAlign: "center" }}>
        {chart}
      </div>
    </div>
  );
}
