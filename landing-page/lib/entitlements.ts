import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export type Entitlement = {
  user_id: string;        // Clerk user ID
  product: string;        // e.g. "golden-indicator"
  active: boolean;
  granted_at: string;     // ISO
  revoked_at: string | null;
  source: "stripe" | "razorpay" | "manual" | "refund";
};

const DEFAULT_PRODUCT = "golden-indicator";

/**
 * Look up the current user's entitlement for a product. Returns null when
 * the user has no row, or when the entitlement is inactive.
 *
 * Runs with service-role privileges — only ever call this from a Server
 * Component, Route Handler, or Server Action.
 */
export async function getEntitlement(
  userId: string | null | undefined,
  product: string = DEFAULT_PRODUCT,
): Promise<Entitlement | null> {
  if (!userId) return null;
  try {
    const supa = createSupabaseAdmin();
    const { data, error } = await supa
      .from("entitlements")
      .select("*")
      .eq("user_id", userId)
      .eq("product", product)
      .eq("active", true)
      .maybeSingle();
    if (error || !data) return null;
    return data as Entitlement;
  } catch {
    // Env not configured yet — gracefully degrade to "no entitlement".
    // Portal still renders; tiles show locked state.
    return null;
  }
}

/**
 * Grant a lifetime entitlement. Idempotent — if the row exists we flip
 * `active` back on and clear `revoked_at`. Only payment webhooks + the
 * manual admin console should call this.
 */
export async function grantEntitlement(
  userId: string,
  source: Entitlement["source"],
  product: string = DEFAULT_PRODUCT,
): Promise<void> {
  const supa = createSupabaseAdmin();
  await supa
    .from("entitlements")
    .upsert(
      {
        user_id: userId,
        product,
        active: true,
        granted_at: new Date().toISOString(),
        revoked_at: null,
        source,
      },
      { onConflict: "user_id,product" },
    );
}

/**
 * Revoke access — used on refund webhooks or admin action. We set
 * `active = false` rather than deleting so we keep the audit trail.
 */
export async function revokeEntitlement(
  userId: string,
  product: string = DEFAULT_PRODUCT,
): Promise<void> {
  const supa = createSupabaseAdmin();
  await supa
    .from("entitlements")
    .update({
      active: false,
      revoked_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("product", product);
}
