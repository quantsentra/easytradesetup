import type { Metadata } from "next";
import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import AccountMenu from "@/components/auth/AccountMenu";
import { BrandMark } from "@/components/nav/TopNav";
import PortalMobileNav from "@/components/nav/PortalMobileNav";
import BackToTop from "@/components/ui/BackToTop";
import { LAUNCH_END_DATE_LABEL } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/portal",           label: "Dashboard",   icon: HomeIcon },
  { href: "/portal/downloads", label: "Indicator",   icon: DownloadIcon },
  { href: "/portal/docs",      label: "Strategies",  icon: BookIcon },
  { href: "/portal/updates",   label: "Market notes", icon: NoteIcon },
  { href: "/portal/support",   label: "Support",     icon: ChatIcon },
  { href: "/portal/account",   label: "Account",     icon: UserIcon },
];

const mobileNavItems = navItems.map(({ href, label }) => ({ href, label }));

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const email = user?.email || "";
  const admin = await isAdmin(user?.id);

  return (
    <div className="tz-shell min-h-screen flex flex-col">
      {/* TOP HEADER */}
      <header className="tz-header">
        <div className="tz-header-inner">
          <Link href="/portal" className="tz-header-brand">
            <BrandMark size={28} />
            <span className="tz-header-name">EasyTradeSetup</span>
            <span className="tz-header-badge hidden sm:inline-flex">Portal</span>
          </Link>

          <div className="tz-header-spacer" />

          <Link href="/portal/updates" className="tz-header-link hidden md:inline-flex">
            <span className="tz-header-link-dot" aria-hidden />
            Today&apos;s notes
          </Link>

          {admin && (
            <Link href="/admin" className="tz-header-link hidden lg:inline-flex">
              Admin
            </Link>
          )}

          <a
            href="https://www.easytradesetup.com"
            target="_blank"
            rel="noopener"
            className="tz-header-link hidden sm:inline-flex"
          >
            ↗ Site
          </a>

          <AccountMenu email={email} size={32} />

          <PortalMobileNav items={mobileNavItems} isAdmin={admin} />
        </div>
      </header>

      {/* MAIN — sidebar (lg+) + content */}
      <div className="container-wide flex-1 w-full py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
          <aside className="hidden lg:block lg:sticky lg:top-[84px] lg:self-start">
            <nav className="tz-sidenav">
              <div className="tz-sidenav-section-title">Workspace</div>
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
              EasyTradeSetup · Golden Indicator <strong>v2.4</strong>
            </span>
          </div>
          <div className="tz-footer-right">
            <span>Inaugural offer · ends {LAUNCH_END_DATE_LABEL}</span>
            <span className="tz-footer-dot" aria-hidden>·</span>
            <Link href="/portal/support" className="tz-footer-link">Support</Link>
            <span className="tz-footer-dot" aria-hidden>·</span>
            <a href="https://www.easytradesetup.com/legal/terms" className="tz-footer-link">Terms</a>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}

/* ---- Inline SVG icons (no extra deps) ---- */
function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8M5 10v10h14V10" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5zM4 19h14" />
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
function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v11H8l-4 4z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" />
    </svg>
  );
}
