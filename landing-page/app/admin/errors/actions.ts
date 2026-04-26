"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { updateIssue } from "@/lib/sentry-client";

export async function resolveIssue(issueId: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  if (!(await isAdmin(user.id))) return { ok: false, error: "Forbidden" };

  const ok = await updateIssue(issueId, "resolved");
  if (!ok) return { ok: false, error: "Sentry rejected the call (token needs event:write scope)" };

  revalidatePath("/admin/errors");
  revalidatePath(`/admin/errors/${issueId}`);
  return { ok: true };
}

export async function ignoreIssue(issueId: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  if (!(await isAdmin(user.id))) return { ok: false, error: "Forbidden" };

  const ok = await updateIssue(issueId, "ignored");
  if (!ok) return { ok: false, error: "Sentry rejected the call (token needs event:write scope)" };

  revalidatePath("/admin/errors");
  revalidatePath(`/admin/errors/${issueId}`);
  return { ok: true };
}
