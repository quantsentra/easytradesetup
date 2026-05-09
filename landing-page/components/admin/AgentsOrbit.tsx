"use client";

// Animated agents-and-skills map for /admin/architecture.
// Pure SVG + CSS keyframes — no JS animation, no external deps.
//
// Visual: 5 concentric rings around a central "Operator" node.
//   - Inner ring: primary AI workers (Claude Code, Hermes)
//   - Middle ring: research substrate (Reddit, GitHub, Topic Miner)
//   - Outer ring: automation (IG, YT, Cron, Token-Refresh)
//
// Each connection line carries a moving dash pattern (stroke-dashoffset
// animation) so the eye reads it as "data flowing". Active vs paused
// nodes are color-coded — paused YT publisher is dimmed orange instead
// of cyan.

type Node = {
  key:    string;
  label:  string;
  ring:   "core" | "inner" | "middle" | "outer";
  angle:  number;        // degrees, 0 = top, clockwise
  status: "active" | "paused" | "manual";
  icon:   string;        // emoji-free single char or short code
  hint:   string;        // tooltip
};

const NODES: Node[] = [
  // CORE
  { key: "operator", label: "Operator (you)", ring: "core", angle: 0, status: "active", icon: "you", hint: "Reviews PRs, merges, drops screenshots" },

  // INNER — AI workers
  { key: "claude-code", label: "Claude Code", ring: "inner", angle: 270, status: "manual", icon: "CC", hint: "Drafts blog articles. Triggered by Copy-prompt button." },
  { key: "hermes", label: "Hermes Agent", ring: "inner", angle: 90, status: "manual", icon: "HA", hint: "External SEO assistant. Reads /content/, files PRs." },

  // MIDDLE — research substrate
  { key: "reddit", label: "Reddit Scraper", ring: "middle", angle: 200, status: "active", icon: "rd", hint: "Free public JSON · 4 subreddits · weekly hot threads" },
  { key: "topic-miner", label: "Topic Miner", ring: "middle", angle: 250, status: "active", icon: "tm", hint: "Cluster + score + dedup against existing issues" },
  { key: "github", label: "GitHub Issues", ring: "middle", angle: 310, status: "active", icon: "gh", hint: "Backlog + PR + comments via fine-grained PAT" },
  { key: "blog-images", label: "Blog Images", ring: "middle", angle: 50, status: "manual", icon: "im", hint: "5 folders by market · operator drops chart screenshots" },
  { key: "gsc", label: "GSC + Bing", ring: "middle", angle: 130, status: "active", icon: "gs", hint: "Google Search Console + Bing Webmaster" },

  // OUTER — automation
  { key: "ig-publisher", label: "IG Auto-Publisher", ring: "outer", angle: 175, status: "active", icon: "IG", hint: "Vercel cron 03:30 UTC daily · 100-day queue" },
  { key: "yt-publisher", label: "YT Auto-Publisher", ring: "outer", angle: 215, status: "paused", icon: "YT", hint: "Vercel cron 04:30 UTC daily · DORMANT (token unset)" },
  { key: "ig-refresh", label: "IG Token Refresh", ring: "outer", angle: 280, status: "active", icon: "rt", hint: "Vercel cron Sun 04:00 UTC weekly · auto-renews 60d token" },
  { key: "cloudinary", label: "Cloudinary", ring: "outer", angle: 340, status: "paused", icon: "cn", hint: "Image-to-video pipeline · used by YT (currently paused)" },
  { key: "vercel-cron", label: "Vercel Cron", ring: "outer", angle: 25, status: "active", icon: "vc", hint: "Scheduler · all daily/weekly tasks fire from here" },
  { key: "supabase", label: "Supabase", ring: "outer", angle: 75, status: "active", icon: "sb", hint: "Postgres state for content_posts, leads, subscriptions" },
  { key: "vercel-deploy", label: "Vercel Deploy", ring: "outer", angle: 120, status: "active", icon: "vd", hint: "Auto-deploy on push to main · ~90s build" },
];

