import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import AccountMenu from "@/components/auth/AccountMenu";
import { BrandMark } from "@/components/nav/TopNav";
import PortalMobileNav from "@/components/nav/PortalMobileNav";
import BackToTop from "@/components/ui/BackToTop";
import { LAUNCH_END_DATE_LABEL } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin",           label: "Overview",     icon: HomeIcon },
  { href: "/admin/customers", label: "Customers",    icon: UsersIcon },
  { href: "/admin/tickets",   label: "Tickets",      icon: ChatIcon },
  { href: "/admin/updates",   label: "Market notes", icon: NoteIcon },
  { href: "/admin/audit",     label: "Audit log",    icon: AuditIcon },
];

const mobileNavItems = navItems.map(({ href, label }) => ({ href, label }));

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const admin = await isAdmin(user?.id);
  if (!admin) notFound();

  const email = user?.email || "";

  return (
    <div className="tz-shell min-h-screen flex flex-col">
      {/* TOP HEADER */}
      <header className="tz-header">
        <div className="tz-header-inner">
          <Link href="/admin" className="tz-header-brand">
            <BrandMark size={28} />
            <span className="tz-header-name">EasyTradeSetup</span>
            <span className="tz-header-badge hidden sm:inline-flex">Admin</span>
          </Link>

          <div className="tz-header-spacer" />

          <Link href="/portal" className="tz-header-link hidden md:inline-flex">
            ↗ Portal
          </Link>

          <a
            href="https://www.easytradesetup.com"
            target="_blank"
            rel="noopener"
            className="tz-header-link hidden sm:inline-flex"
          >
            ↗ Site
          </a>

          <AccountMenu email={email} size={32} />

          <PortalMobileNav items={mobileNavItems} isAdmin />
        </div>
      </header>

      {/* MAIN — sidebar (lg+) + content */}
      <div className="container-wide flex-1 w-full py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
          <aside className="hidden lg:block lg:sticky lg:top-[84px] lg:self-start">
            <nav className="tz-sidenav">
              <div className="tz-sidenav-section-title">Operations</div>
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="tz-sidenav-item">
                  <span className="tz-sidenav-icon" aria-hidden><Icon /></span>
                  {label}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="min-w-0">{children}</section>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="tz-footer">
        <div className="container-wide tz-footer-inner">
          <div className="tz-footer-left">
            <BrandMark size={20} />
            <span>
              EasyTradeSetup · Admin console
            </span>
          </div>
          <div className="tz-footer-right">
            <span>Inaugural offer · ends {LAUNCH_END_DATE_LABEL}</span>
            <span className="tz-footer-dot" aria-hidden>·</span>
            <Link href="/portal" className="tz-footer-link">Portal</Link>
            <span className="tz-footer-dot" aria-hidden>·</span>
            <a href="https://www.easytradesetup.com/legal/terms" className="tz-footer-link">Terms</a>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}

/* ---- Inline SVG icons ---- */
function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8M5 10v10h14V10" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" /><path d="M2 21a7 7 0 0114 0" />
      <circle cx="17" cy="9" r="2.5" /><path d="M15 14h2a5 5 0 015 5" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v11H8l-4 4z" />
    </svg>
  );
}
function NoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11l3 3v13H5z" /><path d="M9 10h7M9 14h7M9 18h4" />
    </svg>
  );
}
function AuditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}
