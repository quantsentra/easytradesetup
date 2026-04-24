import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/server";

async function getCounts() {
  try {
    const supa = createSupabaseAdmin();
    const [ent, upd, dl] = await Promise.all([
      supa.from("entitlements").select("user_id", { count: "exact", head: true }).eq("active", true),
      supa.from("updates").select("id", { count: "exact", head: true }).eq("draft", false),
      supa.from("downloads").select("id", { count: "exact", head: true }),
    ]);
    return {
      active: ent.count ?? 0,
      updates: upd.count ?? 0,
      downloads: dl.count ?? 0,
    };
  } catch {
    return { active: 0, updates: 0, downloads: 0 };
  }
}

export default async function AdminOverview() {
  const c = await getCounts();

  return (
    <>
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Admin
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Overview.
      </h1>
      <p className="mt-3 text-[15px] text-ink-60 max-w-[640px]">
        Operational dashboard — live customer counts, published notes, and download attempts.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Active licenses" value={c.active} hint="Entitlements · active = true" />
        <Stat label="Published notes" value={c.updates} hint="Market notes · draft = false" />
        <Stat label="Download attempts" value={c.downloads} hint="All time · audit log" />
      </div>

      <div className="mt-10 glass-card-soft p-6">
        <h2 className="h-card">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/updates" className="btn btn-primary">
            Publish a market note →
          </Link>
          <Link href="/portal" className="btn btn-outline">
            Open customer portal →
          </Link>
        </div>
      </div>
    </>
  );
}

function Stat({
  label, value, hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="feat-card !p-6">
      <div className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40">{label}</div>
      <div className="mt-2 font-display text-[36px] font-semibold text-ink tabular-nums">{value}</div>
      <div className="mt-1 text-[12px] text-ink-60">{hint}</div>
    </div>
  );
}
