import type { Metadata } from "next";
import { RELEASES, type Release, type ReleaseItem } from "@/lib/releases";

export const metadata: Metadata = { title: "Releases" };
export const dynamic = "force-dynamic";

const TONE_STYLE: Record<NonNullable<ReleaseItem["tone"]>, { dot: string; label: string }> = {
  ship:      { dot: "#22D3EE", label: "Ship" },
  fix:       { dot: "#F0C05A", label: "Fix" },
  ops:       { dot: "#8B5CF6", label: "Ops" },
  milestone: { dot: "#2DBE6D", label: "Milestone" },
};

export default function AdminReleases() {
  // Group releases by phase so the timeline reads as themed phases not
  // a flat dump of every commit. Phases stay in their first-encounter
  // order from the data file (newest first).
  const phases: Array<{ phase: string; releases: Release[] }> = [];
  for (const r of RELEASES) {
    const last = phases[phases.length - 1];
    if (last && last.phase === r.phase) last.releases.push(r);
    else phases.push({ phase: r.phase, releases: [r] });
  }

  const totalReleases = RELEASES.length;
  const totalShips = RELEASES.flatMap((r) => r.items).filter((i) => i.tone === "ship").length;
  const totalFixes = RELEASES.flatMap((r) => r.items).filter((i) => i.tone === "fix").length;
  const milestone = RELEASES.find((r) => r.tag);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-ink">
            Releases
          </h1>
          <p className="mt-1 text-[14px] text-ink-60">
            Hand-curated feature timeline. What shipped, when, and which release tagged it.
          </p>
        </div>
        {milestone?.tag && (
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-mono uppercase tracking-widest"
            style={{
              background: "rgba(45,190,109,0.10)",
              borderColor: "rgba(45,190,109,0.40)",
              color: "#2DBE6D",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#2DBE6D", boxShadow: "0 0 8px #2DBE6D" }}
              aria-hidden
            />
            Latest tag · {milestone.tag}
          </span>
        )}
      </header>

      <section className="tz-card">
        <div className="tz-card-head">
          <h2 className="tz-card-title">Overview</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule">
          <Kpi label="Releases" value={String(totalReleases)} />
          <Kpi label="Ships" value={String(totalShips)} tone="good" />
          <Kpi label="Fixes" value={String(totalFixes)} tone="warn" />
          <Kpi label="Phases" value={String(phases.length)} />
        </div>
      </section>

      {phases.map(({ phase, releases }) => (
        <section key={phase} className="tz-card">
          <div className="tz-card-head">
            <h2 className="tz-card-title">{phase}</h2>
            <p className="tz-card-sub">
              {releases.length} {releases.length === 1 ? "release" : "releases"} ·{" "}
              {phaseDateRange(releases)}
            </p>
          </div>
          <div className="divide-y divide-rule">
            {releases.map((r) => (
              <ReleaseRow key={`${r.date}-${r.title}`} r={r} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ReleaseRow({ r }: { r: Release }) {
  return (
    <div className="p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline gap-3 mb-3">
        <span className="text-[10.5px] font-mono uppercase tracking-widest text-ink-40 tabular-nums">
          {r.date}
        </span>
        <h3 className="text-[15px] sm:text-[16px] font-semibold text-ink">
          {r.title}
        </h3>
        <div className="ml-auto flex items-center gap-2">
          {r.tag && (
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-acid">
              tag · {r.tag}
            </span>
          )}
          {r.commit && (
            <a
              href={`https://github.com/quantsentra/easytradesetup/commit/${r.commit}`}
              target="_blank"
              rel="noopener"
              className="text-[10.5px] font-mono uppercase tracking-widest text-ink-40 hover:text-ink-60"
            >
              {r.commit} ↗
            </a>
          )}
        </div>
      </div>

      <ul className="space-y-2.5">
        {r.items.map((it, i) => {
          const style = it.tone ? TONE_STYLE[it.tone] : null;
          return (
            <li key={i} className="flex items-start gap-3">
              <span
                className="flex-none mt-[7px] w-2 h-2 rounded-full"
                style={{
                  background: style ? style.dot : "var(--c-ink-40)",
                  boxShadow: it.tone === "milestone" ? `0 0 8px ${style?.dot}` : "none",
                }}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                {style && (
                  <span
                    className="inline-block mr-2 text-[9.5px] font-mono uppercase tracking-widest"
                    style={{ color: style.dot }}
                  >
                    {style.label}
                  </span>
                )}
                <span className="text-[13.5px] text-ink leading-[1.55]">{it.text}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Kpi({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "good" | "warn" | "default";
}) {
  const colorMap = {
    good: "#2DBE6D",
    warn: "#F0C05A",
    default: "var(--c-ink)",
  } as const;
  return (
    <div className="bg-panel p-5">
      <div className="text-[10.5px] font-mono uppercase tracking-widest text-ink-40">
        {label}
      </div>
      <div
        className="mt-2 stat-num text-[24px] sm:text-[28px]"
        style={{ color: colorMap[tone] }}
      >
        {value}
      </div>
    </div>
  );
}

function phaseDateRange(releases: Release[]): string {
  if (releases.length === 0) return "";
  const dates = releases.map((r) => r.date).sort();
  const first = dates[0];
  const last = dates[dates.length - 1];
  return first === last ? first : `${first} — ${last}`;
}
