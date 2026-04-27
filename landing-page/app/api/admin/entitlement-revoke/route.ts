import "server-only";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only entitlement removal. Hard-deletes the entitlements row for
// the given user_id. Used for cleaning up test/manual orders that should
// not count against revenue or appear in the customer list.
//
// Destructive — gated by admin role + explicit user_id in body.

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
  if (!userId) {
    return NextResponse.json({ ok: false, error: "userId required" }, { status: 400 });
  }

  try {
    const supa = createSupabaseAdmin();

    // Snapshot the row before delete so the response can confirm what was
    // removed (admin sees source/granted_at to verify they revoked the
    // right one).
    const { data: before } = await supa
      .from("entitlements")
      .select("user_id, active, granted_at, source, amount_cents, currency, stripe_session_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!before) {
      return NextResponse.json({ ok: false, error: "No entitlement found for that user" }, { status: 404 });
    }

    const { error } = await supa.from("entitlements").delete().eq("user_id", userId);
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      revoked: {
        userId,
        source: before.source,
        grantedAt: before.granted_at,
        sessionId: before.stripe_session_id,
        amountCents: before.amount_cents,
        currency: before.currency,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
