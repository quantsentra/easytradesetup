import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="border-b border-rule/40">
        <div className="container-wide flex items-center justify-between py-5">
          <Link href="https://www.easytradesetup.com" className="flex items-center gap-2 text-ink no-underline">
            <span
              aria-hidden
              className="grid place-items-center h-7 w-7 rounded-md font-mono text-[12px] font-bold"
              style={{
                background: "linear-gradient(135deg, #6b9f1e 0%, #4f7d10 100%)",
                color: "#fff",
              }}
            >
              E
            </span>
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
