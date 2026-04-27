import "server-only";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reverses a soft-delete from /api/admin/entitlement-revoke.
// Flips active=true and clears the revoked_* audit fields so the row
// counts as live again. Hard-deleted rows can't be restored — they're
// gone.

type Body = { userId?: string };

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

  const userId = (body.userId || "").trim();
  if (!userId) return NextResponse.json({ ok: false, error: "userId required" }, { status: 400 });

  try {
    const supa = createSupabaseAdmin();

    const { data: before } = await supa
      .from("entitlements")
      .select("user_id, active")
      .eq("user_id", userId)
      .maybeSingle();
    if (!before) {
      return NextResponse.json(
        { ok: false, error: `No entitlement row for user_id "${userId}" — hard-deleted rows can't be restored` },
        { status: 404 },
      );
    }

    let mode: "full" | "minimal" = "full";
    const full = await supa
      .from("entitlements")
      .update({ active: true, revoked_at: null, revoked_by: null, revoke_reason: null })
      .eq("user_id", userId);
    if (full.error) {
      const minimal = await supa.from("entitlements").update({ active: true }).eq("user_id", userId);
      if (minimal.error) throw minimal.error;
      mode = "minimal";
    }

    return NextResponse.json({ ok: true, mode, userId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    console.error("[entitlement-restore] failed", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
