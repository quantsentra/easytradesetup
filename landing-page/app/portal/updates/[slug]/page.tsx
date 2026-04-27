import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUser } from "@/lib/auth-server";
import { getEntitlement } from "@/lib/entitlements";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import Prose from "@/components/ui/Prose";

type Update = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string;
  body_mdx: string;
  draft: boolean;
};

async function fetchUpdate(slug: string): Promise<Update | null> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("updates")
      .select("id,title,slug,published_at,excerpt,body_mdx,draft")
      .eq("slug", slug)
      .eq("draft", false)
      .maybeSingle();
    return (data as Update) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const update = await fetchUpdate(slug);
  if (!update) return { title: "Market note" };
  return {
    title: `${update.title} — Market notes`,
    robots: { index: false, follow: false },
  };
}

// Phase-1 renderer: treat body_mdx as markdown-lite. Paragraphs split on blank
// lines. `## ` headings and `- ` list items are recognised. Anything fancier
// waits for phase-2 (Fumadocs swap-in).
function renderBody(body: string) {
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return <h2 key={i}>{block.slice(3)}</h2>;
    }
    if (block.startsWith("### ")) {
      return <h3 key={i}>{block.slice(4)}</h3>;
    }
    if (block.split("\n").every((line) => line.trim().startsWith("- "))) {
      return (
        <ul key={i}>
          {block.split("\n").map((line, j) => (
            <li key={j}>{line.replace(/^-\s+/, "")}</li>
          ))}
        </ul>
      );
    }
    return <p key={i}>{block}</p>;
  });
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getUser();
  const entitlement = await getEntitlement(user?.id);
  const active = entitlement?.active === true;

  if (!active) {
    return (
      <>
        <div className="tz-topbar">
          <div>
            <h1 className="tz-topbar-title">Market notes.</h1>
            <div className="tz-topbar-sub">Customer-only.</div>
          </div>
        </div>
        <div className="tz-card">
          <p className="text-[15px]" style={{ color: "var(--tz-ink-dim)" }}>
            Market notes are published inside the portal for active customers. Buy at the launch
            price to unlock.
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

  const update = await fetchUpdate(slug);
  if (!update) notFound();

  return (
    <>
      <Link
        href="/portal/updates"
        className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-widest mb-4"
        style={{ color: "var(--tz-ink-mute)" }}
      >
        ← All notes
      </Link>

      <div className="tz-topbar">
        <div>
          <span className="tz-chip">
            <span className="tz-chip-dot" style={{ background: "var(--tz-acid)" }} />
            Market note ·{" "}
            <time>{new Date(update.published_at).toISOString().slice(0, 10)}</time>
          </span>
          <h1 className="tz-topbar-title mt-3">{update.title}</h1>
          {update.excerpt && (
            <div className="tz-topbar-sub max-w-[640px]">{update.excerpt}</div>
          )}
        </div>
      </div>

      <div className="tz-card" style={{ padding: "32px 40px" }}>
        <Prose>{renderBody(update.body_mdx || "")}</Prose>
      </div>

      <div className="mt-10 pt-6 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--tz-border)" }}>
        <Link
          href="/portal/updates"
          className="text-[13px]"
          style={{ color: "var(--tz-ink-mute)" }}
        >
          ← Back to notes
        </Link>
        <span className="font-mono text-[10.5px] uppercase tracking-widest"
          style={{ color: "var(--tz-ink-mute)" }}>
          Educational · not investment advice
        </span>
      </div>
    </>
  );
}
