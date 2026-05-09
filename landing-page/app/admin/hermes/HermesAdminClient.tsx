"use client";

import { useState } from "react";

type Issue = {
  number: number;
  title: string;
  html_url: string;
  comments: number;
  labels: string[];
};

type Status = "idle" | "loading" | "ok" | "error";

const COMMON_LABELS = ["blog", "ig", "yt", "fb", "keyword-research", "competitor", "meta-fix"];

export default function HermesAdminClient({ issues }: { issues: Issue[] }) {
  return (
    <div
      className="tz-card"
      style={{
        padding: 0,
        background: "linear-gradient(135deg, rgba(43,123,255,0.08), rgba(34,211,238,0.04))",
        borderColor: "rgba(43,123,255,0.30)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <FileTaskForm />
        <FeedbackForm issues={issues} />
      </div>
    </div>
  );
}

function FileTaskForm() {
  const [title,  setTitle]  = useState("");
  const [body,   setBody]   = useState("");
  const [picked, setPicked] = useState<string[]>(["blog"]);
  const [status, setStatus] = useState<Status>("idle");
  const [msg,    setMsg]    = useState<string | null>(null);

  function toggleLabel(l: string) {
    setPicked((cur) => cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!title.trim() || !body.trim()) {
      setStatus("error");
      setMsg("Title and body required.");
      return;
    }
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/admin/hermes/file-task", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), labels: picked }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setStatus("ok");
      setMsg(`Filed #${data.number}. Hermes will pick it up on next poll.`);
      setTitle(""); setBody(""); setPicked(["blog"]);
      setTimeout(() => { setStatus("idle"); setMsg(null); }, 6000);
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <form onSubmit={submit} style={{ padding: 18, borderRight: "1px solid var(--tz-border, rgba(255,255,255,0.08))" }}>
      <h3 className="text-[12px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--tz-cyan, #22D3EE)" }}>
        File new task → Hermes
      </h3>

      <Field label="Title">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog brief: best indicator for nifty options"
          style={input}
          maxLength={180}
        />
      </Field>

      <Field label="Brief / context">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={"What you want Hermes to draft.\n\nKeyword: <>\nAudience: <>\nAngle: <>\n\nLink to keyword-bank row if applicable."}
          style={{ ...input, minHeight: 120, resize: "vertical", fontFamily: "var(--tz-mono, ui-monospace, monospace)", fontSize: 11.5 }}
          maxLength={7000}
        />
      </Field>

      <Field label="Labels">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {COMMON_LABELS.map((l) => {
            const active = picked.includes(l);
            return (
              <button
                key={l}
                type="button"
                onClick={() => toggleLabel(l)}
                style={{
                  padding: "3px 8px",
                  background: active ? "rgba(43,123,255,0.18)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${active ? "rgba(43,123,255,0.45)" : "var(--tz-border, rgba(255,255,255,0.08))"}`,
                  borderRadius: 4,
                  color: active ? "var(--tz-cyan, #22D3EE)" : "var(--tz-ink)",
                  cursor: "pointer",
                  fontSize: 10.5,
                  fontFamily: "var(--tz-mono, ui-monospace, monospace)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {l}
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
        <button
          type="submit"
          disabled={status === "loading"}
          className="tz-btn"
          style={{
            background: "linear-gradient(135deg, rgba(43,123,255,0.20), rgba(34,211,238,0.12))",
            borderColor: "rgba(43,123,255,0.45)",
            cursor: status === "loading" ? "wait" : "pointer",
          }}
        >
          {status === "loading" ? "… filing" : "→ File task on GitHub"}
        </button>
        {msg && (
          <span
            className="font-mono"
            style={{
              fontSize: 10.5,
              color: status === "error" ? "var(--tz-loss, #FF4D4F)" : "var(--tz-up, #22C55E)",
            }}
          >
            {msg}
          </span>
        )}
      </div>
    </form>
  );
}

function FeedbackForm({ issues }: { issues: Issue[] }) {
  const [issueNum, setIssueNum] = useState<number | "">(issues[0]?.number ?? "");
  const [body,     setBody]     = useState("");
  const [status,   setStatus]   = useState<Status>("idle");
  const [msg,      setMsg]      = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!issueNum || !body.trim()) {
      setStatus("error");
      setMsg("Pick an issue and write feedback.");
      return;
    }
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/admin/hermes/comment", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueNumber: issueNum, body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setStatus("ok");
      setMsg(`Comment posted on #${issueNum}.`);
      setBody("");
      setTimeout(() => { setStatus("idle"); setMsg(null); }, 5000);
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <form onSubmit={submit} style={{ padding: 18 }}>
      <h3 className="text-[12px] font-mono uppercase tracking-widest mb-3" style={{ color: "#F0C05A" }}>
        Feedback → existing task
      </h3>

      {issues.length === 0 ? (
        <div style={{ fontSize: 12.5, color: "var(--tz-ink-mute)", lineHeight: 1.5 }}>
          No open issues to comment on. File one on the left, then come back to iterate.
        </div>
      ) : (
        <>
          <Field label="Issue">
            <select
              value={issueNum}
              onChange={(e) => setIssueNum(Number(e.target.value))}
              style={{ ...input, fontFamily: "var(--tz-mono, ui-monospace, monospace)", fontSize: 11.5 }}
            >
              {issues.map((i) => (
                <option key={i.number} value={i.number}>
                  #{i.number} · {i.title.slice(0, 70)}{i.title.length > 70 ? "…" : ""}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Feedback for Hermes">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={"What to change next iteration.\n\n- Tone too formal, soften.\n- Cut section 3, redundant.\n- Add example with BANKNIFTY weekly expiry.\n- Internal link to /sample missing."}
              style={{ ...input, minHeight: 120, resize: "vertical", fontFamily: "var(--tz-mono, ui-monospace, monospace)", fontSize: 11.5 }}
              maxLength={3500}
            />
          </Field>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
            <button
              type="submit"
              disabled={status === "loading"}
              className="tz-btn"
              style={{
                background: "linear-gradient(135deg, rgba(240,192,90,0.20), rgba(240,192,90,0.08))",
                borderColor: "rgba(240,192,90,0.45)",
                cursor: status === "loading" ? "wait" : "pointer",
              }}
            >
              {status === "loading" ? "… posting" : "→ Post feedback"}
            </button>
            {msg && (
              <span
                className="font-mono"
                style={{
                  fontSize: 10.5,
                  color: status === "error" ? "var(--tz-loss, #FF4D4F)" : "var(--tz-up, #22C55E)",
                }}
              >
                {msg}
              </span>
            )}
          </div>
        </>
      )}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="font-mono text-[10.5px] uppercase tracking-widest mb-1" style={{ color: "var(--tz-ink-mute)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

const input: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  background: "var(--tz-surface-2, rgba(255,255,255,0.02))",
  border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
  borderRadius: 6,
  color: "var(--tz-ink)",
  fontSize: 12.5,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};
