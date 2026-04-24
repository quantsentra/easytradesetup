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
      <div className="glass-card p-8">
        <h1 className="h-tile">Customer-only</h1>
        <p className="mt-3 text-[15px] text-ink-60">
          Market notes are published inside the portal for active customers. Reserve the launch price to
          unlock.
        </p>
        <Link href="/checkout" className="btn btn-acid mt-6">
          Reserve · lifetime access →
        </Link>
      </div>
    );
  }

  const update = await fetchUpdate(slug);
  if (!update) notFound();

  return (
    <>
      <div className="mb-6">
        <Link
          href="/portal/updates"
          className="font-mono text-[11px] uppercase tracking-widest text-ink-40 hover:text-cyan"
        >
          ← All notes
        </Link>
      </div>
      <span className="eye">
        <span className="eye-dot" aria-hidden />
        Market note ·{" "}
        <time>{new Date(update.published_at).toISOString().slice(0, 10)}</time>
      </span>
      <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-ink">
        {update.title}
      </h1>
      {update.excerpt && (
        <p className="mt-3 text-[15px] text-ink-60 max-w-[640px]">{update.excerpt}</p>
      )}
      <div className="mt-10">
        <Prose>{renderBody(update.body_mdx || "")}</Prose>
      </div>
      <div className="mt-16 pt-8 hairline-t flex items-center justify-between">
        <Link
          href="/portal/updates"
          className="text-[13px] text-ink-60 hover:text-cyan transition-colors"
        >
          ← Back to notes
        </Link>
        <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40">
          Educational · not investment advice
        </span>
      </div>
    </>
  );
}
