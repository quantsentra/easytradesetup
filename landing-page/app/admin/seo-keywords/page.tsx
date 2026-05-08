import type { Metadata } from "next";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const metadata: Metadata = {
  title: "SEO keywords · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Headline = {
  keyword: string;
  type: string;
  opportunity: "high" | "medium" | "low";
  why: string;
  content_idea: string;
};

type Keyword = {
  keyword: string;
  opportunity: "high" | "medium" | "low";
  volume: string;
  intent: string;
};

type Group = {
  title: string;
  keywords: Keyword[];
};

type Research = {
  source: string;
  project: string;
  captured: string;
  notes: string;
  headlines: Headline[];
  groups: Group[];
};

async function loadResearch(): Promise<Research> {
  const file = path.join(process.cwd(), "admin-assets", "seo", "keyword-research.json");
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as Research;
}

function OpportunityPill({ value }: { value: "high" | "medium" | "low" }) {
  const map = {
    high:   { bg: "rgba(45,190,109,0.16)",  fg: "#2DBE6D", label: "High"   },
    medium: { bg: "rgba(255,179,65,0.16)",  fg: "#FFB341", label: "Medium" },
    low:    { bg: "rgba(255,255,255,0.06)", fg: "rgba(255,255,255,0.55)", label: "Low" },
  } as const;
  const { bg, fg, label } = map[value];
  return (
    <span
      className="font-mono"
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: bg,
        color: fg,
        borderRadius: 4,
        fontSize: 11,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

export default async function SeoKeywordsPage() {
  const data = await loadResearch();

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">SEO keywords.</h1>
          <div className="tz-topbar-sub">
            Source: <strong>{data.source}</strong> · Captured {data.captured} · Use for blog topics, programmatic
            <code style={{ margin: "0 4px" }}>/indicator/[market]</code> pages, IG / YT hooks, and ad copy.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <Link href="/admin/marketing" className="tz-btn">↗ Marketing checklist</Link>
        </div>
      </div>

      {/* Notes */}
      <div className="tz-card mb-4" style={{ padding: 18 }}>
        <p className="text-[13px]" style={{ color: "var(--tz-ink-mute)", margin: 0, lineHeight: 1.55 }}>
          {data.notes}
        </p>
      </div>

      {/* Headline picks */}
      <h2 className="text-[13px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--tz-ink-mute)" }}>
        Headline picks · highest leverage
      </h2>
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
        {data.headlines.map((h) => (
          <div
            key={h.keyword}
            className="tz-card"
            style={{ padding: 18, borderColor: "rgba(43,123,255,0.35)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10.5px] uppercase tracking-widest" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
                {h.type.replace(/-/g, " ")}
              </span>
              <OpportunityPill value={h.opportunity} />
            </div>
            <h3 className="text-[15px] font-semibold mb-2" style={{ color: "var(--tz-ink)", lineHeight: 1.35 }}>
              {h.keyword}
            </h3>
            <p className="text-[12.5px] mb-2" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.55 }}>
              <strong style={{ color: "var(--tz-ink)" }}>Why: </strong>{h.why}
            </p>
            <p className="text-[12.5px]" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.55, margin: 0 }}>
              <strong style={{ color: "var(--tz-ink)" }}>Content idea: </strong>{h.content_idea}
            </p>
          </div>
        ))}
      </div>

      {/* Grouped keyword tables */}
      <h2 className="text-[13px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--tz-ink-mute)" }}>
        Keyword groups · {data.groups.length} clusters · {data.groups.reduce((n, g) => n + g.keywords.length, 0)} keywords
      </h2>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))" }}>
        {data.groups.map((g) => (
          <div key={g.title} className="tz-card" style={{ padding: 18 }}>
            <h3 className="text-[14px] font-semibold mb-3" style={{ color: "var(--tz-ink)", lineHeight: 1.35 }}>
              {g.title}
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--tz-border, rgba(255,255,255,0.08))" }}>
                  <th style={{ textAlign: "left", padding: "6px 0", color: "var(--tz-ink-mute)", fontWeight: 500, fontSize: 11 }}>Keyword</th>
                  <th style={{ textAlign: "left", padding: "6px 0", color: "var(--tz-ink-mute)", fontWeight: 500, fontSize: 11 }}>Opp.</th>
                  <th style={{ textAlign: "left", padding: "6px 0", color: "var(--tz-ink-mute)", fontWeight: 500, fontSize: 11 }}>Vol.</th>
                  <th style={{ textAlign: "left", padding: "6px 0", color: "var(--tz-ink-mute)", fontWeight: 500, fontSize: 11 }}>Intent</th>
                </tr>
              </thead>
              <tbody>
                {g.keywords.map((k) => (
                  <tr key={k.keyword} style={{ borderBottom: "1px solid var(--tz-border, rgba(255,255,255,0.04))" }}>
                    <td style={{ padding: "8px 0", color: "var(--tz-ink)" }}>{k.keyword}</td>
                    <td style={{ padding: "8px 0" }}><OpportunityPill value={k.opportunity} /></td>
                    <td className="font-mono" style={{ padding: "8px 0", color: "var(--tz-ink-mute)", fontSize: 11 }}>{k.volume}</td>
                    <td className="font-mono" style={{ padding: "8px 0", color: "var(--tz-ink-mute)", fontSize: 11 }}>{k.intent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.6 }}>
        Source data lives at landing-page/admin-assets/seo/keyword-research.json · Re-run AnswerThePublic monthly + overwrite the file · Add new sources by appending to groups[]
      </p>
    </>
  );
}
