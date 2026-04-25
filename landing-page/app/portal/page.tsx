import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import { getEntitlement } from "@/lib/entitlements";
import { touchAndGetPrevious } from "@/lib/user-activity";
import { fetchLatestUpdate, countUpdatesSince } from "@/lib/updates";

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
  const latestUpdate = active ? await fetchLatestUpdate() : null;
  const newNotesSince = active && activity.previousLastSeen
    ? await countUpdatesSince(activity.previousLastSeen)
    : 0;

  return (
    <>
      {/* Topbar */}
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">
            {isReturning ? `Welcome back, ${firstName}.` : `Welcome, ${firstName}.`}
          </h1>
          <div className="tz-topbar-sub">
            {active ? (
              isReturning && activity.previousLastSeen ? (
                newNotesSince > 0 ? (
                  <>
                    <strong style={{ color: "var(--tz-ink)" }}>
                      {newNotesSince} new market note{newNotesSince === 1 ? "" : "s"}
                    </strong>{" "}
                    since {new Date(activity.previousLastSeen).toISOString().slice(0, 10)}.
                  </>
                ) : (
                  <>No new notes since {new Date(activity.previousLastSeen).toISOString().slice(0, 10)}.</>
                )
              ) : (
                "Lifetime access active. Everything below ships at the version you bought — plus every future update."
              )
            ) : (
              "You don't have an active license yet. Reserve the launch price to unlock the portal."
            )}
          </div>
        </div>
        <div className="tz-topbar-actions">
          <span className={active ? "tz-chip tz-chip-acid" : "tz-chip"}>
            {active && <span className="tz-chip-dot" />}
            {active ? "Lifetime access · active" : "No license yet"}
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="tz-kpi acc">
          <div className="tz-kpi-label">License</div>
          <div className="tz-kpi-value" style={{ color: active ? "var(--tz-acid-dim)" : "var(--tz-ink)" }}>
            {active ? "Active" : "None"}
          </div>
          <div className="tz-kpi-delta">
            {active ? "Lifetime · one payment" : "Reserve to unlock"}
          </div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Market notes</div>
          <div className="tz-kpi-value tz-num">{newNotesSince}</div>
          <div className={`tz-kpi-delta ${newNotesSince > 0 ? "up" : ""}`}>
            {newNotesSince > 0 ? "Unread since last visit" : "All caught up"}
          </div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Visits</div>
          <div className="tz-kpi-value tz-num">{activity.visitCount}</div>
          <div className="tz-kpi-delta">{isReturning ? "Returning trader" : "First session"}</div>
        </div>
        <div className="tz-kpi">
          <div className="tz-kpi-label">Indicator</div>
          <div className="tz-kpi-value" style={{ fontSize: 22 }}>Golden v2.4</div>
          <div className="tz-kpi-delta">Pine v5 · TradingView</div>
        </div>
      </div>

      {/* Pinned latest note */}
      {active && latestUpdate && (
        <Link
          href={`/portal/updates/${latestUpdate.slug}`}
          className="block mt-6 tz-card"
          style={{
            padding: "22px 24px",
            background:
              "linear-gradient(135deg, rgba(107,159,30,0.06) 0%, transparent 70%), var(--tz-surface)",
            borderColor: "rgba(107,159,30,0.25)",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <span className={newNotesSince > 0 ? "tz-chip tz-chip-acid" : "tz-chip"}>
                {newNotesSince > 0 ? "New · unread" : "Latest market note"}
              </span>
              <h2 className="mt-3 font-display font-semibold leading-[1.2] tracking-[-0.02em]"
                style={{ fontSize: 24, color: "var(--tz-ink)" }}>
                {latestUpdate.title}
              </h2>
              {latestUpdate.excerpt && (
                <p className="mt-2 text-[14px] leading-relaxed max-w-[680px]"
                  style={{ color: "var(--tz-ink-dim)" }}>
                  {latestUpdate.excerpt}
                </p>
              )}
              <div className="mt-4 text-[13px] font-medium" style={{ color: "var(--tz-acid-dim)" }}>
                Read today&apos;s bias →
              </div>
            </div>
            <time className="tz-num text-[11px] font-mono uppercase tracking-widest whitespace-nowrap"
              style={{ color: "var(--tz-ink-mute)" }}>
              {new Date(latestUpdate.published_at).toISOString().slice(0, 10)}
            </time>
          </div>
        </Link>
      )}

      {/* Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        <Tile
          title="Golden Indicator"
          hint="Pine v5 · latest version"
          href={active ? "/portal/downloads" : "/checkout"}
          cta={active ? "Download script" : "Reserve to unlock"}
          locked={!active}
        />
        <Tile
          title="Trade Logic PDF"
          hint="50+ pages · 8 setups"
          href={active ? "/portal/downloads" : "/checkout"}
          cta={active ? "Open PDF" : "Reserve to unlock"}
          locked={!active}
        />
        <Tile
          title="Risk Calculator"
          hint="Position sizer · R-multiple tracker"
          href={active ? "/portal/docs/risk-calculator" : "/checkout"}
          cta={active ? "Open tool" : "Reserve to unlock"}
          locked={!active}
        />
        <Tile
          title="Strategies"
          hint="Strategy docs · library"
          href="/portal/docs"
          cta="Browse library"
          locked={false}
        />
        <Tile
          title={`Market notes${newNotesSince > 0 ? ` · ${newNotesSince} new` : ""}`}
          hint="Pre-market bias · daily"
          href={active ? "/portal/updates" : "/checkout"}
          cta={active ? "Read latest" : "Customer-only"}
          locked={!active}
          badge={newNotesSince > 0 ? String(newNotesSince) : undefined}
        />
        <Tile
          title="Support"
          hint="Founder replies in 24h"
          href="/portal/support"
          cta="Open a ticket"
          locked={false}
        />
      </div>

      {!active && (
        <div className="mt-8 tz-card" style={{ padding: "26px 28px" }}>
          <span className="tz-chip tz-chip-acid">
            <span className="tz-chip-dot" />
            Not a customer yet
          </span>
          <h2 className="mt-3 font-display font-semibold leading-[1.15] tracking-[-0.02em]"
            style={{ fontSize: 22, color: "var(--tz-ink)" }}>
            Lock in the launch price first.
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed max-w-[640px]"
            style={{ color: "var(--tz-ink-dim)" }}>
            Inaugural window still open. One-time payment, lifetime access, 7-day refund. Your
            portal unlocks the moment payment clears.
          </p>
          <div className="mt-5">
            <Link href="/checkout" className="tz-btn tz-btn-primary">
              Reserve the launch price →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function Tile({
  title, hint, href, cta, locked, badge,
}: {
  title: string;
  hint: string;
  href: string;
  cta: string;
  locked: boolean;
  badge?: string;
}) {
  return (
    <Link href={href} className="tz-tilerow flex-col items-start !gap-3" aria-disabled={locked ? "true" : undefined}>
      <div className="w-full flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold tracking-[-0.015em]"
          style={{ fontSize: 16, color: "var(--tz-ink)" }}>
          {title}
        </h3>
        {badge && <span className="tz-chip tz-chip-acid">{badge}</span>}
        {locked && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest"
            style={{ color: "var(--tz-ink-mute)" }}>
            Locked
          </span>
        )}
      </div>
      <p className="text-[12.5px]" style={{ color: "var(--tz-ink-mute)" }}>{hint}</p>
      <div className="text-[13px] font-medium mt-2" style={{ color: "var(--tz-acid-dim)" }}>
        {cta} →
      </div>
    </Link>
  );
}
