import "server-only";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { ITEMS } from "@/lib/launch-readiness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Toggle a manual-only readiness item. Auto-detected items reject (the
// page hides the toggle UI for those, but defend the API anyway).

type Body = { slug?: string; done?: boolean; note?: string };

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  if (!(await isAdmin(user.id))) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  const slug = (body.slug || "").trim();
  if (!slug) return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });

  const item = ITEMS.find((i) => i.id === slug);
  if (!item) return NextResponse.json({ ok: false, error: "Unknown slug" }, { status: 404 });
  if (item.auto) {
    return NextResponse.json(
      { ok: false, error: "Item is auto-detected; status comes from environment / DB" },
      { status: 400 },
    );
  }

  const note = (body.note || "").trim().slice(0, 500) || null;
  const done = body.done !== false;

  try {
    const supa = createSupabaseAdmin();
    if (done) {
      const { error } = await supa
        .from("launch_readiness_acks")
        .upsert({
          slug,
          acked_at: new Date().toISOString(),
          acked_by: user.id,
          note,
        });
      if (error) throw error;
      return NextResponse.json({ ok: true, slug, acked: true });
    } else {
      const { error } = await supa.from("launch_readiness_acks").delete().eq("slug", slug);
      if (error) throw error;
      return NextResponse.json({ ok: true, slug, acked: false });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
