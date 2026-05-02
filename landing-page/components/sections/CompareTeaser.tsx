import Link from "next/link";

// Compact 3-row competitor comparison surfaced on the home page.
// Acts as a buyer-stage objection handler: "what makes this different
// from LuxAlgo / TrendSpider?" without forcing a click to /compare.
// Full table lives at /compare for buyers who want every column.

const ROWS: Array<{
  label: string;
  ets: string;
  lux: string;
  ts: string;
}> = [
  {
    label: "Billing",
    ets: "$49 once · lifetime",
    lux: "$39.99 / month",
    ts: "$58 / month",
  },
  {
    label: "Course + quiz included",
    ets: "11 lessons · interactive",
    lux: "Not included",
    ts: "Not included",
  },
  {
    label: "Pine source readable",
    ets: "Yes · personal use",
    lux: "Obfuscated",
    ts: "SaaS only",
  },
];

export default function CompareTeaser() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <div className="max-w-[640px] mb-10 sm:mb-12">
          <span className="eye">
            <span className="eye-dot" aria-hidden />
            Side by side
          </span>
          <h2 className="mt-5 font-display text-[36px] sm:text-[44px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink">
            How it stacks up against{" "}
            <span className="grad-text-2">the usual options.</span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.55] text-ink-60">
            Three comparisons that decide most purchases. Full table at{" "}
            <Link href="/compare" className="link-apple">
              /compare
            </Link>{" "}
            covers fourteen rows.
          </p>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full px-4 sm:px-0">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-[10.5px] font-mono font-bold uppercase tracking-widest text-ink-40 whitespace-nowrap">
                    Spec
                  </th>
                  <th
                    className="py-3 px-4 text-left text-[12px] font-semibold text-ink whitespace-nowrap"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(43,123,255,0.22), rgba(34,211,238,0.08))",
                      borderRadius: "10px 10px 0 0",
                      boxShadow:
                        "inset 1px 0 0 rgba(34,211,238,0.55), inset -1px 0 0 rgba(34,211,238,0.55), inset 0 1px 0 rgba(34,211,238,0.85)",
                    }}
                  >
                    <span className="flex flex-col items-start gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.14em]"
                        style={{
                          background: "rgba(143, 204, 42, 0.16)",
                          border: "1px solid rgba(143, 204, 42, 0.45)",
                          color: "#8FCC2A",
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                        </svg>
                        Recommended
                      </span>
                      <span className="text-[13px] sm:text-[14px] font-semibold text-ink">
                        EasyTradeSetup
                      </span>
                    </span>
                  </th>
                  <th className="py-3 px-4 text-left text-[12px] font-medium text-ink-60 whitespace-nowrap">
                    LuxAlgo
                  </th>
                  <th className="py-3 px-4 text-left text-[12px] font-medium text-ink-60 whitespace-nowrap">
                    TrendSpider
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => {
                  const isLast = i === ROWS.length - 1;
                  return (
                    <tr
                      key={r.label}
                      className="border-t border-rule"
                    >
                      <td className="py-4 px-4 text-[14px] font-medium text-ink">
                        {r.label}
                      </td>
                      <td
                        className="py-4 px-4 text-[14px] font-semibold text-ink whitespace-nowrap"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(43,123,255,0.14), rgba(34,211,238,0.06))",
                          boxShadow: isLast
                            ? "inset 1px 0 0 rgba(34,211,238,0.55), inset -1px 0 0 rgba(34,211,238,0.55), inset 0 -1px 0 rgba(34,211,238,0.7)"
                            : "inset 1px 0 0 rgba(34,211,238,0.55), inset -1px 0 0 rgba(34,211,238,0.55)",
                          borderRadius: isLast ? "0 0 10px 10px" : undefined,
                        }}
                      >
                        {r.ets}
                      </td>
                      <td className="py-4 px-4 text-[13.5px] text-ink-60">
                        {r.lux}
                      </td>
                      <td className="py-4 px-4 text-[13.5px] text-ink-60">
                        {r.ts}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/compare" className="btn btn-outline">
            See the full comparison <span className="arrow" aria-hidden>→</span>
          </Link>
          <span className="text-[12px] font-mono uppercase tracking-widest text-ink-40">
            14 rows · monthly review date in footnote
          </span>
        </div>
      </div>
    </section>
  );
}
