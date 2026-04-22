import Link from "next/link";

export default function FounderNote() {
  return (
    <section className="bg-surface">
      <div className="container-x py-16 sm:py-20 md:py-24">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-micro font-semibold text-blue-link uppercase tracking-wider m-0">
            A note from the founder
          </h2>
          <blockquote className="mt-5 text-[22px] sm:text-[26px] leading-[1.35] tracking-tight text-ink font-display font-normal">
            &ldquo;I built Golden Indicator because the chart tools I could buy
            were either cluttered, confused, or disguised sales pitches. I
            wanted one clean signal engine I would actually trust on my own
            capital. That&apos;s what this is.&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <div
              aria-hidden
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#0071e3] to-[#2997ff] flex items-center justify-center flex-shrink-0 shadow-soft"
            >
              <span className="text-caption font-bold text-white">TS</span>
            </div>
            <div className="min-w-0">
              <div className="text-body text-ink font-medium">Founder, EasyTradeSetup</div>
              <div className="text-caption text-muted-faint">
                TradingView user since 2017 · Based in India · Global markets focus
              </div>
            </div>
          </div>

          <p className="mt-8 text-caption text-muted leading-relaxed">
            Have a question before you reserve? Write to{" "}
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
