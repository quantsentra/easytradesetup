import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const admin = await isAdmin(userId);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const slug = String(form.get("slug") || "").trim().toLowerCase();
  const excerpt = String(form.get("excerpt") || "").trim();
  const body_mdx = String(form.get("body_mdx") || "");
  const draft = form.get("draft") === "1";

  if (!title || title.length > 140) {
    return NextResponse.json({ error: "Title required, max 140 chars" }, { status: 400 });
  }
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Slug: lowercase letters, digits, hyphens only" }, { status: 400 });
  }
  if (!body_mdx.trim()) {
    return NextResponse.json({ error: "Body required" }, { status: 400 });
  }

  const supa = createSupabaseAdmin();
  const { error } = await supa.from("updates").insert({
    title,
    slug,
    excerpt,
    body_mdx,
    draft,
    created_by: userId,
    published_at: new Date().toISOString(),
  });

  if (error) {
    const msg = /duplicate|unique/i.test(error.message)
      ? `Slug "${slug}" already exists`
      : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/admin/updates", req.url), 303);
}
