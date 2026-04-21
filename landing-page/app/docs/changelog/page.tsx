import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every release of Golden Indicator, dated and documented. Lifetime updates included with purchase.",
};

type Release = {
  version: string;
  date: string;
  status: "planned" | "beta" | "released";
  highlights: string[];
};

const releases: Release[] = [
  {
    version: "v1.0",
    date: "Targeting May 2026",
    status: "planned",
    highlights: [
      "Public launch of Golden Indicator on TradingView.",
      "Trade Logic PDF v1 — setup rules + risk framework.",
      "Risk Calculator web tool (beta).",
      "Daily Market Notes — India market, pre- and post-close.",
    ],
  },
  {
    version: "v0.9",
    date: "April 2026 · private beta",
    status: "beta",
    highlights: [
      "Beta distribution to a closed cohort for feedback.",
      "Final tuning of signal thresholds across NIFTY, BANKNIFTY, and US indices.",
      "Documentation pass.",
    ],
  },
  {
    version: "v0.5 – v0.8",
    date: "Jan – March 2026 · internal",
    status: "beta",
    highlights: [
      "Merge of multiple helper scripts into a single indicator.",
      "Session-awareness added for IST, US, and global market hours.",
      "Volatility-aware stop sizing logic stabilised.",
    ],
  },
];

const statusBadge: Record<Release["status"], { label: string; className: string }> = {
  planned:  { label: "Planned",  className: "bg-blue/10 text-blue-link border-blue/20" },
  beta:     { label: "Beta",     className: "bg-[#fff8e6] text-[#7a5a0f] border-[#f0c36d]" },
  released: { label: "Released", className: "bg-[#e7f7ee] text-[#0a7a3a] border-[#cdebd8]" },
};

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Changelog"
        title={<>Every release. Dated and documented.</>}
        lede="Lifetime updates are included with your purchase. This page is the public record of what shipped and when."
      />
      <section className="bg-surface">
        <div className="container-x py-16">
          <div className="relative">
            <div className="absolute left-3 sm:left-5 top-2 bottom-2 w-px bg-rule" aria-hidden />
            <ol className="space-y-10 sm:space-y-12">
              {releases.map((r) => {
                const badge = statusBadge[r.status];
                return (
                  <li key={r.version} className="relative pl-10 sm:pl-14">
                    <div
                      aria-hidden
                      className="absolute left-0 top-1.5 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-surface border-2 border-rule flex items-center justify-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue" />
                    </div>

                    <div className="flex items-baseline flex-wrap gap-3">
                      <h2 className="h-card">{r.version}</h2>
                      <span
                        className={`text-nano font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-caption text-muted-faint">{r.date}</span>
                    </div>

                    <ul className="mt-4 space-y-2">
                      {r.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-caption text-muted leading-relaxed">
                          <svg width="14" height="14" viewBox="0 0 14 14" className="mt-[3px] flex-none" aria-hidden>
                            <path d="M2 7l3 3 7-7" stroke="#0071e3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="mt-12 text-caption text-muted-faint">
            This changelog records intent and history in good faith. Dates under &ldquo;Planned&rdquo; are targets,
            not commitments. Existing customers receive every update free of charge.
          </p>
        </div>
      </section>
    </>
  );
}
