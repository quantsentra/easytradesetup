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

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

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
            setError(null);
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
