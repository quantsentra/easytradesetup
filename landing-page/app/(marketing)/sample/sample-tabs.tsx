"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SETUPS, type Setup } from "./setups";

const FLAG: Record<Setup["id"], string> = {
  india: "IN",
  us: "US",
  crypto: "BTC",
  gold: "XAU",
};

export default function SampleTabs() {
  const [activeId, setActiveId] = useState<Setup["id"]>("india");

  // Read ?market= on first paint so deep links land on the right tab.
  // Done in useEffect (not initial state) to avoid hydration mismatch with SSR.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = new URL(window.location.href).searchParams.get("market");
    if (m && (SETUPS as readonly Setup[]).some((s) => s.id === m)) {
      setActiveId(m as Setup["id"]);
    }
  }, []);

  const active = SETUPS.find((s) => s.id === activeId) ?? SETUPS[0];

  return (
    <section className="bg-surface">
      <div className="container-x py-10 sm:py-14">
        {/* Tabs row — horizontal scroll on mobile, equal-width row on >= sm */}
        <div
          role="tablist"
          aria-label="Sample setup market"
          className="-mx-4 sm:mx-0 mb-8 sm:mb-10 overflow-x-auto no-scrollbar"
        >
          <div className="flex gap-2 sm:gap-3 px-4 sm:px-0 min-w-max sm:min-w-0 sm:grid sm:grid-cols-4">
            {SETUPS.map((s) => {
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
                    "group flex items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl border text-left transition-all whitespace-nowrap",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-link/50",
                    isActive
                      ? "bg-blue text-white border-blue shadow-md"
                      : "bg-panel border-rule text-ink hover:border-rule-2 hover:bg-bg-2",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex-none w-9 h-9 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold tracking-wider",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-blue-link/10 text-blue-link",
                    ].join(" ")}
                    aria-hidden
                  >
                    {FLAG[s.id]}
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[14px] sm:text-[15px] font-semibold">
                      {s.label}
                    </span>
                    <span
                      className={[
                        "text-[11px] font-mono uppercase tracking-wider",
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
            This is one of 8 full setups inside the Trade Logic PDF shipped with
            Golden Indicator — across NIFTY, BANKNIFTY, SPX, NAS, XAU, BTC.
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
