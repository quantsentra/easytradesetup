"use client";

import { useState } from "react";

type Props = {
  refillDoneToday: boolean;
  openIssueCount:  number;
  oldestOpenIssue: { number: number; title: string; html_url: string } | null;
};

type Status = "idle" | "loading" | "ok" | "error";

export default function HermesDailyTasks({ refillDoneToday, openIssueCount, oldestOpenIssue }: Props) {
  return (
    <div
      className="tz-card mb-4"
      style={{
        padding: 0,
        background: "linear-gradient(135deg, rgba(43,123,255,0.10), rgba(34,211,238,0.05))",
        borderColor: "rgba(43,123,255,0.40)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--tz-border, rgba(255,255,255,0.08))" }}>
        <h2 className="text-[13px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-cyan, #22D3EE)", margin: 0 }}>
          Daily routine — click to run
        </h2>
        <p className="text-[12px] mt-1" style={{ color: "var(--tz-ink-mute)", margin: "4px 0 0", lineHeight: 1.5 }}>
          One button refills the backlog from Reddit demand signals (free).
          One button copies today&apos;s prompt — paste into Claude Code, drafting happens in your existing subscription.
          Step 3 is reading the PR and merging.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
        <RefillTile
          done={refillDoneToday}
          openCount={openIssueCount}
        />
        <PromptTile
          oldestIssue={oldestOpenIssue}
          openCount={openIssueCount}
        />
        <ReviewTile />
      </div>
    </div>
  );
}

