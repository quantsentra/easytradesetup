"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SETUPS, type Setup } from "./setups";

type HomeMarket = "in" | "global";

const FLAG: Record<Setup["id"], string> = {
  india: "IN",
  us: "US",
  crypto: "BTC",
  gold: "XAU",
};

// Geo-priority order for the tabs row + default active tab.
//   IN visitor:     India → Gold → Crypto → US
//   global visitor: US → Crypto → Gold → India
function orderForMarket(homeMarket: HomeMarket): Setup["id"][] {
  return homeMarket === "in"
    ? ["india", "gold", "crypto", "us"]
    : ["us", "crypto", "gold", "india"];
}

export default function SampleTabs({
  homeMarket,
}: {
  homeMarket: HomeMarket;
}) {
  // Stable ordered list — order is decided server-side from geo cookie + IP,
  // so first paint already shows the right tab in the first slot. No flicker.
  const ordered = useMemo<Setup[]>(() => {
    const ids = orderForMarket(homeMarket);
    return ids
      .map((id) => SETUPS.find((s) => s.id === id))
      .filter((s): s is Setup => Boolean(s));
  }, [homeMarket]);

  const [activeId, setActiveId] = useState<Setup["id"]>(ordered[0].id);

  // Read ?market= on first paint so deep links land on the right tab.
  // Done in useEffect (not initial state) to avoid hydration mismatch with SSR.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = new URL(window.location.href).searchParams.get("market");
    if (m && (SETUPS as readonly Setup[]).some((s) => s.id === m)) {
      setActiveId(m as Setup["id"]);
    }
  }, []);

  const active = ordered.find((s) => s.id === activeId) ?? ordered[0];

  return (
    <section className="bg-surface">
      <div className="container-x py-10 sm:py-14">
        {/* Tabs — 2×2 grid on mobile (no horizontal scroll, no cut-off labels),
            4-col row on >= sm. Each tab is full width within its grid cell so
            target hit-area is consistent. */}
        <div
          role="tablist"
          aria-label="Sample setup market"
          className="mb-8 sm:mb-10 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
        >
          {ordered.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`panel-${s.id}`}
                id={`tab-${s.id}`}
                onClick={() => {
                  setActiveId(s.id);
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.set("market", s.id);
                    window.history.replaceState({}, "", url.toString());
                  }
                }}
                className={[
                  "group flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl border text-left transition-all min-w-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-link/50",
                  isActive
                    ? "bg-blue text-white border-blue shadow-md"
                    : "bg-panel border-rule text-ink hover:border-rule-2 hover:bg-bg-2",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex-none w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-mono text-[10.5px] sm:text-[11px] font-bold tracking-wider",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-link/10 text-blue-link",
                  ].join(" ")}
                  aria-hidden
                >
                  {FLAG[s.id]}
                </span>
                <span className="flex flex-col leading-tight min-w-0">
                  <span className="text-[13px] sm:text-[15px] font-semibold truncate">
                    {s.label}
                  </span>
                  <span
                    className={[
                      "text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider truncate",
                      isActive ? "text-white/70" : "text-muted-faint",
                    ].join(" ")}
                  >
                    {s.symbol.split(" · ")[0]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel — single active setup */}
        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
        >
          <SetupCard s={active} />
        </div>

        {/* Footer CTA — same across panels */}
        <div className="mt-10 sm:mt-12 card-white p-6 sm:p-8 md:p-10 text-center">
          <h2 className="h-card">Like the format?</h2>
          <p className="mt-2 text-body text-muted">
            This is one preview of multiple full setups inside your portal — alongside the
            interactive 11-lesson course and knowledge quiz that walk you through every
            signal, line, zone, and color the indicator plots. NIFTY, BANKNIFTY, SPX, NAS,
            XAU, BTC.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body font-medium hover:brightness-110 transition-all"
            >
              Buy the full bundle
            </Link>
            <Link href="/compare" className="link-apple chevron">
              See how we compare
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SetupCard({ s }: { s: Setup }) {
  return (
    <article className="card-apple p-6 sm:p-8 md:p-10 lg:p-14">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
        <span className="text-micro font-semibold text-blue-link uppercase tracking-wider">
          {s.chapter}
        </span>
        <span className="text-nano font-mono text-muted-faint">{s.symbol}</span>
      </div>

      <h2 className="font-display font-semibold text-[26px] sm:text-[34px] md:text-[40px] leading-[1.1] tracking-tight text-ink">
        {s.title}
      </h2>
      <p className="mt-4 text-body text-muted leading-relaxed">{s.intro}</p>

      <h3 className="mt-8 sm:mt-10 h-card">The setup in one sentence</h3>
      <p className="mt-2 text-body text-muted leading-relaxed">
        {s.oneLiner.before}
        <strong className="text-ink">{s.oneLiner.highlight}</strong>
        {s.oneLiner.mid}
        {s.oneLiner.after}
      </p>

      <h3 className="mt-8 sm:mt-10 h-card">Entry rules</h3>
      <ol className="mt-4 space-y-3 text-body text-muted">
        {s.entries.map((e, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-none w-6 text-blue-link font-mono">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{e}</span>
          </li>
        ))}
      </ol>

      <h3 className="mt-8 sm:mt-10 h-card">Exit rules</h3>
      <ul className="mt-4 space-y-3 text-body text-muted">
        {s.exits.map((x) => (
          <li key={x.k} className="flex gap-3">
            <span className="flex-none text-up mt-1" aria-hidden>
              ✓
            </span>
            <span>
              <strong className="text-ink">{x.k}:</strong> {x.v}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-8 sm:mt-10 h-card">Invalidation</h3>
      <p className="mt-2 text-body text-muted leading-relaxed">{s.invalidation}</p>

      <h3 className="mt-8 sm:mt-10 h-card">Why this edge exists</h3>
      <p className="mt-2 text-body text-muted leading-relaxed">{s.why}</p>

      <h3 className="mt-8 sm:mt-10 h-card">Risk framework</h3>
      <div className="mt-4 overflow-x-auto -mx-6 sm:mx-0">
        <table className="min-w-full text-caption">
          <thead>
            <tr className="hairline-b">
              <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">
                Parameter
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-faint uppercase tracking-wider text-micro">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {s.risk.map(([k, v]) => (
              <tr key={k} className="hairline-b last:border-b-0">
                <td className="py-3 px-4 text-ink font-medium align-top">{k}</td>
                <td className="py-3 px-4 text-muted">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 sm:mt-10 hairline-t pt-6 sm:pt-8 text-nano text-muted-faint leading-relaxed">
        <strong className="text-ink">Educational content. Not investment advice.</strong>{" "}
        No strategy wins every trade, and historical descriptions do not guarantee
        future results. Trading involves substantial risk of loss. See the full{" "}
        <Link href="/legal/disclaimer" className="link-apple">
          trading disclaimer
        </Link>
        .
      </div>
    </article>
  );
}
