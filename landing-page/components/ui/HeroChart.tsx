export default function HeroChart() {
  return (
    <div className="glass-card overflow-hidden">
      <div
        className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-rule"
        style={{ background: "rgba(255, 255, 255, 0.02)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 flex-shrink-0" aria-hidden>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <span className="font-display text-caption font-semibold text-ink truncate">
            NIFTY 50
          </span>
          <span
            className="hidden sm:inline font-mono text-nano text-ink-40 px-2 py-0.5 rounded-md border border-rule-2"
          >
            15m · Golden v2.4
          </span>
        </div>
        <span className="inline-flex items-center gap-2 font-mono text-nano uppercase tracking-widest text-cyan flex-shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full bg-cyan motion-safe:animate-pulse"
            style={{ boxShadow: "0 0 8px #22D3EE" }}
            aria-hidden
          />
          Live
        </span>
      </div>

      <div className="px-4 sm:px-5 pt-4 pb-2 flex items-baseline gap-3">
        <span className="font-display text-[clamp(24px,3.5vw,34px)] font-semibold tabular-nums tracking-tight text-ink">
          24,852.15
        </span>
        <span className="font-mono text-caption text-up font-medium">+104.25 (+0.42%)</span>
      </div>

      <svg
        viewBox="0 0 900 280"
        preserveAspectRatio="none"
        className="w-full h-[240px] sm:h-[280px] block px-2 pb-2"
        role="img"
        aria-label="NIFTY 50 15-minute chart with Golden Indicator overlay — uptrend regime and entry marker"
      >
        <defs>
          <linearGradient id="hero-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#22C55E" stopOpacity="0.35" />
            <stop offset="1" stopColor="#22C55E" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#4E9AFF" />
            <stop offset="0.5" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#F0C05A" />
          </linearGradient>
          <filter id="hero-glow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        <g stroke="rgba(255,255,255,.04)">
          <line x1="0" y1="70" x2="900" y2="70" />
          <line x1="0" y1="140" x2="900" y2="140" />
          <line x1="0" y1="210" x2="900" y2="210" />
        </g>

        <path
          d="M0,220 L50,210 L100,200 L140,220 L180,180 L220,165 L260,140 L300,155 L340,130 L380,115 L420,95 L460,80 L500,110 L540,95 L580,70 L620,55 L660,80 L700,65 L740,40 L780,55 L820,30 L860,50 L900,35 L900,280 L0,280 Z"
          fill="url(#hero-area)"
        />
        <path
          d="M0,220 L50,210 L100,200 L140,220 L180,180 L220,165 L260,140 L300,155 L340,130 L380,115 L420,95 L460,80 L500,110 L540,95 L580,70 L620,55 L660,80 L700,65 L740,40 L780,55 L820,30 L860,50 L900,35"
          fill="none"
          stroke="url(#hero-line)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <line
          x1="0"
          y1="55"
          x2="900"
          y2="55"
          stroke="#4E9AFF"
          strokeWidth="0.8"
          strokeDasharray="4,4"
          opacity="0.6"
        />
        <text
          x="10"
          y="49"
          fill="#4E9AFF"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="10"
          letterSpacing="1"
        >
          KEY · 24,880
        </text>

        <g transform="translate(300,155)">
          <circle r="14" fill="#22D3EE" opacity="0.2" />
          <circle r="7" fill="url(#hero-line)" stroke="#fff" strokeWidth="1.5" />
        </g>
        <text
          x="300"
          y="180"
          textAnchor="middle"
          fill="#22D3EE"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="10"
          letterSpacing="1.5"
          fontWeight="600"
        >
          BUY
        </text>

        <circle cx="900" cy="35" r="5" fill="#22D3EE" filter="url(#hero-glow)" />
        <circle cx="900" cy="35" r="3" fill="#fff" />

        <g transform="translate(770,20)">
          <rect
            x="-40"
            y="-10"
            width="80"
            height="20"
            rx="10"
            fill="rgba(34,197,94,.15)"
            stroke="rgba(34,197,94,.4)"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#22C55E"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fontSize="10"
            fontWeight="600"
            letterSpacing="1"
          >
            UPTREND
          </text>
        </g>
      </svg>

      <div
        className="flex flex-wrap gap-5 px-4 sm:px-5 py-3 border-t border-rule font-mono text-nano uppercase tracking-widest text-ink-40"
      >
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-up" aria-hidden /> Regime
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-sm"
            style={{ background: "#4E9AFF" }}
            aria-hidden
          />
          Key level
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-sm"
            style={{ background: "linear-gradient(135deg, #22D3EE, #2B7BFF)" }}
            aria-hidden
          />
          Entry
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-dn" aria-hidden /> Pullback
        </span>
      </div>
    </div>
  );
}
