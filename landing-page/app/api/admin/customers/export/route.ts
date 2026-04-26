import "server-only";
import { NextResponse } from "next/server";
import { getUser, listAllUsers } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CSV-escape a single cell. Wraps in quotes if it contains ", comma, or
// newline; doubles internal quotes per RFC 4180.
function csvCell(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function csvRow(cells: Array<string | number | null | undefined>): string {
  return cells.map(csvCell).join(",");
}

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await listAllUsers(500);

  let entitlements: Array<{ user_id: string; active: boolean; granted_at: string; source: string }> = [];
  try {
    const supa = createSupabaseAdmin();
    const { data } = await supa.from("entitlements").select("user_id,active,granted_at,source");
    entitlements = data || [];
  } catch {
    entitlements = [];
  }
  const byUser = new Map(entitlements.map((e) => [e.user_id, e]));

  const header = csvRow([
    "user_id", "email", "name", "signed_up_at",
    "license_active", "granted_at", "source",
  ]);
  const rows = users.map((u) => {
    const ent = byUser.get(u.id);
    return csvRow([
      u.id,
      u.email || "",
      u.fullName || "",
      u.createdAt || "",
      ent?.active === true ? "yes" : "no",
      ent?.granted_at || "",
      ent?.source || "",
    ]);
  });

  // BOM prefix so Excel auto-detects UTF-8 (non-ASCII names render correctly).
  const csv = "﻿" + [header, ...rows].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ets-customers-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
