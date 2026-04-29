import type { Metadata } from "next";
import { fetchClarityInsights, metricLabel, type ClarityMetric } from "@/lib/clarity";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

const NUM_OF_DAYS = 3 as const;

export default async function AdminAnalytics() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_ID;

  // Three calls in parallel — Clarity returns 1 metric set per call, but
  // accepts up to 3 dimensions per call. Pull the views we care about
  // for an admin dashboard: pages, geo, devices.
  const [pages, geo, devices] = await Promise.all([
    fetchClarityInsights({
      numOfDays: NUM_OF_DAYS,
      dimension1: "Page",
    }),
    fetchClarityInsights({
      numOfDays: NUM_OF_DAYS,
      dimension1: "Country/Region",
      dimension2: "Source",
    }),
    fetchClarityInsights({
      numOfDays: NUM_OF_DAYS,
      dimension1: "Device",
      dimension2: "OS",
      dimension3: "Browser",
    }),
  ]);

  const tokenSet = !!process.env.CLARITY_API_TOKEN;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-ink">
            Analytics
          </h1>
          <p className="mt-1 text-[14px] text-ink-60">
            Microsoft Clarity — last {NUM_OF_DAYS} days. Aggregate metrics. Heatmaps + recordings open in Clarity.
          </p>
        </div>
        {projectId && (
          <a
            href={`https://clarity.microsoft.com/projects/view/${projectId}/dashboard`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue text-white text-[13px] font-medium hover:brightness-110"
          >
            Open Clarity ↗
          </a>
        )}
      </header>

      {!tokenSet && <SetupPanel projectId={projectId} />}

      {tokenSet && (
        <>
          <MetricBlock title="Top pages" result={pages} />
          <MetricBlock title="Geography & traffic source" result={geo} />
          <MetricBlock title="Devices, OS & browsers" result={devices} />

          <DeepLinks projectId={projectId} />
        </>
      )}
    </div>
  );
}

function MetricBlock({
  title,
  result,
}: {
  title: string;
  result: Awaited<ReturnType<typeof fetchClarityInsights>>;
}) {
  if (!result.ok) {
    return (
      <section className="tz-card">
        <div className="tz-card-head">
          <h2 className="tz-card-title">{title}</h2>
        </div>
        <div className="px-5 py-6 text-[13px] text-ink-60">
          Could not load — <code className="font-mono text-[12px]">{result.error}</code>
        </div>
      </section>
    );
  }

  const metrics = result.data;
  if (!metrics.length) {
    return (
      <section className="tz-card">
        <div className="tz-card-head">
          <h2 className="tz-card-title">{title}</h2>
        </div>
        <div className="px-5 py-6 text-[13px] text-ink-60">
          No data yet for this window.
        </div>
      </section>
    );
  }

  return (
    <section className="tz-card">
      <div className="tz-card-head">
        <h2 className="tz-card-title">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule">
        {metrics.map((m) => (
          <MetricCard key={m.metricName} m={m} />
        ))}
      </div>
    </section>
  );
}

function MetricCard({ m }: { m: ClarityMetric }) {
  const rows = m.information.slice(0, 8);
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);

  return (
    <div className="bg-panel p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-ink">
          {metricLabel(m.metricName)}
        </h3>
        <span className="text-[10px] font-mono uppercase tracking-widest text-ink-40">
          {rows.length} {rows.length === 1 ? "row" : "rows"}
        </span>
      </div>
      <div className="overflow-x-auto -mx-5">
        <table className="min-w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-rule">
              {headers.map((h) => (
                <th
                  key={h}
                  className="text-left py-2 px-3 font-medium text-ink-60 text-[10.5px] uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-rule/50 last:border-b-0"
              >
                {headers.map((h) => (
                  <td
                    key={h}
                    className="py-2 px-3 text-ink align-top whitespace-nowrap"
                  >
                    {String(row[h] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeepLinks({ projectId }: { projectId: string | undefined }) {
  if (!projectId) return null;
  const base = `https://clarity.microsoft.com/projects/view/${projectId}`;
  const links: Array<[string, string, string]> = [
    ["Heatmaps", "Click + scroll heatmaps per page", `${base}/heatmaps`],
    ["Recordings", "Watch real session replays", `${base}/recordings`],
    ["Insights", "AI-flagged dead clicks, rage clicks, quick backs", `${base}/insights`],
    ["Funnels", "Build flow: / → /product → /pricing → /checkout", `${base}/funnels`],
    ["Dashboard", "Full Clarity overview", `${base}/dashboard`],
  ];
  return (
    <section className="tz-card">
      <div className="tz-card-head">
        <h2 className="tz-card-title">Deep links — open in Clarity</h2>
        <p className="tz-card-sub">
          Heatmaps and session replays cannot be embedded (Clarity blocks iframe). Open in a new tab.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule">
        {links.map(([label, blurb, href]) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener"
            className="bg-panel p-4 sm:p-5 flex flex-col gap-1 hover:bg-bg-2 transition-colors"
          >
            <span className="text-[14px] font-semibold text-ink flex items-center gap-2">
              {label}
              <span className="text-blue-link" aria-hidden>↗</span>
            </span>
            <span className="text-[12.5px] text-ink-60 leading-snug">{blurb}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function SetupPanel({ projectId }: { projectId: string | undefined }) {
  return (
    <section className="tz-card">
      <div className="tz-card-head">
        <h2 className="tz-card-title">Set up the Data Export API</h2>
        <p className="tz-card-sub">
          Heatmaps and recordings live in Clarity. Aggregate metrics (pages, geo, devices) can render here once
          a Data Export API token is set.
        </p>
      </div>
      <div className="p-5 sm:p-6 space-y-4 text-[13.5px] text-ink leading-relaxed">
        <ol className="space-y-3 list-decimal list-inside">
          <li>
            Open Clarity →{" "}
            {projectId ? (
              <a
                href={`https://clarity.microsoft.com/projects/view/${projectId}/settings`}
                target="_blank"
                rel="noopener"
                className="link-apple"
              >
                Project Settings ↗
              </a>
            ) : (
              "Project Settings"
            )}{" "}
            → <strong>Data Export</strong>.
          </li>
          <li>Click <strong>Generate new API token</strong>. Copy the token (shown only once).</li>
          <li>
            On Vercel → Project Settings → Environment Variables, add{" "}
            <code className="font-mono text-[12.5px] bg-bg-2 px-1.5 py-0.5 rounded">CLARITY_API_TOKEN</code> with the
            token. Production + Preview environments.
          </li>
          <li>Redeploy (no rebuild needed — promoting picks up the env).</li>
          <li>Refresh this page. Metrics appear within ~5 min.</li>
        </ol>
        <p className="text-[12.5px] text-ink-60">
          The token is server-side only — never exposed to the browser. Calls are cached for 30 minutes
          (Clarity rate-limits ~10 / day per token).
        </p>
      </div>
    </section>
  );
}
