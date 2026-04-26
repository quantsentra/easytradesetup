"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function toggleTask(slug: string, done: boolean): Promise<{ ok: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  if (!(await isAdmin(user.id))) return { ok: false, error: "Forbidden" };

  try {
    const supa = createSupabaseAdmin();
    const { error } = await supa
      .from("mvp_tasks")
      .update({
        done,
        done_at: done ? new Date().toISOString() : null,
        done_by: done ? (user.email || user.id) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/checklist");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function setTaskNote(slug: string, note: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  if (!(await isAdmin(user.id))) return { ok: false, error: "Forbidden" };

  try {
    const supa = createSupabaseAdmin();
    const { error } = await supa
      .from("mvp_tasks")
      .update({ note: note.slice(0, 2000), updated_at: new Date().toISOString() })
      .eq("slug", slug);

    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/checklist");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
