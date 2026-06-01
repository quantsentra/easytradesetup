import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SEO automation · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// The SEO auto-writer routine runs in claude.ai (Anthropic cloud), bound to
// the Claude account that created it. It is NOT controllable from this app
// without storing a claude.ai OAuth token here (deliberately avoided — that
// token would grant full account access). So this page is a control surface:
// it surfaces the live config, deep-links to claude.ai for actual edits, and
// documents the account-switch runbook.
//
// To repoint at a different routine after switching Claude accounts, override
// these via Vercel env vars — no code change needed.
const ROUTINE_ID =
  process.env.SEO_ROUTINE_ID || "trig_016PZ6YN3GMuweWwLu6cGh5f";
const ROUTINE_SCHEDULE =
  process.env.SEO_ROUTINE_SCHEDULE || "Daily · 04:00 UTC (08:00 Asia/Dubai)";
const ROUTINE_ACCOUNT =
  process.env.SEO_ROUTINE_ACCOUNT || "Nextologic Ai Team (claude.ai)";
const ROUTINE_MODEL =
  process.env.SEO_ROUTINE_MODEL || "claude-sonnet-4-6";

const ROUTINE_URL = `https://claude.ai/code/routines/${ROUTINE_ID}`;
const ROUTINES_HUB = "https://claude.ai/code/routines";
const PLAYBOOK_URL =
  "https://github.com/quantsentra/easytradesetup/blob/main/landing-page/docs/seo/auto-writer-playbook.md";

export default function SeoAutomationPage() {
  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">SEO automation.</h1>
          <div className="tz-topbar-sub">
            A remote Claude agent writes + ships one SEO blog post per run,
            following the auto-writer playbook. Runs in claude.ai, auto-pushes
            to <code>main</code>, Vercel deploys.
          </div>
        </div>
        <div className="tz-topbar-actions">
          <a href={ROUTINE_URL} target="_blank" rel="noopener" className="tz-btn">↗ Open routine</a>
          <a href={PLAYBOOK_URL} target="_blank" rel="noopener" className="tz-btn">↗ Playbook</a>
        </div>
      </div>

      {/* Status */}
      <div
        className="tz-card mb-5"
        style={{
          padding: 18,
          background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,211,238,0.04))",
          borderColor: "rgba(34,197,94,0.30)",
        }}
      >
        <div className="font-mono text-[10.5px] uppercase tracking-widest mb-1" style={{ color: "var(--tz-up, #22C55E)" }}>
          ● Active
        </div>
        <p className="text-[13px]" style={{ color: "var(--tz-ink-dim)", margin: 0, lineHeight: 1.55 }}>
          The auto-writer is enabled and runs on schedule. Each run picks the next uncovered
          high-opportunity keyword from <code>admin-assets/seo/keyword-research.json</code>,
          writes a brand-styled article, builds (tests must pass), then commits + pushes.
          If the build fails or the keyword pool is exhausted, it aborts without committing.
        </p>
      </div>

      {/* Config */}
      <h2 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-ink-mute)" }}>
        Configuration
      </h2>
      <div className="tz-card mb-6" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            <ConfigRow label="Routine ID" value={ROUTINE_ID} mono />
            <ConfigRow label="Schedule" value={ROUTINE_SCHEDULE} />
            <ConfigRow label="Claude account" value={ROUTINE_ACCOUNT} />
            <ConfigRow label="Model" value={ROUTINE_MODEL} mono />
            <ConfigRow label="Repo" value="quantsentra/easytradesetup" mono />
            <ConfigRow label="Publish mode" value="Auto-push to main → Vercel deploy" />
            <ConfigRow label="Source keywords" value="admin-assets/seo/keyword-research.json" mono />
          </tbody>
        </table>
      </div>

      <p className="text-[11.5px] mb-6" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.55 }}>
        These values are display-only here. To change the schedule, prompt, or enable/disable,
        edit the routine in claude.ai (↗ Open routine). To repoint this page at a different
        routine after an account switch, set <code>SEO_ROUTINE_ID</code> (+ optional
        <code>SEO_ROUTINE_ACCOUNT</code>, <code>SEO_ROUTINE_SCHEDULE</code>, <code>SEO_ROUTINE_MODEL</code>)
        in Vercel env vars — no code change.
      </p>

      {/* Account-switch runbook */}
      <h2 className="text-[12px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
        Switching Claude accounts
      </h2>
      <div className="tz-card" style={{ padding: 18 }}>
        <p className="text-[13px] mb-3" style={{ color: "var(--tz-ink-dim)", margin: "0 0 12px", lineHeight: 1.6 }}>
          The routine is owned by the Claude account that created it ({ROUTINE_ACCOUNT}). If you
          move to a different Claude account, the old routine keeps running until disabled — recreate
          it under the new account, then turn off the old one. ~2 minutes:
        </p>
        <ol className="text-[13px]" style={{ color: "var(--tz-ink-dim)", margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Sign in to Claude Code with the new account.</li>
          <li>Run <code>/schedule</code> → Create. Point it at <code>quantsentra/easytradesetup</code>, same daily schedule.</li>
          <li>
            For the prompt, paste: <em>&quot;Follow landing-page/docs/seo/auto-writer-playbook.md to draft,
            build, and push one SEO blog post.&quot;</em> The playbook is the whole brain — no other context needed.
          </li>
          <li>Disable the old routine: open <a href={ROUTINES_HUB} target="_blank" rel="noopener" className="tz-link" style={{ color: "var(--tz-cyan, #22D3EE)" }}>claude.ai/code/routines</a> on the old account → toggle off (or delete).</li>
          <li>Update <code>SEO_ROUTINE_ID</code> in Vercel env to the new routine&apos;s ID so this page tracks it.</li>
        </ol>
      </div>

      <p className="mt-6 text-[10.5px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.6 }}>
        Remote agent · runs in Anthropic cloud · zero local dependency · SEO ranks on a 6–12 week lag
      </p>
    </>
  );
}

function ConfigRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <td
        className="font-mono text-[10.5px] uppercase tracking-widest"
        style={{ padding: "11px 16px", color: "var(--tz-ink-mute)", fontWeight: 500, whiteSpace: "nowrap", verticalAlign: "top" }}
      >
        {label}
      </td>
      <td
        style={{ padding: "11px 16px", color: "var(--tz-ink)", fontFamily: mono ? "var(--tz-mono)" : undefined, fontSize: mono ? 12 : 13, wordBreak: "break-all" }}
      >
        {value}
      </td>
    </tr>
  );
}
