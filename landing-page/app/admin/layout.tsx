import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/admin";
import AccountMenu from "@/components/auth/AccountMenu";
import { BrandMark } from "@/components/nav/TopNav";
import PortalMobileNav from "@/components/nav/PortalMobileNav";
import BackToTop from "@/components/ui/BackToTop";
import { OFFER_USD, OFFER_INR } from "@/lib/pricing";

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
      { href: "/admin/updates",       label: "Updates &amp; notes", icon: NoteIcon },
      { href: "/admin/brand-kit",     label: "Brand kit",          icon: PaletteIcon },
      { href: "/admin/brand-assets",  label: "Brand assets",       icon: DownloadIcon },
    ],
  },
  {
    title: "Growth",
    items: [
      { href: "/admin/marketing",      label: "Marketing checklist", icon: MegaphoneIcon },
      { href: "/admin/seo-keywords",   label: "SEO keywords",        icon: SearchIcon    },
      { href: "/admin/content-queue",  label: "Content queue",       icon: CalendarIcon  },
      { href: "/admin/content-preview",label: "Content preview",     icon: GalleryIcon   },
      { href: "/admin/instagram",      label: "Instagram publisher", icon: InstagramIcon },
      { href: "/admin/hermes",         label: "Hermes Agent",        icon: HermesIcon    },
      { href: "/admin/analytics",      label: "Analytics",           icon: ChartIcon     },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/admin/site-health", label: "Site health", icon: HeartbeatIcon },
      { href: "/admin/releases",    label: "Releases",    icon: TagIcon },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/readiness",       label: "Launch readiness", icon: RocketIcon },
      { href: "/admin/checklist",       label: "MVP checklist",  icon: CheckIcon },
      { href: "/admin/qa",              label: "QA suite",       icon: ShieldIcon },
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

      {/* MAIN — sidebar (lg+) + content. Wider container than marketing
          pages so admin tables / iframes / charts can breathe on big
          monitors. Capped at 1600px so 27"+ screens don't get sparse. */}
      <div className="flex-1 w-full py-6 sm:py-8 mx-auto px-5 sm:px-6 md:px-8" style={{ maxWidth: 1600 }}>
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
            <span>Launch price · always {OFFER_USD === 49 ? "$49" : `$${OFFER_USD}`} / ₹{OFFER_INR.toLocaleString("en-IN")}</span>
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
function PaletteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="7.5" cy="10" r="1.2" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="10" r="1.2" fill="currentColor" />
      <path d="M12 21a3 3 0 010-6 1.5 1.5 0 001.5-1.5A1.5 1.5 0 0115 12h3" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
function MegaphoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v2a4 4 0 004 4h2v3l4-3h7V8h-7L9 5H7a4 4 0 00-4 4v2z" />
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
function RocketIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 16c-2 1-2 4-2 4s3 0 4-2" />
      <path d="M14 6l4 4-8 8H6v-4z" />
      <path d="M14 6c3-3 7-3 7-3s0 4-3 7" />
      <circle cx="15" cy="9" r="1" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-7" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.5" y2="16.5" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}
function GalleryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function HermesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l3 4h-2v6h-2V7H9z" />
      <path d="M5 13a7 7 0 0014 0" />
      <circle cx="12" cy="20" r="1.4" />
    </svg>
  );
}
function HeartbeatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12l-8 8a2 2 0 0 1-2.83 0L2 12.83V4h8.83L20 13.17a2 2 0 0 1 0 2.83z" transform="translate(0 -1)" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}
