"use client";

import { useState } from "react";

type Post = {
  day: number;
  date: string;
  platform: "instagram" | "youtube_shorts";
  format: "carousel" | "reel" | "short" | "static";
  slides?: number;
  duration_seconds?: number;
  keyword_target: string;
  hook: string;
  slide_outline?: string[];
  script?: string[];
  caption: string;
  image_prompt: string;
  cta: string;
};

type CopyState = "idle" | "ok" | "error";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<CopyState>("idle");

  async function handle() {
    try {
      await navigator.clipboard.writeText(text);
      setState("ok");
      setTimeout(() => setState("idle"), 1400);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  const stateColor =
    state === "ok"    ? "var(--tz-cyan, #22D3EE)" :
    state === "error" ? "var(--tz-loss, #FF4D4F)" :
                        "var(--tz-border, rgba(255,255,255,0.08))";

  const prefix =
    state === "ok"    ? "✓ " :
    state === "error" ? "✕ " :
                        "⧉ ";

  return (
    <button
      type="button"
      onClick={handle}
      style={{
        padding: "5px 10px",
        background: "var(--tz-surface-2, rgba(255,255,255,0.02))",
        border: `1px solid ${stateColor}`,
        borderRadius: 4,
        color: "var(--tz-ink)",
        cursor: "pointer",
        fontSize: 11,
        fontFamily: "var(--tz-mono, ui-monospace, monospace)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        transition: "border-color .15s",
      }}
    >
      {prefix}{state === "ok" ? "copied" : state === "error" ? "failed" : label}
    </button>
  );
}

function PlatformPill({ value }: { value: Post["platform"] }) {
  const map = {
    instagram:      { bg: "rgba(232,67,147,0.15)", fg: "#FF6B9D", label: "Instagram" },
    youtube_shorts: { bg: "rgba(255,77,79,0.15)",  fg: "#FF6B6B", label: "YT Short" },
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

function FormatPill({ value }: { value: Post["format"] }) {
  return (
    <span
      className="font-mono"
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: "rgba(255,255,255,0.04)",
        color: "var(--tz-ink-mute)",
        borderRadius: 4,
        fontSize: 11,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {value}
    </span>
  );
}

export default function PostCard({ p, hashtagPool }: { p: Post; hashtagPool: string[] }) {
  // Pull last line of caption that contains hashtags so the standalone hashtag
  // copy gives just the tags. Falls back to the full hashtag pool joined.
  const captionTags = p.caption.split("\n").map((l) => l.trim()).find((l) => l.startsWith("#")) ?? hashtagPool.slice(0, 6).join(" ");

  return (
    <div className="tz-card" style={{ padding: 18 }}>
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="font-mono"
          style={{
            display: "inline-block",
            padding: "2px 10px",
            background: "rgba(43,123,255,0.18)",
            color: "var(--tz-cyan, #22D3EE)",
            borderRadius: 4,
            fontSize: 11,
            letterSpacing: "0.04em",
          }}
        >
          DAY {p.day} · {p.date}
        </span>
        <PlatformPill value={p.platform} />
        <FormatPill value={p.format} />
        {p.slides && (
          <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
            {p.slides} slides
          </span>
        )}
        {p.duration_seconds && (
          <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
            {p.duration_seconds}s
          </span>
        )}
      </div>

      {/* Hook + meta */}
      <h3 className="text-[15px] font-semibold mb-1" style={{ color: "var(--tz-ink)", lineHeight: 1.35 }}>
        {p.hook}
      </h3>
      <p className="font-mono text-[11px] mb-3" style={{ color: "var(--tz-ink-mute)", margin: "0 0 14px" }}>
        keyword target: <code>{p.keyword_target}</code>  ·  cta: <code>{p.cta}</code>
      </p>

      {/* Quick-copy bar — the whole point of this refactor */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          padding: "10px 12px",
          marginBottom: 14,
          background: "linear-gradient(135deg, rgba(43,123,255,0.10), rgba(34,211,238,0.05))",
          border: "1px solid rgba(43,123,255,0.25)",
          borderRadius: 6,
        }}
      >
        <span className="font-mono" style={{ fontSize: 10.5, color: "var(--tz-ink-mute)", marginRight: 6, alignSelf: "center", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Quick copy →
        </span>
        <CopyButton text={p.hook}         label="Hook"         />
        <CopyButton text={p.caption}      label="Full caption" />
        <CopyButton text={captionTags}    label="Hashtags"     />
        <CopyButton text={p.image_prompt} label="Visual brief" />
        {p.slide_outline && (
          <CopyButton text={p.slide_outline.join("\n\n")} label="Slide outline" />
        )}
        {p.script && (
          <CopyButton text={p.script.join("\n\n")} label="Script" />
        )}
      </div>

      {/* Outline / script */}
      {(p.slide_outline || p.script) && (
        <div style={{ marginBottom: 14 }}>
          <h4 className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--tz-ink-mute)" }}>
            {p.slide_outline ? "Slide outline" : "Script"}
          </h4>
          <ul className="text-[12.5px]" style={{ color: "var(--tz-ink)", margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            {(p.slide_outline ?? p.script ?? []).map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>
      )}

      {/* Caption — copy-pasteable */}
      <div style={{ marginBottom: 14 }}>
        <h4 className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--tz-ink-mute)" }}>
          Caption
        </h4>
        <pre
          className="text-[12.5px]"
          style={{
            margin: 0,
            padding: 12,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
            borderRadius: 6,
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            color: "var(--tz-ink)",
            lineHeight: 1.55,
          }}
        >
{p.caption}
        </pre>
      </div>

      {/* Image / video brief */}
      <div>
        <h4 className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--tz-ink-mute)" }}>
          Visual brief · paste into Canva / Midjourney / Opus prompt
        </h4>
        <p className="text-[12.5px]" style={{ color: "var(--tz-ink-mute)", margin: 0, lineHeight: 1.55 }}>
          {p.image_prompt}
        </p>
      </div>
    </div>
  );
}
