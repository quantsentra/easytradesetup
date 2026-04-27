"use client";

import { useMemo, useState } from "react";
import type { CheckResult, Category } from "@/lib/qa-suite";

// Client view for a single QA run — filter chips + grouped category
// breakdown. Tables on desktop, card-list on mobile. Filter persists in
// component state (no URL hop).

const CATEGORIES: Category[] = [
  "Build", "Env", "Security", "Functional", "SEO", "Database", "Pricing", "UX",
];

const categoryDescriptions: Record<Category, string> = {
  Build: "Runtime version + deployment metadata",
  Env: "Required env vars across Stripe / Supabase / Resend / Sentry",
  Security: "HTTPS / CSP / frame protections / surface hardening",
  Functional: "Critical pages + APIs return expected status",
  SEO: "Title / meta / OG / JSON-LD / sitemap / robots",
  Database: "Supabase reachable + required tables / columns",
  Pricing: "FX drift, USD↔INR coherence, launch window",
  UX: "Home copy contracts — brand, CTAs, no stale refund language",
};

type Filter = "all" | "fail" | "warn" | "pass";

function statusBadge(s: CheckResult["status"]) {
  if (s === "pass") return <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />pass</span>;
  if (s === "warn") return <span className="tz-chip tz-chip-amber">⚠ warn</span>;
  return (
    <span className="tz-chip" style={{ background: "rgba(217,59,59,0.10)", color: "var(--tz-loss)", borderColor: "rgba(217,59,59,0.35)" }}>
      ✗ fail
    </span>
  );
}

