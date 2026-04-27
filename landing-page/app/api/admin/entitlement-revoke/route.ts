import "server-only";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only entitlement removal.
//
// Default mode: SOFT DELETE — flips active=false, stamps revoked_at /
// revoked_by / revoke_reason. The row stays in the table; one-click
// restore via /api/admin/entitlement-restore. Audit trail forever.
//
// Hard delete: pass `{ hard: true }` (or `?hard=1`) to permanently drop
// the row. Use only for clearly bogus data (test fixtures, accidental
// inserts) — not for "this customer requested a refund."

type Body = { userId?: string; reason?: string; hard?: boolean };

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
  const url = new URL(req.url);
  const hard = body.hard === true || url.searchParams.get("hard") === "1";
  const reason = (body.reason || "").trim().slice(0, 500) || null;

  try {
    const supa = createSupabaseAdmin();

    // Snapshot first. Resilient to pre-019 schemas (no Stripe metadata
    // columns) so the operator can still revoke on freshly-bootstrapped
    // databases.
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

    if (hard) {
      // Permanent removal. No restore path.
      const { error: delError, count } = await supa
        .from("entitlements")
        .delete({ count: "exact" })
        .eq("user_id", userId);
      if (delError) throw delError;
      return NextResponse.json({
        ok: true,
        mode: "hard",
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
    }

    // Soft delete (preferred path). Try to write the audit columns; fall
    // back to a minimal active=false update if migration 021 hasn't run.
    let mode: "soft" | "soft-minimal" = "soft";
    {
      const full = await supa
        .from("entitlements")
        .update({
          active: false,
          revoked_at: new Date().toISOString(),
          revoked_by: user.id,
          revoke_reason: reason,
        })
        .eq("user_id", userId);
      if (full.error) {
        const minimal = await supa
          .from("entitlements")
          .update({ active: false })
          .eq("user_id", userId);
        if (minimal.error) throw minimal.error;
        mode = "soft-minimal";
      }
    }

    return NextResponse.json({
      ok: true,
      mode,
      revoked: {
        userId,
        source: before.source,
        grantedAt: before.granted_at,
        sessionId: before.stripe_session_id ?? null,
        amountCents: before.amount_cents ?? null,
        currency: before.currency ?? null,
        reason,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    console.error("[entitlement-revoke] failed", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
