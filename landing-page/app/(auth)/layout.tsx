import Link from "next/link";
import { BrandMark } from "@/components/nav/TopNav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="border-b border-rule/40">
        <div className="container-wide flex items-center justify-between py-5">
          <Link href="https://www.easytradesetup.com" className="flex items-center gap-2.5 text-ink no-underline">
            <BrandMark size={28} />
            <span className="font-display text-[15px] font-semibold tracking-[-0.01em]">
              EasyTradeSetup
            </span>
          </Link>
          <Link
            href="https://www.easytradesetup.com"
            className="text-[12px] font-mono uppercase tracking-widest text-ink-60 hover:text-ink"
          >
            ← Back to site
          </Link>
        </div>
      </header>
      <main id="main" className="above-bg">{children}</main>
    </>
  );
}
