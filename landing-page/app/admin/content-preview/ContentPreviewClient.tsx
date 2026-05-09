"use client";

import { useMemo, useState } from "react";

type Post = {
  day: number;
  date: string;
  format: string;
  theme?: string;
  hook: string;
  caption: string;
  keyword_target: string;
  cta: string;
  slide_outline?: string[];
};

const ALL_THEMES = ["all", "dark-cyan", "dark-gold", "light-clean", "gradient", "chart"];
const ALL_FORMATS = ["all", "static", "carousel"];

export default function ContentPreviewClient({ posts }: { posts: Post[] }) {
  const [themeFilter, setThemeFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [openDay, setOpenDay] = useState<number | null>(null);

  const visible = useMemo(() => {
    return posts.filter((p) => {
      const t = p.theme ?? "dark-cyan";
      if (themeFilter !== "all" && t !== themeFilter) return false;
      if (formatFilter !== "all" && p.format !== formatFilter) return false;
      // Reels are filtered by the cron anyway — hide from preview too.
      if (p.format === "reel" || p.format === "short") return false;
      return true;
    });
  }, [posts, themeFilter, formatFilter]);

  const openPost = openDay !== null ? posts.find((p) => p.day === openDay) : null;

  return (
    <>
      {/* Filters */}
      <div className="tz-card mb-4" style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <FilterGroup
            label="Theme"
            options={ALL_THEMES}
            value={themeFilter}
            onChange={setThemeFilter}
          />
          <FilterGroup
            label="Format"
            options={ALL_FORMATS}
            value={formatFilter}
            onChange={setFormatFilter}
          />
          <span className="font-mono" style={{ color: "var(--tz-ink-mute)", fontSize: 11, marginLeft: "auto" }}>
            showing {visible.length} of {posts.length}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {visible.map((p) => (
          <button
            key={p.day}
            type="button"
            onClick={() => setOpenDay(p.day)}
            style={{
              padding: 0,
              background: "var(--tz-surface-2, rgba(255,255,255,0.02))",
              border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
              borderRadius: 10,
              cursor: "pointer",
              overflow: "hidden",
              textAlign: "left",
              fontFamily: "inherit",
              transition: "border-color .15s, transform .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--tz-cyan, #22D3EE)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--tz-border, rgba(255,255,255,0.08))";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", background: "#0a1224", overflow: "hidden" }}>
              <img
                src={`/api/og/post/${p.day}`}
                alt={`Day ${p.day} — ${p.hook}`}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  padding: "2px 8px",
                  background: "rgba(5,7,15,0.75)",
                  color: "var(--tz-cyan, #22D3EE)",
                  borderRadius: 4,
                  fontSize: 10.5,
                  fontFamily: "var(--tz-mono, ui-monospace, monospace)",
                  letterSpacing: "0.04em",
                }}
              >
                DAY {p.day}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  padding: "2px 8px",
                  background: "rgba(5,7,15,0.75)",
                  color: "rgba(255,255,255,0.65)",
                  borderRadius: 4,
                  fontSize: 10.5,
                  fontFamily: "var(--tz-mono, ui-monospace, monospace)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {p.format}
              </div>
            </div>
            <div style={{ padding: "10px 12px" }}>
              <div className="font-mono text-[10px]" style={{ color: "var(--tz-ink-mute)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {p.theme ?? "dark-cyan"}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--tz-ink)", lineHeight: 1.35, marginTop: 4 }}>
                {truncate(p.hook, 70)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {openPost && (
        <div
          onClick={() => setOpenDay(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="tz-card"
            style={{
              maxWidth: 1100,
              width: "100%",
              maxHeight: "94vh",
              overflowY: "auto",
              padding: 24,
              display: "grid",
              gap: 20,
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div>
              <div className="font-mono text-[10.5px] mb-2" style={{ color: "var(--tz-ink-mute)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Day {openPost.day} · {openPost.date} · {openPost.format} · {openPost.theme ?? "dark-cyan"}
              </div>
              <h3 className="text-[18px] font-semibold mb-3" style={{ color: "var(--tz-ink)", lineHeight: 1.3 }}>
                {openPost.hook}
              </h3>
              <div className="font-mono text-[11px] mb-3" style={{ color: "var(--tz-ink-mute)" }}>
                Keyword target: <code>{openPost.keyword_target}</code>
              </div>
              <pre
                style={{
                  margin: "0 0 14px",
                  padding: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
                  borderRadius: 6,
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: 12,
                  color: "var(--tz-ink)",
                  lineHeight: 1.5,
                }}
              >
{openPost.caption}
              </pre>
              {openPost.slide_outline && openPost.slide_outline.length > 0 && (
                <>
                  <h4 className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--tz-ink-mute)" }}>
                    Slide outline
                  </h4>
                  <ul style={{ fontSize: 12, color: "var(--tz-ink)", margin: 0, paddingLeft: 18, lineHeight: 1.55 }}>
                    {openPost.slide_outline.map((s, i) => (<li key={i}>{s}</li>))}
                  </ul>
                </>
              )}
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <a
                  href={`/api/og/post/${openPost.day}`}
                  target="_blank"
                  rel="noopener"
                  className="tz-btn"
                >↗ Open IG image</a>
                <a
                  href={`/api/og/post/${openPost.day}/yt`}
                  target="_blank"
                  rel="noopener"
                  className="tz-btn"
                >↗ Open YT image</a>
                <button
                  type="button"
                  onClick={() => setOpenDay(null)}
                  className="tz-btn"
                  style={{ marginLeft: "auto" }}
                >Close</button>
              </div>
            </div>
            <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
              <div>
                <div className="font-mono text-[10.5px] mb-2" style={{ color: "var(--tz-ink-mute)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  IG · 1080×1350 (4:5)
                </div>
                <img
                  src={`/api/og/post/${openPost.day}`}
                  alt={`IG · Day ${openPost.day}`}
                  style={{ width: "100%", borderRadius: 8, display: "block" }}
                />
              </div>
              <div>
                <div className="font-mono text-[10.5px] mb-2" style={{ color: "var(--tz-ink-mute)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  YT Short · 1080×1920 (9:16)
                </div>
                <img
                  src={`/api/og/post/${openPost.day}/yt`}
                  alt={`YT · Day ${openPost.day}`}
                  style={{ width: "100%", maxWidth: 320, borderRadius: 8, display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({
  label, options, value, onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span className="font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}:
      </span>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              padding: "4px 10px",
              background: active ? "rgba(43,123,255,0.18)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${active ? "rgba(43,123,255,0.45)" : "var(--tz-border, rgba(255,255,255,0.08))"}`,
              borderRadius: 4,
              color: active ? "var(--tz-cyan, #22D3EE)" : "var(--tz-ink)",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "var(--tz-mono, ui-monospace, monospace)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
