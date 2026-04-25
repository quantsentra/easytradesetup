import { createSupabaseAdmin } from "@/lib/supabase/server";

type UpdateRow = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  draft: boolean;
};

async function fetchUpdates(): Promise<UpdateRow[]> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("updates")
      .select("id,title,slug,published_at,draft")
      .order("published_at", { ascending: false })
      .limit(50);
    return (data || []) as UpdateRow[];
  } catch {
    return [];
  }
}

export default async function AdminUpdatesPage() {
  const updates = await fetchUpdates();

  return (
    <>
      <div className="tz-topbar">
        <div>
          <h1 className="tz-topbar-title">Publish a note.</h1>
          <div className="tz-topbar-sub">
            Pre-market bias drops. Goes live the moment you save — unless you tick <em>draft</em>.
          </div>
        </div>
      </div>

      <form
        action="/api/admin/updates"
        method="POST"
        className="tz-card flex flex-col gap-4"
      >
        <Field label="Title">
          <input
            name="title"
            required
            maxLength={140}
            placeholder="NIFTY — pre-market plan · 2026-04-25"
            className="tz-input"
          />
        </Field>
        <Field label="Slug" hint="URL fragment. Lowercase, hyphens. Must be unique.">
          <input
            name="slug"
            required
            maxLength={80}
            pattern="[a-z0-9\-]+"
            placeholder="nifty-2026-04-25"
            className="tz-input font-mono"
          />
        </Field>
        <Field label="Excerpt" hint="One-line teaser shown on the list page.">
          <input
            name="excerpt"
            maxLength={220}
            placeholder="Global risk-on overnight. NIFTY gap-up likely, expect early pullback to ORB low."
            className="tz-input"
          />
        </Field>
        <Field label="Body" hint="Markdown-lite. Blank line between paragraphs. `## heading` and `- list` supported.">
          <textarea
            name="body_mdx"
            required
            rows={12}
            placeholder={"## Global bias\n\nSPX closed up 0.8%. DXY flat.\n\n## India session plan\n\n- PDH: 22,480\n- PDL: 22,340\n- Long above PDH with 50% size"}
            className="tz-input font-mono text-[13px]"
          />
        </Field>
        <label className="flex items-center gap-2 text-[14px]" style={{ color: "var(--tz-ink-dim)" }}>
          <input type="checkbox" name="draft" value="1" className="w-4 h-4" />
          Save as draft (do not publish)
        </label>
        <div>
          <button type="submit" className="tz-btn tz-btn-primary">
            Save note →
          </button>
        </div>
      </form>

      <h2 className="mt-10 mb-4 tz-card-title">Recent notes</h2>
      <div className="flex flex-col gap-2.5">
        {updates.length === 0 ? (
          <div className="tz-card" style={{ color: "var(--tz-ink-mute)", fontSize: 14 }}>
            Nothing published yet.
          </div>
        ) : (
          updates.map((u) => (
            <div key={u.id} className="tz-tilerow justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold" style={{ color: "var(--tz-ink)" }}>
                    {u.title}
                  </span>
                  {u.draft && (
                    <span className="tz-chip tz-chip-amber">Draft</span>
                  )}
                </div>
                <div className="mt-1 font-mono text-[11px]" style={{ color: "var(--tz-ink-mute)" }}>
                  /portal/updates/{u.slug}
                </div>
              </div>
              <time className="font-mono text-[11px] uppercase tracking-widest"
                style={{ color: "var(--tz-ink-mute)" }}>
                {new Date(u.published_at).toISOString().slice(0, 10)}
              </time>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function Field({
  label, hint, children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="tz-field-label">{label}</span>
      {children}
      {hint && (
        <span className="text-[12px]" style={{ color: "var(--tz-ink-mute)" }}>{hint}</span>
      )}
    </label>
  );
}
