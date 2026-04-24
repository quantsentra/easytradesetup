import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getEntitlement } from "@/lib/entitlements";
import { touchAndGetPrevious } from "@/lib/user-activity";
import { fetchLatestUpdate, countUpdatesSince } from "@/lib/updates";

export default async function PortalDashboard() {
  const user = await currentUser();
  const firstName = user?.firstName || user?.username || "trader";
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eye">
            <span className="eye-dot" aria-hidden />
            {isReturning ? "Welcome back" : "Dashboard"}
          </span>
          <h1 className="mt-3 font-display text-[36px] sm:text-[44px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            {isReturning ? `Welcome back, ${firstName}.` : `Welcome, ${firstName}.`}
          </h1>
          <p className="mt-3 text-[15px] text-ink-60">
            {active ? (
              isReturning && activity.previousLastSeen ? (
                newNotesSince > 0 ? (
                  <>
                    <strong className="text-ink">
                      {newNotesSince} new market note{newNotesSince === 1 ? "" : "s"}
                    </strong>{" "}
                    since your last visit on{" "}
                    {new Date(activity.previousLastSeen).toISOString().slice(0, 10)}.
                  </>
                ) : (
                  <>
                    No new notes since{" "}
                    {new Date(activity.previousLastSeen).toISOString().slice(0, 10)}. Latest
                    version of the indicator is below.
                  </>
                )
              ) : (
                "Your access is active for life. Everything below ships at the version you bought — plus every future update."
              )
            ) : (
              "You don't have an active license yet. Reserve the launch price and your dashboard unlocks the moment payment clears."
            )}
          </p>
        </div>
        <div>
          <span className={active ? "chip chip-acid" : "chip"}>
            {active ? "Lifetime access · active" : "No license yet"}
          </span>
        </div>
      </div>

      {active && latestUpdate && (
        <Link
          href={`/portal/updates/${latestUpdate.slug}`}
          className="mt-10 block glass-card p-6 sm:p-8 hover:border-rule-3 transition-colors group"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-micro font-semibold text-cyan uppercase tracking-wider">
                {newNotesSince > 0 ? "Latest market note · unread" : "Latest market note"}
              </div>
              <h2 className="mt-2 font-display text-[22px] sm:text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">
                {latestUpdate.title}
              </h2>
              {latestUpdate.excerpt && (
                <p className="mt-3 text-[14.5px] text-ink-60 leading-relaxed max-w-[640px]">
                  {latestUpdate.excerpt}
                </p>
              )}
              <div className="mt-4 text-[13px] text-cyan group-hover:text-ink transition-colors">
                Read today&apos;s bias →
              </div>
            </div>
            <time className="font-mono text-[11px] uppercase tracking-widest text-ink-40 whitespace-nowrap">
              {new Date(latestUpdate.published_at).toISOString().slice(0, 10)}
            </time>
          </div>
        </Link>
      )}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          hint="Docusaurus-style library"
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
          hint="Open a ticket · founder replies in 24h"
          href="/portal/support"
          cta="Get help"
          locked={false}
        />
        <Tile
          title="Account"
          hint="Email · billing · sessions"
          href="/portal/account"
          cta="Open account"
          locked={false}
        />
      </div>

      {!active && (
        <div className="mt-10 glass-card p-6 sm:p-8">
          <div className="text-micro font-semibold text-cyan uppercase tracking-wider">
            Not a customer yet
          </div>
          <h2 className="mt-2 h-card">Lock in the launch price first.</h2>
          <p className="mt-2 text-[14px] text-ink-60 leading-relaxed">
            Inaugural window is still open. One-time payment, lifetime access, 7-day refund.
            Your portal unlocks the moment payment clears.
          </p>
          <div className="mt-5">
            <Link href="/checkout" className="btn btn-acid">
              Reserve the launch price <span className="arrow" aria-hidden>→</span>
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
    <Link
      href={href}
      className="feat-card !p-6 group hover:border-rule-3 transition-colors"
      aria-disabled={locked ? "true" : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[17px] font-semibold tracking-[-0.015em] text-ink">
          {title}
        </h3>
        {badge && (
          <span className="chip chip-acid !py-0.5 !px-2 text-[10px]">{badge}</span>
        )}
        {locked && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-ink-40">
            Locked
          </span>
        )}
      </div>
      <p className="mt-1 text-[12.5px] text-ink-60">{hint}</p>
      <div className="mt-6 text-[13px] font-medium text-cyan group-hover:text-ink transition-colors">
        {cta} →
      </div>
    </Link>
  );
}
