import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import AccountMenu from "@/components/auth/AccountMenu";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin",           label: "Overview",     icon: "□" },
  { href: "/admin/customers", label: "Customers",    icon: "C" },
  { href: "/admin/tickets",   label: "Tickets",      icon: "T" },
  { href: "/admin/updates",   label: "Market notes", icon: "N" },
  { href: "/admin/audit",     label: "Audit log",    icon: "A" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const admin = await isAdmin(user?.id);
  if (!admin) notFound();

  return (
    <div className="tz-shell">
      <div className="container-wide py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="tz-sidebar">
              <div className="tz-sidebar-brand">
                <span className="mark" style={{
                  background: "linear-gradient(135deg, #15181a, #2d3236)",
                }}>A</span>
                <div>
                  <div className="name">Admin console</div>
                  <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--tz-ink-mute)" }}>
                    Founder access
                  </div>
                </div>
              </div>

              <div className="tz-sidebar-section">
                <div className="tz-sidebar-section-title">Operations</div>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="tz-navitem">
                    <span
                      style={{
                        width: 20, height: 20, borderRadius: 5,
                        display: "grid", placeItems: "center",
                        background: "var(--tz-surface-3)",
                        color: "var(--tz-ink-mute)",
                        font: "600 10px var(--tz-mono)",
                      }}
                      aria-hidden
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="tz-sidebar-section">
                <div className="tz-sidebar-section-title">Shortcuts</div>
                <Link href="/portal" className="tz-navitem">
                  <span
                    style={{
                      width: 20, height: 20, borderRadius: 5,
                      display: "grid", placeItems: "center",
                      background: "rgba(107,159,30,0.12)",
                      color: "var(--tz-acid-dim)",
                      font: "600 10px var(--tz-mono)",
                    }}
                    aria-hidden
                  >
                    ↗
                  </span>
                  Customer portal
                </Link>
              </div>

              <div className="mt-5 pt-4 flex items-center justify-between gap-3"
                style={{ borderTop: "1px solid var(--tz-border)" }}>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
                    Admin
                  </div>
                  <div className="text-[12px] truncate" style={{ color: "var(--tz-ink-dim)" }}>
                    {user?.email || "—"}
                  </div>
                </div>
                <AccountMenu email={user?.email || "admin"} size={30} />
              </div>
            </div>
          </aside>

          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </div>
  );
}
