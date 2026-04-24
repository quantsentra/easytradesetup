import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export type AuditAction =
  | "update.publish"
  | "ticket.reply"
  | "ticket.status.change"
  | "customer.view"
  | "customers.view";

export type AuditEntry = {
  actorId: string;
  action: AuditAction;
  targetKind?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Append a row to the admin audit log. Fire-and-forget: audit failures
 * should never break the action they're recording. Errors go to the
 * server console, not the user.
 */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    const supa = createSupabaseAdmin();
    await supa.from("admin_audit_log").insert({
      actor_id: entry.actorId,
      action: entry.action,
      target_kind: entry.targetKind || null,
      target_id: entry.targetId || null,
      metadata: entry.metadata || {},
    });
  } catch (err) {
    console.error("[audit] insert failed", { action: entry.action, err });
  }
}

export type AuditRow = {
  id: number;
  at: string;
  actor_id: string;
  action: string;
  target_kind: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
};

export async function listAuditLog(limit = 100): Promise<AuditRow[]> {
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa
      .from("admin_audit_log")
      .select("*")
      .order("at", { ascending: false })
      .limit(limit);
    return (data || []) as AuditRow[];
  } catch {
    return [];
  }
}
