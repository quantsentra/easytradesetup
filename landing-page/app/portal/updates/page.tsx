import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import { getEntitlement } from "@/lib/entitlements";
import { createSupabaseAdmin } from "@/lib/supabase/server";

type Update = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string;
};

async function fetchUpdates(): Promise<Update[]> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("updates")
      .select("id,title,slug,published_at,excerpt")
      .order("published_at", { ascending: false })
      .limit(30);
    return (data || []) as Update[];
  } catch {
    return [];
  }
}

export default async function UpdatesPage() {
  const user = await getUser();
  const entitlement = await getEntitlement(user?.id);
  const active = entitlement?.active === true;

  if (!active) {
    return (
      <>
        <div className="tz-topbar">
          <div>
            <h1 className="tz-topbar-title">Updates &amp; founder notes.</h1>
            <div className="tz-topbar-sub">Customer-only.</div>
          </div>
        </div>
        <div className="tz-card">
          <p className="text-[15px]" style={{ color: "var(--tz-ink-dim)" }}>
            Indicator versions, new strategy pages, and occasional founder notes — published inside
            the portal for active customers. No daily-grind newsletter; only signal you'll actually
            use. Buy at the launch price to unlock.
          </p>
          <div className="mt-5">
            <Link href="/checkout" className="tz-btn tz-btn-primary">
              Buy · lifetime access →
            </Link>
          </div>
        </div>
      </>
    );
  }

  const updates = await fetchUpdates();

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Updates &amp; founder notes.</h1>
          <div className="tz-topbar-sub">
            New indicator versions, fresh strategy pages, and occasional founder thoughts. No daily
            spam — only signal that changes how you trade.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {updates.length === 0 ? (
          <div className="tz-card" style={{ color: "var(--tz-ink-mute)", fontSize: 14 }}>
            No updates yet. Big releases and founder notes land here as they ship.
          </div>
        ) : (
          updates.map((u) => (
            <Link key={u.id} href={`/portal/updates/${u.slug}`} className="tz-tilerow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[15.5px] font-semibold" style={{ color: "var(--tz-ink)" }}>
                    {u.title}
                  </h3>
                  <time className="font-mono text-[11px] uppercase tracking-widest whitespace-nowrap"
                    style={{ color: "var(--tz-ink-mute)" }}>
                    {new Date(u.published_at).toISOString().slice(0, 10)}
                  </time>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--tz-ink-mute)" }}>
                  {u.excerpt}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
