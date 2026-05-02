"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

// Server actions for marketing_tasks. Mirrors the mvp_tasks action
// shape (app/admin/checklist/actions.ts) so TaskCheckbox can dispatch
// to either set via the `kind` prop without further branching.

export async function toggleMarketingTask(
  slug: string,
  done: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  if (!(await isAdmin(user.id))) return { ok: false, error: "Forbidden" };

  try {
    const supa = createSupabaseAdmin();
    const { error } = await supa
      .from("marketing_tasks")
      .update({
        done,
        done_at: done ? new Date().toISOString() : null,
        done_by: done ? user.email || user.id : null,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/marketing");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function setMarketingTaskNote(
  slug: string,
  note: string,
): Promise<{ ok: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  if (!(await isAdmin(user.id))) return { ok: false, error: "Forbidden" };

  try {
    const supa = createSupabaseAdmin();
    const { error } = await supa
      .from("marketing_tasks")
      .update({ note: note.slice(0, 2000), updated_at: new Date().toISOString() })
      .eq("slug", slug);

    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/marketing");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
