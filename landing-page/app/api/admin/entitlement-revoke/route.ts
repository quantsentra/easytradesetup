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

    // Snapshot the row before delete. Migration 019 added stripe_session_id /
    // amount_cents / currency — fall back to minimal projection if those
    // columns don't exist yet, so revoke still works on pre-019 schemas.
    type EntSnap = {
      user_id: string;
      active: boolean;
      granted_at: string;
      source: string;
      amount_cents?: number | null;
      currency?: string | null;
      stripe_session_id?: string | null;
    };
    let before: EntSnap | null = null;
    {
      const full = await supa
        .from("entitlements")
        .select("user_id, active, granted_at, source, amount_cents, currency, stripe_session_id")
        .eq("user_id", userId)
        .maybeSingle();
      if (full.error) {
        // Most likely cause: migration 019 not applied. Retry with the
        // pre-019 column set so the operator can still revoke.
        const minimal = await supa
          .from("entitlements")
          .select("user_id, active, granted_at, source")
          .eq("user_id", userId)
          .maybeSingle();
        if (minimal.error) throw minimal.error;
        before = (minimal.data as EntSnap) || null;
      } else {
        before = (full.data as EntSnap) || null;
      }
    }

    if (!before) {
      return NextResponse.json({ ok: false, error: `No entitlement row for user_id "${userId}"` }, { status: 404 });
    }

    const { error: delError, count } = await supa
      .from("entitlements")
      .delete({ count: "exact" })
      .eq("user_id", userId);
    if (delError) throw delError;

    return NextResponse.json({
      ok: true,
      deletedCount: count ?? 0,
      revoked: {
        userId,
        source: before.source,
        grantedAt: before.granted_at,
        sessionId: before.stripe_session_id ?? null,
        amountCents: before.amount_cents ?? null,
        currency: before.currency ?? null,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    console.error("[entitlement-revoke] failed", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
