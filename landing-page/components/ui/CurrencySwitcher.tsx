"use client";

import { useEffect, useState } from "react";
import {
  readCurrencyCookieClient,
  writeCurrencyCookieClient,
  type Currency,
} from "@/lib/currency";

// Two-button toggle that writes the ets_ccy cookie and full-page reloads
// so server-rendered prices update immediately. Hidden until cookie has
// been read so the buttons don't flicker between USD and INR.

export default function CurrencySwitcher({ size = "sm" }: { size?: "sm" | "md" }) {
  const [currency, setCurrency] = useState<Currency | null>(null);

  useEffect(() => {
    setCurrency(readCurrencyCookieClient());
  }, []);

  function pick(next: Currency) {
    if (next === currency) return;
    writeCurrencyCookieClient(next);
    setCurrency(next);
    // Reload so server components re-render with new prices. router.refresh()
    // would also work but a hard reload is more reliable across SSG/ISR pages.
    window.location.reload();
  }

  if (!currency) {
    return <span aria-hidden className="inline-block opacity-0" style={{ width: size === "md" ? 70 : 58, height: 24 }} />;
  }

  const baseStyle: React.CSSProperties = {
    height: size === "md" ? 28 : 24,
    minWidth: 0,
    padding: size === "md" ? "0 9px" : "0 7px",
    fontSize: size === "md" ? 11.5 : 10.5,
    fontWeight: 600,
    border: "1px solid var(--c-rule-2, rgba(0,0,0,0.12))",
    background: "transparent",
    color: "var(--c-ink-60, #586069)",
    cursor: "pointer",
    fontFamily: "var(--font-mono, ui-monospace, monospace)",
    letterSpacing: ".04em",
  };

  const activeStyle: React.CSSProperties = {
    background: "var(--c-ink, #15181a)",
    color: "var(--c-bg, #ffffff)",
    borderColor: "var(--c-ink, #15181a)",
  };

  return (
    <div
      role="group"
      aria-label="Currency"
      style={{ display: "inline-flex", borderRadius: 6, overflow: "hidden", flexShrink: 0 }}
    >
      <button
        type="button"
        onClick={() => pick("usd")}
        aria-pressed={currency === "usd"}
        style={{
          ...baseStyle,
          ...(currency === "usd" ? activeStyle : {}),
          borderRadius: "6px 0 0 6px",
          borderRight: currency === "usd" ? undefined : "none",
        }}
      >
        USD
      </button>
      <button
        type="button"
        onClick={() => pick("inr")}
        aria-pressed={currency === "inr"}
        style={{
          ...baseStyle,
          ...(currency === "inr" ? activeStyle : {}),
          borderRadius: "0 6px 6px 0",
        }}
      >
        INR
      </button>
    </div>
  );
}
