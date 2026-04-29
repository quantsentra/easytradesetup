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
    label: "Multi-market + daily notes",
    ets: "Included · multi-market",
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
                        "linear-gradient(180deg, rgba(43,123,255,0.16), rgba(34,211,238,0.06))",
                      borderRadius: "10px 10px 0 0",
                      boxShadow: "inset 1px 0 0 rgba(34,211,238,0.32), inset -1px 0 0 rgba(34,211,238,0.32), inset 0 1px 0 rgba(34,211,238,0.5)",
                    }}
                  >
                    EasyTradeSetup
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
                            "linear-gradient(180deg, rgba(43,123,255,0.10), rgba(34,211,238,0.04))",
                          boxShadow: isLast
                            ? "inset 1px 0 0 rgba(34,211,238,0.32), inset -1px 0 0 rgba(34,211,238,0.32), inset 0 -1px 0 rgba(34,211,238,0.4)"
                            : "inset 1px 0 0 rgba(34,211,238,0.32), inset -1px 0 0 rgba(34,211,238,0.32)",
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
