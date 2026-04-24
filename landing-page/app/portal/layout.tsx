import type { Metadata } from "next";
import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import AccountMenu from "@/components/auth/AccountMenu";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/portal",           label: "Dashboard" },
  { href: "/portal/downloads", label: "Downloads" },
  { href: "/portal/docs",      label: "Strategies" },
  { href: "/portal/updates",   label: "Market notes" },
  { href: "/portal/support",   label: "Support" },
  { href: "/portal/account",   label: "Account" },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const email = user?.email || "";

  return (
    <div className="relative min-h-screen">
      <div className="container-wide py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-card-soft p-5">
              <div className="text-nano font-mono font-bold uppercase tracking-widest text-cyan mb-4">
                Your portal
              </div>
              <nav className="flex flex-col gap-1" aria-label="Portal navigation">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 rounded-lg text-[14px] text-ink-60 hover:text-ink hover-fill transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-5 pt-5 hairline-t flex items-center justify-between gap-3">
                <span className="text-nano font-mono uppercase tracking-widest text-ink-40">
                  Signed in
                </span>
                <AccountMenu email={email} size={32} />
              </div>
            </div>
          </aside>

          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </div>
  );
}