function FilterChip({
  active, label, count, color, onClick,
}: {
  active: boolean; label: string; count: number; color: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tz-chip"
      style={{
        background: active ? color : "transparent",
        color: active ? "#fff" : color,
        borderColor: color,
        cursor: "pointer",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label} · {count}
    </button>
  );
}

export default function QaDetailView({ results }: { results: CheckResult[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => ({
    all: results.length,
    pass: results.filter((r) => r.status === "pass").length,
    warn: results.filter((r) => r.status === "warn").length,
    fail: results.filter((r) => r.status === "fail").length,
  }), [results]);

  const filtered = useMemo(() => {
    if (filter === "all") return results;
    return results.filter((r) => r.status === filter);
  }, [results, filter]);

  const grouped = useMemo(() => {
    const map = new Map<Category, CheckResult[]>();
    for (const cat of CATEGORIES) map.set(cat, []);
    for (const r of filtered) {
      const list = map.get(r.category) || [];
      list.push(r);
      map.set(r.category, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => {
        const order = { fail: 0, warn: 1, pass: 2 };
        return order[a.status] - order[b.status];
      });
    }
    return map;
  }, [filtered]);

  return (
    <>
      {/* Filter chips — sticky on scroll */}
      <div
        className="mb-5"
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          padding: "10px 0",
          position: "sticky",
          top: 0,
          background: "var(--tz-bg)",
          zIndex: 5,
          borderBottom: "1px solid transparent",
        }}
      >
        <FilterChip
          active={filter === "all"}
          label="All"
          count={counts.all}
          color="var(--tz-ink-dim)"
          onClick={() => setFilter("all")}
        />
        <FilterChip
          active={filter === "fail"}
          label="Red flags"
          count={counts.fail}
          color="var(--tz-loss)"
          onClick={() => setFilter("fail")}
        />
        <FilterChip
          active={filter === "warn"}
          label="Warnings"
          count={counts.warn}
          color="var(--tz-amber)"
          onClick={() => setFilter("warn")}
        />
        <FilterChip
          active={filter === "pass"}
          label="Passed"
          count={counts.pass}
          color="var(--tz-win)"
          onClick={() => setFilter("pass")}
        />
      </div>

      {filtered.length === 0 && (
        <div className="tz-card" style={{ textAlign: "center", padding: "32px 16px" }}>
          <p style={{ color: "var(--tz-ink-mute)", fontSize: 13 }}>
            Nothing in this filter. {filter === "fail" && "🎉 Zero red flags."}
          </p>
        </div>
      )}

      {/* Per-category cards */}
      {CATEGORIES.map((cat) => {
        const items = grouped.get(cat) || [];
        if (items.length === 0) return null;
        const fails = items.filter((i) => i.status === "fail").length;
        const warns = items.filter((i) => i.status === "warn").length;
        const passes = items.filter((i) => i.status === "pass").length;
        const allGreen = fails === 0 && warns === 0;

        return (
          <div key={cat} className="tz-card mb-3" style={{ padding: 0, overflow: "hidden" }}>
            <div className="tz-card-head" style={{
              padding: "14px 16px", marginBottom: 0,
              borderBottom: "1px solid var(--tz-border)",
              display: "flex", alignItems: "center", gap: 12,
              flexWrap: "wrap",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tz-card-title" style={{ fontSize: 15 }}>{cat}</div>
                <div className="tz-card-sub" style={{ fontSize: 12 }}>{categoryDescriptions[cat]}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {allGreen ? (
                  <span className="tz-chip tz-chip-acid"><span className="tz-chip-dot" />green</span>
                ) : (
                  <>
                    {fails > 0 && (
                      <span className="tz-chip" style={{
                        background: "rgba(217,59,59,0.10)",
                        color: "var(--tz-loss)",
                        borderColor: "rgba(217,59,59,0.35)",
                      }}>
                        {fails}✗
                      </span>
                    )}
                    {warns > 0 && <span className="tz-chip tz-chip-amber">{warns}⚠</span>}
                    {passes > 0 && <span className="tz-chip tz-chip-cyan">{passes}✓</span>}
                  </>
                )}
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block" style={{ overflowX: "auto" }}>
              <table className="tz-table" style={{ minWidth: 640 }}>
                <thead>
                  <tr>
                    <th style={{ width: 84 }}>Status</th>
                    <th>Check</th>
                    <th>Detail</th>
                    <th style={{ width: 64 }}>Took</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.id}>
                      <td>{statusBadge(r.status)}</td>
                      <td>
                        <div style={{ color: "var(--tz-ink)" }}>{r.name}</div>
                        <div className="font-mono text-[10px]" style={{ color: "var(--tz-ink-mute)" }}>
                          {r.id}
                        </div>
                      </td>
                      <td className="text-[12.5px]" style={{ color: "var(--tz-ink-dim)" }}>
                        <div>{r.detail}</div>
                        {r.fix && r.status !== "pass" && (
                          <div className="text-[11.5px] mt-1" style={{ color: "var(--tz-ink-mute)" }}>
                            → {r.fix}
                          </div>
                        )}
                      </td>
                      <td className="tz-num text-[11.5px]" style={{ color: "var(--tz-ink-mute)" }}>
                        {r.durationMs}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <ul className="sm:hidden" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map((r) => (
                <li
                  key={r.id}
                  style={{
                    borderBottom: "1px solid var(--tz-border)",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                    {statusBadge(r.status)}
                    <span className="tz-num text-[10.5px]" style={{ color: "var(--tz-ink-mute)", flexShrink: 0 }}>
                      {r.durationMs}ms
                    </span>
                  </div>
                  <div style={{ color: "var(--tz-ink)", fontSize: 13.5, fontWeight: 500 }}>
                    {r.name}
                  </div>
                  <div className="font-mono text-[10px] mt-0.5" style={{ color: "var(--tz-ink-mute)" }}>
                    {r.id}
                  </div>
                  <div className="text-[12.5px] mt-2" style={{ color: "var(--tz-ink-dim)" }}>
                    {r.detail}
                  </div>
                  {r.fix && r.status !== "pass" && (
                    <div className="text-[11.5px] mt-1.5" style={{ color: "var(--tz-amber)" }}>
                      → {r.fix}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}