// Radius per ring, in viewbox units.
const RADIUS = { core: 0, inner: 90, middle: 165, outer: 240 };

// Color per status.
const COLORS = {
  active: { stroke: "#22D3EE", fill: "rgba(34,211,238,0.10)", text: "#22D3EE", glow: "rgba(34,211,238,0.45)" },
  paused: { stroke: "#FFB341", fill: "rgba(255,179,65,0.08)",  text: "#FFB341", glow: "rgba(255,179,65,0.30)"  },
  manual: { stroke: "#F0C05A", fill: "rgba(240,192,90,0.08)",  text: "#F0C05A", glow: "rgba(240,192,90,0.30)"  },
} as const;

function nodeXY(angle: number, ring: keyof typeof RADIUS) {
  const r = RADIUS[ring];
  const rad = ((angle - 90) * Math.PI) / 180; // 0deg = top
  return { x: 350 + r * Math.cos(rad), y: 300 + r * Math.sin(rad) };
}

export default function AgentsOrbit() {
  const operator = NODES.find((n) => n.key === "operator")!;
  const others = NODES.filter((n) => n.key !== "operator");
  const center = nodeXY(operator.angle, operator.ring);

  return (
    <div
      className="relative"
      style={{
        width: "100%",
        background: "radial-gradient(circle at 50% 45%, rgba(43,123,255,0.10), transparent 60%), rgba(5,7,15,0.45)",
        border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <svg viewBox="0 0 700 600" style={{ width: "100%", height: "auto", display: "block" }} aria-label="Agents and skills map — animated">
        {/* Orbit guide rings */}
        {(["inner", "middle", "outer"] as const).map((ring) => (
          <circle
            key={ring}
            cx={350}
            cy={300}
            r={RADIUS[ring]}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
        ))}

        {/* Connection lines (drawn before nodes so nodes layer on top) */}
        {others.map((n) => {
          const p = nodeXY(n.angle, n.ring);
          const c = COLORS[n.status];
          return (
            <line
              key={`line-${n.key}`}
              x1={center.x}
              y1={center.y}
              x2={p.x}
              y2={p.y}
              stroke={c.stroke}
              strokeOpacity={0.35}
              strokeWidth={1.25}
              strokeDasharray="4 6"
              className={`agents-flow-${n.status}`}
            />
          );
        })}

        {/* Center node — operator */}
        <g transform={`translate(${center.x}, ${center.y})`}>
          <circle r={42} fill="rgba(43,123,255,0.18)" stroke="#2B7BFF" strokeWidth={1.5} className="agents-pulse-core" />
          <circle r={32} fill="rgba(43,123,255,0.30)" stroke="rgba(43,123,255,0.55)" strokeWidth={1.5} />
          <text textAnchor="middle" dominantBaseline="central" fontSize={11} fontFamily="var(--tz-mono, ui-monospace, monospace)" letterSpacing="0.04em" style={{ textTransform: "uppercase" }} fill="#fff" fontWeight={600}>
            <tspan x={0} y={-4}>YOU</tspan>
            <tspan x={0} y={10} fontSize={8} fillOpacity={0.7}>operator</tspan>
          </text>
        </g>

        {/* Other nodes */}
        {others.map((n) => {
          const p = nodeXY(n.angle, n.ring);
          const c = COLORS[n.status];
          // Label position: outside the node, away from center
          const dx = p.x - center.x;
          const dy = p.y - center.y;
          const len = Math.hypot(dx, dy) || 1;
          const labelOffset = 32;
          const lx = p.x + (dx / len) * labelOffset;
          const ly = p.y + (dy / len) * labelOffset;
          const anchor: "start" | "middle" | "end" =
            Math.abs(dx) < 25 ? "middle" : dx > 0 ? "start" : "end";
          return (
            <g key={n.key}>
              <title>{n.label} — {n.hint}</title>
              {/* Pulsing halo */}
              <circle
                cx={p.x}
                cy={p.y}
                r={22}
                fill={c.fill}
                opacity={0}
                className={`agents-halo-${n.status}`}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={18}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth={1.5}
                style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
              />
              <text
                x={p.x}
                y={p.y + 3}
                textAnchor="middle"
                fontSize={10}
                fontFamily="var(--tz-mono, ui-monospace, monospace)"
                fill={c.text}
                fontWeight={600}
                letterSpacing="0.05em"
                style={{ textTransform: "uppercase" }}
              >
                {n.icon}
              </text>
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                fontSize={10.5}
                fontFamily="var(--tz-mono, ui-monospace, monospace)"
                fill="rgba(255,255,255,0.78)"
                letterSpacing="0.04em"
              >
                {n.label}
              </text>
              {n.status === "paused" && (
                <text
                  x={lx}
                  y={ly + 12}
                  textAnchor={anchor}
                  fontSize={8.5}
                  fontFamily="var(--tz-mono, ui-monospace, monospace)"
                  fill="#FFB341"
                  letterSpacing="0.06em"
                  style={{ textTransform: "uppercase" }}
                >
                  paused
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div
        className="absolute"
        style={{
          left: 14,
          bottom: 14,
          background: "rgba(5,7,15,0.65)",
          border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
          borderRadius: 8,
          padding: "8px 10px",
          fontFamily: "var(--tz-mono, ui-monospace, monospace)",
          fontSize: 10,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <LegendDot color="#22D3EE" label="Active · running" />
        <LegendDot color="#F0C05A" label="Manual · operator triggers" />
        <LegendDot color="#FFB341" label="Paused · resume anytime" />
      </div>

      {/* Counters */}
      <div
        className="absolute"
        style={{
          right: 14,
          top: 14,
          background: "rgba(5,7,15,0.65)",
          border: "1px solid var(--tz-border, rgba(255,255,255,0.08))",
          borderRadius: 8,
          padding: "8px 12px",
          fontFamily: "var(--tz-mono, ui-monospace, monospace)",
          fontSize: 10,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
          textAlign: "right",
        }}
      >
        <div>{NODES.filter(n => n.status === "active").length} active · {NODES.filter(n => n.status === "manual").length} manual · {NODES.filter(n => n.status === "paused").length} paused</div>
        <div style={{ marginTop: 3, opacity: 0.55 }}>{NODES.length - 1} agents + 1 operator</div>
      </div>

      {/* Animations live in a single <style> block scoped via class names */}
      <style>{`
        /* Connection-line dash flow — direction depends on "data flow" */
        .agents-flow-active {
          animation: agents-dash 6s linear infinite;
        }
        .agents-flow-manual {
          animation: agents-dash 9s linear infinite;
        }
        .agents-flow-paused {
          animation: none;
          stroke-opacity: 0.18;
        }
        @keyframes agents-dash {
          to { stroke-dashoffset: -100; }
        }

        /* Pulsing halo behind each node */
        .agents-halo-active {
          animation: agents-halo 3.2s ease-in-out infinite;
        }
        .agents-halo-manual {
          animation: agents-halo 4.8s ease-in-out infinite;
        }
        .agents-halo-paused {
          animation: none;
        }
        @keyframes agents-halo {
          0%, 100% { opacity: 0; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(1.6); }
        }

        /* Center node breathing */
        .agents-pulse-core {
          animation: agents-pulse-core 3.5s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes agents-pulse-core {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.08); }
        }

        @media (prefers-reduced-motion: reduce) {
          .agents-flow-active, .agents-flow-manual,
          .agents-halo-active, .agents-halo-manual,
          .agents-pulse-core {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: 4,
          background: color,
          boxShadow: `0 0 6px ${color}80`,
        }}
      />
      <span>{label}</span>
    </div>
  );
}
