import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
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
  const user = await currentUser();
  const entitlement = await getEntitlement(user?.id);
  const active = entitlement?.active === true;

  if (!active) {
    return (
      <div className="glass-card p-8">
        <h1 className="h-tile">Customer-only</h1>
        <p className="mt-3 text-[15px] text-ink-60">
          Daily pre-market notes — NIFTY, SPX, Gold, BTC — are published inside the portal for
          active customers. Reserve the launch price to unlock.
        </p>
        <Link href="/checkout" className="btn btn-acid mt-6">
          Reserve · lifetime access →
        </Link>
      </div>
    );
  }

  const updates = await fetchUpdates();

  return (
    <>
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Market notes
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Pre-market, daily.
      </h1>
      <p className="mt-3 text-[15px] text-ink-60 max-w-[640px]">
        Global bias + India session plan. Levels, gamma, session timing. Published before the open.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {updates.length === 0 ? (
          <div className="glass-card-soft p-6 text-[14px] text-ink-60">
            No notes yet. First daily drop lands on launch day.
          </div>
        ) : (
          updates.map((u) => (
            <Link
              key={u.id}
              href={`/portal/updates/${u.slug}`}
              className="feat-card !p-5 hover:border-rule-3 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[15.5px] font-semibold text-ink">{u.title}</h3>
                <time className="font-mono text-[11px] uppercase tracking-widest text-ink-40">
                  {new Date(u.published_at).toISOString().slice(0, 10)}
                </time>
              </div>
              <p className="mt-2 text-[13.5px] text-ink-60 leading-relaxed">{u.excerpt}</p>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