function RefillTile({ done, openCount }: { done: boolean; openCount: number }) {
  const [status, setStatus] = useState<Status>("idle");
  const [msg,    setMsg]    = useState<string | null>(null);
  const [count,  setCount]  = useState<number>(1);

  async function refill() {
    if (status === "loading") return;
    setStatus("loading");
    setMsg("Scraping Reddit, scoring topics, filing issues…");
    try {
      const res = await fetch("/api/admin/hermes/refill-backlog", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setStatus("ok");
      if (data.created === 0) {
        setMsg(data.message ?? "Nothing new to file — backlog already covers this week's topics.");
      } else {
        setMsg(`Filed ${data.created} new issue${data.created === 1 ? "" : "s"} from Reddit demand signal. Refresh the page to see them in the table below.`);
      }
      setTimeout(() => location.reload(), 2500);
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <Tile
      step="1"
      title="Refill backlog"
      subtitle="Reddit demand-scrape · free"
      done={done}
      cta={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <label className="font-mono text-[10.5px] uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
              Issues to file:
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={status === "loading"}
              style={selectStyle}
            >
              <option value={1}>1 (daily)</option>
              <option value={3}>3</option>
              <option value={5}>5 (weekly)</option>
            </select>
          </div>
          <button
            type="button"
            onClick={refill}
            disabled={status === "loading"}
            className="tz-btn"
            style={{
              ...primaryBtn,
              cursor: status === "loading" ? "wait" : "pointer",
            }}
          >
            {status === "loading" ? "… working" : `→ Refill ${count} now`}
          </button>
          <Hint status={status} msg={msg} />
        </div>
      }
      caption={
        done
          ? `Done in last 24h · ${openCount} open in queue`
          : openCount === 0
            ? "Queue empty — start here"
            : `${openCount} open in queue · refill anytime`
      }
    />
  );
}

function PromptTile({ oldestIssue, openCount }: { oldestIssue: Props["oldestOpenIssue"]; openCount: number }) {
  const [status, setStatus] = useState<Status>("idle");
  const [msg,    setMsg]    = useState<string | null>(null);

  async function copy() {
    if (status === "loading") return;
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/admin/hermes/today-prompt", { credentials: "same-origin" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

      // Try modern clipboard API first, fall back to legacy textarea trick
      // for browsers without secure-context (rare but possible on staging).
      try {
        await navigator.clipboard.writeText(data.prompt);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = data.prompt;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }

      setStatus("ok");
      setMsg(`Copied prompt for #${data.issueNumber}. Paste into Claude Code now.`);
      setTimeout(() => { setStatus("idle"); setMsg(null); }, 5000);
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  const disabled = openCount === 0;

  return (
    <Tile
      step="2"
      title="Copy today's prompt"
      subtitle="Drafts in Claude Code · free"
      done={false}
      borderLeft
      cta={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            type="button"
            onClick={copy}
            disabled={disabled || status === "loading"}
            className="tz-btn"
            style={{
              ...primaryBtn,
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? "not-allowed" : status === "loading" ? "wait" : "pointer",
            }}
          >
            {status === "loading" ? "… preparing" : status === "ok" ? "✓ Copied — paste into Claude Code" : "→ Copy prompt to clipboard"}
          </button>
          <Hint status={status} msg={msg} />
          {oldestIssue && (
            <a
              href={oldestIssue.html_url}
              target="_blank"
              rel="noopener"
              className="font-mono text-[10.5px] uppercase tracking-widest"
              style={{ color: "var(--tz-ink-mute)" }}
            >
              ↗ #{oldestIssue.number} · {oldestIssue.title.slice(0, 40)}{oldestIssue.title.length > 40 ? "…" : ""}
            </a>
          )}
        </div>
      }
      caption={
        disabled
          ? "Refill the backlog first"
          : `Will pre-fill #${oldestIssue?.number ?? "?"} (oldest open)`
      }
    />
  );
}

function ReviewTile() {
  return (
    <Tile
      step="3"
      title="Review &amp; merge PRs"
      subtitle="Quality gate · ~5 min"
      done={false}
      borderLeft
      cta={
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <a
            href="https://github.com/quantsentra/easytradesetup/pulls"
            target="_blank"
            rel="noopener"
            className="tz-btn"
            style={primaryBtn}
          >
            ↗ Open GitHub PRs
          </a>
          <a
            href="https://github.com/quantsentra/easytradesetup/issues?q=is%3Aopen+label%3Ahermes+label%3Aauto-mined"
            target="_blank"
            rel="noopener"
            className="font-mono text-[10.5px] uppercase tracking-widest"
            style={{ color: "var(--tz-ink-mute)" }}
          >
            ↗ Auto-mined issues
          </a>
        </div>
      }
      caption="Merge the good ones, comment fixes on the rest"
    />
  );
}

function Tile({
  step, title, subtitle, done, cta, caption, borderLeft,
}: {
  step:      string;
  title:     string;
  subtitle:  string;
  done:      boolean;
  cta:       React.ReactNode;
  caption:   string;
  borderLeft?: boolean;
}) {
  return (
    <div
      style={{
        padding: 18,
        borderLeft: borderLeft ? "1px solid var(--tz-border, rgba(255,255,255,0.08))" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            padding: "2px 7px",
            borderRadius: 4,
            background: done ? "rgba(34,197,94,0.18)" : "rgba(43,123,255,0.16)",
            color: done ? "var(--tz-up, #22C55E)" : "var(--tz-cyan, #22D3EE)",
            letterSpacing: "0.04em",
          }}
        >
          {done ? "✓" : `Step ${step}`}
        </span>
        <h3 style={{ fontSize: 14.5, fontWeight: 600, margin: 0, color: "var(--tz-ink)" }}>
          {title}
        </h3>
      </div>
      <div className="font-mono text-[10.5px] uppercase tracking-widest mb-3" style={{ color: "var(--tz-ink-mute)" }}>
        {subtitle}
      </div>
      {cta}
      <div className="text-[11px] mt-3" style={{ color: "var(--tz-ink-mute)", lineHeight: 1.5 }}>
        {caption}
      </div>
    </div>
  );
}

function Hint({ status, msg }: { status: Status; msg: string | null }) {
  if (!msg) return null;
  const color =
    status === "error" ? "var(--tz-loss, #FF4D4F)" :
    status === "ok"    ? "var(--tz-up, #22C55E)" :
    status === "loading" ? "var(--tz-amber, #FFB341)" :
                            "var(--tz-ink-mute)";
  return (
    <span
      className="font-mono"
      style={{ fontSize: 10.5, color, lineHeight: 1.45 }}
    >
      {msg}
    </span>
  );
}

const primaryBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(43,123,255,0.20), rgba(34,211,238,0.12))",
  borderColor: "rgba(43,123,255,0.45)",
  textAlign: "left",
};

const selectStyle: React.CSSProperties = {
  padding: "4px 6px",
  background: "var(--tz-surface-2, rgba(255,255,255,0.02))",
  border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
  borderRadius: 4,
  color: "var(--tz-ink)",
  fontSize: 11,
  fontFamily: "var(--tz-mono, ui-monospace, monospace)",
};
