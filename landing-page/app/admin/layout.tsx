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

// Sidebar grouped into sections so new menu items slot cleanly without
// reshuffling the existing IA. To add an item: append to its section.
// To add a section: push a new object to navSections.
const navSections: Array<{
  title: string;
  items: Array<{ href: string; label: string; icon: () => React.JSX.Element }>;
}> = [
  {
    title: "Operations",
    items: [
      { href: "/admin",           label: "Overview",  icon: HomeIcon },
      { href: "/admin/customers", label: "Customers", icon: UsersIcon },
      { href: "/admin/tickets",   label: "Tickets",   icon: ChatIcon },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/updates", label: "Market notes", icon: NoteIcon },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/checklist",       label: "MVP checklist",  icon: CheckIcon },
      { href: "/admin/errors",          label: "Errors",         icon: AlertIcon },
      { href: "/admin/stripe-recover",  label: "Stripe recovery", icon: CardIcon },
      { href: "/admin/architecture",    label: "Architecture",   icon: MapIcon },
      { href: "/admin/audit",           label: "Audit log",      icon: AuditIcon },
    ],
  },
];

const mobileNavItems = navSections.flatMap((s) => s.items).map(({ href, label }) => ({ href, label }));

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
              {navSections.map((section, idx) => (
                <div key={section.title} style={{ marginTop: idx === 0 ? 0 : 14 }}>
                  <div className="tz-sidenav-section-title">{section.title}</div>
                  {section.items.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} className="tz-sidenav-item">
                      <span className="tz-sidenav-icon" aria-hidden><Icon /></span>
                      {label}
                    </Link>
                  ))}
                </div>
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
function MapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v16M15 6v16" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <line x1="2" y1="11" x2="22" y2="11" />
    </svg>
  );
}
