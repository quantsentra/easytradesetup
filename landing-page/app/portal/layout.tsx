import type { Metadata } from "next";
import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import AccountMenu from "@/components/auth/AccountMenu";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/portal",           label: "Dashboard", icon: "D" },
  { href: "/portal/downloads", label: "Downloads", icon: "↓" },
  { href: "/portal/docs",      label: "Strategies", icon: "S" },
  { href: "/portal/updates",   label: "Market notes", icon: "N" },
  { href: "/portal/support",   label: "Support", icon: "?" },
  { href: "/portal/account",   label: "Account", icon: "A" },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const email = user?.email || "";

  return (
    <div className="tz-shell">
      <div className="container-wide py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="tz-sidebar">
              <div className="tz-sidebar-brand">
                <span className="mark">E</span>
                <div>
                  <div className="name">EasyTradeSetup</div>
                  <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--tz-ink-mute)" }}>
                    Your portal
                  </div>
                </div>
              </div>

              <div className="tz-sidebar-section">
                <div className="tz-sidebar-section-title">Workspace</div>
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

              <div className="mt-5 pt-4 flex items-center justify-between gap-3"
                style={{ borderTop: "1px solid var(--tz-border)" }}>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--tz-ink-mute)" }}>
                    Signed in
                  </div>
                  <div className="text-[12px] truncate" style={{ color: "var(--tz-ink-dim)" }}>
                    {email || "—"}
                  </div>
                </div>
                <AccountMenu email={email} size={30} />
              </div>
            </div>
          </aside>

          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </div>
  );
}
