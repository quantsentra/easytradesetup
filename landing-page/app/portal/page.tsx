import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import { getEntitlement } from "@/lib/entitlements";
import { touchAndGetPrevious } from "@/lib/user-activity";
import { fetchLatestUpdates, countUpdatesSince } from "@/lib/updates";

export default async function PortalDashboard() {
  const user = await getUser();
  const fullName = (user?.user_metadata?.full_name as string | undefined) || "";
  const firstName = fullName.split(" ")[0] || user?.email?.split("@")[0] || "trader";
  const entitlement = await getEntitlement(user?.id);
  const active = entitlement?.active === true;

  const activity = user?.id
    ? await touchAndGetPrevious(user.id)
    : { previousLastSeen: null, visitCount: 0 };

  const isReturning = !!activity.previousLastSeen && activity.visitCount > 1;
  const latestUpdates = active ? await fetchLatestUpdates(5) : [];
  const newNotesSince = active && activity.previousLastSeen
    ? await countUpdatesSince(activity.previousLastSeen)
    : 0;

  return (
    <>
      {/* ============ STATUS HERO ============ */}
      <section className="tz-hero-card">
        <div className="tz-hero-grid">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={active ? "tz-chip tz-chip-acid" : "tz-chip"}>
                {active && <span className="tz-chip-dot" />}
                {active ? "Lifetime access · active" : "No license yet"}
              </span>
              {newNotesSince > 0 && (
                <span className="tz-chip tz-chip-cyan">
                  <span className="tz-chip-dot" style={{ background: "var(--tz-cyan)" }} />
                  {newNotesSince} new update{newNotesSince === 1 ? "" : "s"}
                </span>
              )}
            </div>

            <h1 className="tz-hero-title">
              {isReturning ? `Welcome back, ${firstName}.` : `Welcome, ${firstName}.`}
            </h1>

            <p className="tz-hero-sub">
              {active ? (
                isReturning && activity.previousLastSeen ? (
                  newNotesSince > 0 ? (
                    <>
                      <strong>{newNotesSince} new update{newNotesSince === 1 ? "" : "s"}</strong>{" "}
                      since your last visit on{" "}
                      {new Date(activity.previousLastSeen).toISOString().slice(0, 10)}.
                    </>
                  ) : (
                    <>
                      You&apos;re caught up. No new updates since{" "}
                      {new Date(activity.previousLastSeen).toISOString().slice(0, 10)}.
                    </>
                  )
                ) : (
                  <>Lifetime access active. Your portal ships at the version you bought — plus every future update.</>
                )
              ) : (
                <>You don&apos;t have an active license yet. Buy at the launch price to unlock the portal.</>
              )}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {active ? (
                <>
                  <Link href="/portal/downloads" className="tz-btn tz-btn-primary">
                    Download Pine v5 →
                  </Link>
                  <Link href="/portal/docs/founder-welcome" className="tz-btn">
                    Read welcome note
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/checkout" className="tz-btn tz-btn-primary">
                    Buy · $49 →
                  </Link>
                  <Link href="/portal/docs" className="tz-btn">
                    Browse strategies
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero visual — mini chart pulse */}
          <div className="tz-hero-vis" aria-hidden>
            <svg viewBox="0 0 240 120" preserveAspectRatio="none" className="block w-full h-full">
              <defs>
                <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#22D3EE" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="dash-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#2B7BFF" />
                  <stop offset="0.6" stopColor="#22D3EE" />
                  <stop offset="1" stopColor="#F0C05A" />
                </linearGradient>
              </defs>
              <path
                d="M0,90 L24,80 L48,85 L72,65 L96,72 L120,55 L144,40 L168,48 L192,30 L216,38 L240,18 L240,120 L0,120 Z"
                fill="url(#dash-area)"
              />
              <path
                d="M0,90 L24,80 L48,85 L72,65 L96,72 L120,55 L144,40 L168,48 L192,30 L216,38 L240,18"
                stroke="url(#dash-line)"
                strokeWidth="2.4"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="240" cy="18" r="4" fill="#22D3EE" />
              <circle cx="240" cy="18" r="9" fill="#22D3EE" fillOpacity="0.18" />
            </svg>
          </div>
        </div>
      </section>

      {/* ============ START HERE — founder welcome path for new buyers ============ */}
      {active && (
        <section
          className="mt-6 rounded-xl p-5 sm:p-6"
          style={{
            background: "linear-gradient(135deg, rgba(43,123,255,0.10), rgba(34,211,238,0.06))",
            border: "1px solid rgba(34,211,238,0.30)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="tz-chip tz-chip-cyan">
                <span className="tz-chip-dot" style={{ background: "var(--tz-cyan)" }} />
                Start here · founder note
              </span>
              <h2 className="mt-2 text-[18px] sm:text-[20px] font-semibold" style={{ color: "var(--tz-ink)" }}>
                The 6-step path to follow before your first real trade
              </h2>
              <p className="mt-1 text-[13.5px]" style={{ color: "var(--tz-ink-dim)" }}>
                Four-minute read. The sequence Thomas wants every customer to follow — install, learn, demo, then trade small. Read it once, internalise the path.
              </p>
            </div>
            <Link
              href="/portal/docs/founder-welcome"
              className="tz-btn tz-btn-primary flex-none"
            >
              Read welcome →
            </Link>
          </div>
        </section>
      )}

      {/* ============ KPI BENTO ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <Kpi label="License" value={active ? "Active" : "None"}
          delta={active ? "Lifetime · one payment" : "Buy to unlock"}
          accent={active ? "blue" : undefined} />
        <Kpi label="New updates" value={String(newNotesSince)}
          delta={newNotesSince > 0 ? "Unread since last visit" : "All caught up"}
          accent={newNotesSince > 0 ? "cyan" : undefined} />
        <Kpi label="Sessions" value={String(activity.visitCount)}
          delta={isReturning ? "Returning trader" : "First session"} />
        <Kpi label="Indicator" value="Golden v5"
          delta="Pine v5 · TradingView" accent="gold" />
      </div>

      {/* ============ ACTIVITY FEED + SIDE STACK ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mt-8">
        {/* Activity feed */}
        <section>
          <SectionHeader
            title="Updates &amp; founder notes"
            sub={active ? "Indicator versions + occasional founder thoughts" : "Customer-only stream"}
            link={active ? { href: "/portal/updates", label: "All updates →" } : undefined}
          />

          {!active ? (
            <LockedFeed />
          ) : latestUpdates.length === 0 ? (
            <div className="tz-card" style={{ color: "var(--tz-ink-mute)" }}>
              No updates published yet. Big releases and founder notes land here as they ship.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {latestUpdates.map((u, i) => {
                const isNew = activity.previousLastSeen && u.published_at > activity.previousLastSeen;
                return (
                  <Link key={u.id} href={`/portal/updates/${u.slug}`} className="tz-feed-row">
                    <span className={`tz-feed-dot ${isNew ? "is-new" : ""}`} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="tz-feed-title">{u.title}</h3>
                        {isNew && (
                          <span className="tz-chip tz-chip-cyan" style={{ height: 18, fontSize: 10 }}>
                            New
                          </span>
                        )}
                        {i === 0 && !isNew && (
                          <span className="tz-chip" style={{ height: 18, fontSize: 10 }}>
                            Latest
                          </span>
                        )}
                      </div>
                      {u.excerpt && (
                        <p className="tz-feed-excerpt">{u.excerpt}</p>
                      )}
                    </div>
                    <time className="tz-feed-date">
                      {new Date(u.published_at).toISOString().slice(0, 10)}
                    </time>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Side stack — quick actions */}
        <aside className="flex flex-col gap-3">
          <SectionHeader title="Quick actions" />
          <ActionCard
            title="Golden Indicator"
            sub="Pine v5 · latest version"
            href={active ? "/portal/downloads" : "/checkout"}
            cta={active ? "Download" : "Buy"}
            icon="↓"
            tone="blue"
            locked={!active}
          />
          <ActionCard
            title="Indicator Course + Quiz"
            sub="11 lessons · knowledge quiz"
            href={active ? "/portal/docs/indicator-basics" : "/checkout"}
            cta={active ? "Start" : "Buy"}
            icon="🎓"
            tone="gold"
            locked={!active}
          />
          <ActionCard
            title="Risk Calculator"
            sub="Position sizer · R-multiple"
            href={active ? "/portal/docs/risk-calculator" : "/checkout"}
            cta={active ? "Open" : "Buy"}
            icon="⌗"
            tone="cyan"
            locked={!active}
          />
          <ActionCard
            title="Open a ticket"
            sub="Founder replies in 24h"
            href="/portal/support"
            cta="Support"
            icon="✉"
            tone="ink"
          />
        </aside>
      </div>

      {/* ============ INACTIVE NUDGE ============ */}
      {!active && (
        <section className="mt-10 tz-cta-banner">
          <div className="min-w-0">
            <span className="tz-chip tz-chip-cyan">
              <span className="tz-chip-dot" style={{ background: "var(--tz-cyan)" }} />
              Launch price · 67% off retail
            </span>
            <h2 className="tz-cta-title">Lock in the launch price first.</h2>
            <p className="tz-cta-sub">
              One permanent price — 67% off retail, always. One-time payment, lifetime access.
              Your portal unlocks the moment payment clears.
            </p>
          </div>
          <Link href="/checkout" className="tz-btn tz-btn-primary tz-btn-lg flex-shrink-0">
            Buy · $49 →
          </Link>
        </section>
      )}
    </>
  );
}

/* ---------- Building blocks ---------- */

function SectionHeader({
  title, sub, link,
}: {
  title: string;
  sub?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-3">
      <div className="min-w-0">
        <h2 className="tz-section-title">{title}</h2>
        {sub && <div className="tz-section-sub">{sub}</div>}
      </div>
      {link && (
        <Link href={link.href} className="tz-section-link">{link.label}</Link>
      )}
    </div>
  );
}

function Kpi({
  label, value, delta, accent,
}: {
  label: string;
  value: string;
  delta: string;
  accent?: "blue" | "cyan" | "gold";
}) {
  const valueColor =
    accent === "blue" ? "var(--tz-acid-dim)" :
    accent === "cyan" ? "var(--tz-cyan-dim)" :
    accent === "gold" ? "#9a6e1f" :
    "var(--tz-ink)";
  return (
    <div className={`tz-kpi ${accent === "blue" ? "acc" : ""}`}>
      <div className="tz-kpi-label">{label}</div>
      <div className="tz-kpi-value" style={{ color: valueColor, fontSize: value.length > 8 ? 20 : 28 }}>
        {value}
      </div>
      <div className="tz-kpi-delta">{delta}</div>
    </div>
  );
}

function ActionCard({
  title, sub, href, cta, icon, tone, locked,
}: {
  title: string;
  sub: string;
  href: string;
  cta: string;
  icon: string;
  tone: "blue" | "cyan" | "gold" | "ink";
  locked?: boolean;
}) {
  const palette =
    tone === "blue"
      ? { bg: "rgba(43,123,255,0.10)", fg: "var(--tz-acid-dim)", border: "rgba(43,123,255,0.22)" }
      : tone === "cyan"
      ? { bg: "rgba(34,211,238,0.12)", fg: "var(--tz-cyan-dim)", border: "rgba(34,211,238,0.30)" }
      : tone === "gold"
      ? { bg: "rgba(240,192,90,0.16)", fg: "#9a6e1f", border: "rgba(240,192,90,0.40)" }
      : { bg: "var(--tz-surface-3)", fg: "var(--tz-ink-dim)", border: "var(--tz-border)" };

  return (
    <Link href={href} className="tz-action-card" aria-disabled={locked ? "true" : undefined}>
      <span
        className="tz-action-icon"
        style={{ background: palette.bg, color: palette.fg, borderColor: palette.border }}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="tz-action-title">{title}</h3>
          {locked && (
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest"
              style={{ color: "var(--tz-ink-mute)" }}>
              Locked
            </span>
          )}
        </div>
        <p className="tz-action-sub">{sub}</p>
      </div>
      <span className="tz-action-cta">{cta} →</span>
    </Link>
  );
}

function LockedFeed() {
  return (
    <div className="tz-card relative overflow-hidden" style={{ padding: "26px 24px", minHeight: 220 }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.85) 80%)",
      }} />
      <div className="relative">
        <span className="tz-chip">Customer-only</span>
        <h3 className="mt-3 font-display font-semibold text-[18px]" style={{ color: "var(--tz-ink)" }}>
          Updates &amp; founder notes.
        </h3>
        <p className="mt-2 text-[13.5px]" style={{ color: "var(--tz-ink-dim)" }}>
          New indicator versions, fresh strategy pages, and occasional founder thoughts on how to
          read the chart. No daily spam — only signal that changes how you trade. Buy to unlock.
        </p>
        <div className="mt-4 flex flex-col gap-2 opacity-50">
          {["Welcome from Thomas — your path", "Indicator v5 release notes", "New setup · Opening Range Breakout"].map((t) => (
            <div key={t} className="tz-feed-row" style={{ pointerEvents: "none" }}>
              <span className="tz-feed-dot" aria-hidden />
              <div className="min-w-0 flex-1">
                <h3 className="tz-feed-title">{t}</h3>
                <p className="tz-feed-excerpt">Buy to read.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
