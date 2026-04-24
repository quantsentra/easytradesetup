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
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Admin · market notes
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        Publish a note.
      </h1>
      <p className="mt-3 text-[15px] text-ink-60 max-w-[640px]">
        Pre-market bias drops. Goes live the moment you save — unless you tick <em>draft</em>.
      </p>

      <form
        action="/api/admin/updates"
        method="POST"
        className="mt-10 glass-card-soft p-6 flex flex-col gap-4"
      >
        <Field label="Title">
          <input
            name="title"
            required
            maxLength={140}
            placeholder="NIFTY — pre-market plan · 2026-04-25"
            className="input"
          />
        </Field>
        <Field label="Slug" hint="URL fragment. Lowercase, hyphens. Must be unique.">
          <input
            name="slug"
            required
            maxLength={80}
            pattern="[a-z0-9\-]+"
            placeholder="nifty-2026-04-25"
            className="input font-mono"
          />
        </Field>
        <Field label="Excerpt" hint="One-line teaser shown on the list page.">
          <input
            name="excerpt"
            maxLength={220}
            placeholder="Global risk-on overnight. NIFTY gap-up likely, expect early pullback to ORB low."
            className="input"
          />
        </Field>
        <Field label="Body" hint="Markdown-lite. Blank line between paragraphs. `## heading` and `- list` supported.">
          <textarea
            name="body_mdx"
            required
            rows={12}
            placeholder={"## Global bias\n\nSPX closed up 0.8%. DXY flat.\n\n## India session plan\n\n- PDH: 22,480\n- PDL: 22,340\n- Long above PDH with 50% size"}
            className="input font-mono text-[13px]"
          />
        </Field>
        <label className="flex items-center gap-2 text-[14px] text-ink-60">
          <input type="checkbox" name="draft" value="1" className="w-4 h-4" />
          Save as draft (do not publish)
        </label>
        <div>
          <button type="submit" className="btn btn-primary">
            Save note →
          </button>
        </div>
      </form>

      <h2 className="mt-16 h-card">Recent notes</h2>
      <div className="mt-5 flex flex-col gap-3">
        {updates.length === 0 ? (
          <div className="glass-card-soft p-6 text-[14px] text-ink-60">
            Nothing published yet.
          </div>
        ) : (
          updates.map((u) => (
            <div
              key={u.id}
              className="feat-card !p-5 flex flex-wrap items-center gap-3 justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-ink">{u.title}</span>
                  {u.draft && (
                    <span className="font-mono text-[9.5px] font-bold uppercase tracking-widest text-rose-400">
                      Draft
                    </span>
                  )}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-ink-40">/portal/updates/{u.slug}</div>
              </div>
              <time className="font-mono text-[11px] uppercase tracking-widest text-ink-40">
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
      <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40">{label}</span>
      {children}
      {hint && <span className="text-[12px] text-ink-60">{hint}</span>}
    </label>
  );
}
