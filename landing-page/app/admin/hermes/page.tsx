import type { Metadata } from "next";
import Link from "next/link";
import {
  listDir,
  listIssues,
  listRecentCommits,
  repoBrowseUrl,
  newIssueUrl,
  type GhFile,
  type GhIssue,
  type GhCommit,
} from "@/lib/hermes/github";
import HermesAdminClient from "./HermesAdminClient";

export const metadata: Metadata = {
  title: "Hermes Agent · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const DRAFT_PATHS = [
  { path: "content/blog",            label: "Blog" },
  { path: "content/youtube-shorts",  label: "YouTube Shorts" },
  { path: "content/instagram",       label: "Instagram" },
  { path: "content/facebook",        label: "Facebook" },
];

export default async function HermesAdminPage() {
  // Fan out the GH calls in parallel. If GITHUB_TOKEN is missing we render
  // the empty-state page with setup instructions instead of crashing.
  let drafts: Array<{ label: string; path: string; files: GhFile[] }> = [];
  let issues: GhIssue[] = [];
  let commits: GhCommit[] = [];
  let configured = true;
  let configError: string | null = null;

  try {
    const [draftLists, issuesRes, commitsRes] = await Promise.all([
      Promise.all(DRAFT_PATHS.map((d) => listDir(d.path).then((files) => ({ ...d, files })))),
      listIssues({ labels: ["hermes"], state: "open", perPage: 30 }),
      listRecentCommits({ path: "content", perPage: 8 }),
    ]);
    drafts = draftLists;
    issues = issuesRes;
    commits = commitsRes;
  } catch (e) {
    configured = false;
    configError = e instanceof Error ? e.message : String(e);
  }

  const totalDrafts = drafts.reduce((acc, d) => acc + d.files.filter((f) => f.type === "file" && !f.name.startsWith("_")).length, 0);
  const totalTemplates = drafts.reduce((acc, d) => acc + d.files.filter((f) => f.type === "file" && f.name.startsWith("_")).length, 0);

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Hermes Agent.</h1>
          <div className="tz-topbar-sub">
            External 24/7 SEO + marketing assistant. Reads this repo, drafts content, files SEO tasks, proposes website changes. Humans approve every merge.
            See <Link className="font-mono" style={{ color: "var(--tz-cyan, #22D3EE)" }} href="https://github.com/quantsentra/easytradesetup/blob/main/docs/seo/hermes-agent-operating-rules.md" target="_blank" rel="noopener">operating rules</Link>.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <a href={newIssueUrl()} target="_blank" rel="noopener" className="tz-btn">↗ New SEO Task on GitHub</a>
          <a href={repoBrowseUrl("docs/seo")} target="_blank" rel="noopener" className="tz-btn">↗ Strategy docs</a>
        </div>
      </div>

      {!configured ? (
        <SetupCard error={configError ?? "GITHUB_TOKEN not set"} />
      ) : (
        <>
          {/* Health strip */}
          <div className="tz-card mb-4" style={{ padding: 18 }}>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
              <Stat label="Open SEO issues"  value={issues.length} accent="#22D3EE" />
              <Stat label="Live drafts"      value={totalDrafts}   accent="#F0C05A" />
              <Stat label="Templates seeded" value={totalTemplates} accent="#8B5CF6" />
              <Stat label="Recent commits"   value={commits.length} accent="#2DBE6D" />
            </div>
          </div>

          {/* Loop diagram */}
          <div className="tz-card mb-4" style={{ padding: 18 }}>
            <h3 className="text-[12px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--tz-ink-mute)" }}>
              The interaction loop
            </h3>
            <pre className="font-mono" style={{ fontSize: 11.5, color: "var(--tz-ink)", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
{`  1. You file a task here  ──────►  GitHub issue (labelled hermes + seo)
  2. Hermes reads issues, drafts content into /content/<channel>/
  3. Hermes opens a PR  ──────────►  You review on GitHub
  4. You comment feedback here  ──►  Hermes refines next draft
  5. You merge PR  ───────────────►  Vercel deploys; metrics tracked
  6. Hermes monitors GSC + repeats with sharper briefs`}
            </pre>
          </div>

          {/* Interaction client (file task + feedback) */}
          <HermesAdminClient
            issues={issues.map((i) => ({ number: i.number, title: i.title, html_url: i.html_url, comments: i.comments, labels: i.labels.map((l) => l.name) }))}
          />

          {/* Drafts by channel */}
          <h2 className="text-[14px] font-mono uppercase tracking-widest mt-6 mb-2" style={{ color: "var(--tz-ink-mute)" }}>
            Drafts by channel
          </h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {drafts.map((d) => (
              <DraftCard key={d.path} channel={d} />
            ))}
          </div>

          {/* Open issues feed */}
          <h2 className="text-[14px] font-mono uppercase tracking-widest mt-6 mb-2" style={{ color: "var(--tz-ink-mute)" }}>
            Open SEO issues · {issues.length}
          </h2>
          {issues.length === 0 ? (
            <div className="tz-card" style={{ padding: 18, color: "var(--tz-ink-mute)", fontSize: 12.5 }}>
              No open issues tagged <code>hermes</code>. File the first one above.
            </div>
          ) : (
            <div className="tz-card" style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    <th style={th}>#</th>
                    <th style={th}>Title</th>
                    <th style={th}>Labels</th>
                    <th style={th}>Comments</th>
                    <th style={th}>Updated</th>
                    <th style={th}></th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((i) => (
                    <tr key={i.number} style={{ borderTop: "1px solid var(--tz-border, rgba(255,255,255,0.08))" }}>
                      <td style={td}><span className="font-mono" style={{ color: "var(--tz-ink-mute)" }}>#{i.number}</span></td>
                      <td style={td}>{i.title}</td>
                      <td style={td}>
                        <span style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {i.labels.map((l) => (
                            <span key={l.name} style={labelChip}>{l.name}</span>
                          ))}
                        </span>
                      </td>
                      <td style={td}>{i.comments}</td>
                      <td style={td} className="font-mono">{relTime(i.updated_at)}</td>
                      <td style={td}>
                        <a href={i.html_url} target="_blank" rel="noopener" className="font-mono" style={{ color: "var(--tz-cyan, #22D3EE)" }}>↗ open</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent commits */}
          <h2 className="text-[14px] font-mono uppercase tracking-widest mt-6 mb-2" style={{ color: "var(--tz-ink-mute)" }}>
            Recent /content commits
          </h2>
          <div className="tz-card" style={{ padding: 18 }}>
            {commits.length === 0 ? (
              <div style={{ color: "var(--tz-ink-mute)", fontSize: 12.5 }}>No commits in <code>/content</code> yet.</div>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                {commits.map((c) => (
                  <li key={c.sha} style={{ fontSize: 12.5, color: "var(--tz-ink)" }}>
                    <span className="font-mono" style={{ color: "var(--tz-ink-mute)" }}>
                      {c.sha.slice(0, 7)} · {relTime(c.commit.author.date)} ·
                    </span>{" "}
                    <a href={c.html_url} target="_blank" rel="noopener" style={{ color: "var(--tz-ink)" }}>
                      {firstLine(c.commit.message)}
                    </a>
                    <span className="font-mono" style={{ color: "var(--tz-ink-mute)" }}>
                      {" "}· {c.author?.login ?? c.commit.author.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function DraftCard({ channel }: { channel: { label: string; path: string; files: GhFile[] } }) {
  const drafts    = channel.files.filter((f) => f.type === "file" && !f.name.startsWith("_"));
  const templates = channel.files.filter((f) => f.type === "file" && f.name.startsWith("_"));
  return (
    <div className="tz-card" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "var(--tz-ink)" }}>{channel.label}</h3>
        <a href={repoBrowseUrl(channel.path)} target="_blank" rel="noopener" className="font-mono" style={{ fontSize: 11, color: "var(--tz-cyan, #22D3EE)" }}>
          ↗ open dir
        </a>
      </div>
      <div className="font-mono text-[10.5px] uppercase tracking-widest mt-1 mb-3" style={{ color: "var(--tz-ink-mute)" }}>
        {drafts.length} draft{drafts.length === 1 ? "" : "s"} · {templates.length} template{templates.length === 1 ? "" : "s"}
      </div>
      {drafts.length === 0 ? (
        <div style={{ fontSize: 12, color: "var(--tz-ink-mute)" }}>No drafts yet. Hermes will land them here.</div>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
          {drafts.slice(0, 8).map((f) => (
            <li key={f.sha} style={{ fontSize: 12 }}>
              <a href={f.html_url} target="_blank" rel="noopener" style={{ color: "var(--tz-ink)" }}>
                {f.name}
              </a>
              <span className="font-mono" style={{ color: "var(--tz-ink-mute)", marginLeft: 6 }}>
                {(f.size / 1024).toFixed(1)}kb
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SetupCard({ error }: { error: string }) {
  return (
    <div
      className="tz-card"
      style={{
        padding: 22,
        borderColor: "rgba(255,179,65,0.45)",
        background: "linear-gradient(135deg, rgba(255,179,65,0.08), rgba(255,77,79,0.04))",
      }}
    >
      <h3 className="text-[14px] font-semibold mb-2" style={{ color: "#FFB341" }}>
        Hermes connection not configured
      </h3>
      <p className="text-[12.5px] mb-3" style={{ color: "var(--tz-ink)", lineHeight: 1.55 }}>
        The dashboard reads from GitHub via a fine-grained personal access token. To wire it up:
      </p>
      <ol className="text-[12.5px]" style={{ color: "var(--tz-ink)", paddingLeft: 18, lineHeight: 1.65, margin: 0 }}>
        <li>Go to <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener" style={{ color: "var(--tz-cyan, #22D3EE)" }}>github.com/settings/personal-access-tokens/new</a> → fine-grained token.</li>
        <li>Repository access: select <code>quantsentra/easytradesetup</code> only.</li>
        <li>Permissions: <code>Contents: Read</code> + <code>Issues: Read &amp; Write</code> + <code>Pull requests: Read</code>. Nothing else.</li>
        <li>Add the token to Vercel as <code>GITHUB_TOKEN</code> (Production + Preview).</li>
        <li>Redeploy. Refresh this page.</li>
      </ol>
      <pre className="font-mono mt-3" style={{ fontSize: 11, color: "var(--tz-loss, #FF4D4F)", whiteSpace: "pre-wrap", margin: 0 }}>
        {error}
      </pre>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontSize: 10.5,
  fontFamily: "var(--tz-mono, ui-monospace, monospace)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--tz-ink-mute)",
  fontWeight: 600,
};

const td: React.CSSProperties = {
  padding: "10px 14px",
  verticalAlign: "top",
};

const labelChip: React.CSSProperties = {
  fontFamily: "var(--tz-mono, ui-monospace, monospace)",
  fontSize: 10,
  padding: "2px 6px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
  borderRadius: 4,
  color: "var(--tz-ink)",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

function firstLine(s: string): string {
  return (s.split("\n")[0] ?? "").slice(0, 100);
}

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.round(ms / 60000);
  if (min < 1)  return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24)   return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30)   return `${d}d ago`;
  const mo = Math.round(d / 30);
  return `${mo}mo ago`;
}
