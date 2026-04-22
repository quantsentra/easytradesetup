import Link from "next/link";

export default function FounderNote() {
  return (
    <section className="above-bg">
      <div className="container-x py-16 sm:py-20 md:py-24">
        <div className="max-w-[760px] mx-auto glass-card p-8 sm:p-12">
          <h2 className="eye m-0">
            <span className="eye-dot" aria-hidden />
            A note from the founder
          </h2>
          <blockquote className="mt-6 text-[22px] sm:text-[26px] leading-[1.4] tracking-tight text-ink">
            &ldquo;I built Golden Indicator because every chart tool I could buy was
            either cluttered, confused, or a disguised sales pitch. I wanted{" "}
            <span className="grad-text-2">one clean signal engine</span> I would
            actually trust on my own capital. That&apos;s what this is.&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <div
              aria-hidden
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full grid place-items-center flex-shrink-0 shadow-soft"
              style={{
                background: "linear-gradient(135deg, #2B7BFF, #22D3EE)",
                boxShadow: "0 0 0 1px rgba(255,255,255,.12), 0 8px 24px -6px rgba(43,123,255,.5)",
              }}
            >
              <span className="font-display font-bold text-body text-white">TS</span>
            </div>
            <div className="min-w-0">
              <div className="text-body text-ink font-semibold">Founder, EasyTradeSetup</div>
              <div className="text-caption text-ink-40">
                TradingView user since 2017 · Based in India · Global markets focus
              </div>
            </div>
          </div>

          <p className="mt-8 text-caption text-ink-60 leading-relaxed">
            Questions before you reserve? Write to{" "}
            <a href="mailto:hello@easytradesetup.com" className="link-apple">
              hello@easytradesetup.com
            </a>
            {" "}— replies come from the same person who built the script.{" "}
            <Link href="/about" className="link-apple chevron">
              More about EasyTradeSetup
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
