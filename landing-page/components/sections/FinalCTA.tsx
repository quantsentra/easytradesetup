import Link from "next/link";
import Price from "@/components/ui/Price";

export default function FinalCTA() {
  return (
    <section className="above-bg">
      <div className="container-wide py-10 sm:py-16">
        <div
          className="relative overflow-hidden rounded-[28px] px-6 sm:px-12 py-14 sm:py-16 text-center"
          style={{
            background:
              "radial-gradient(60% 80% at 0% 50%, rgba(43,123,255,.3), transparent 70%), radial-gradient(50% 80% at 100% 50%, rgba(139,92,246,.3), transparent 70%), linear-gradient(180deg, #0E1530, #080C1A)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(1px 1px at 25% 40%, rgba(255,255,255,.5), transparent),
                radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,.4), transparent),
                radial-gradient(1.5px 1.5px at 80% 20%, rgba(255,255,255,.5), transparent),
                radial-gradient(1px 1px at 15% 80%, rgba(255,255,255,.3), transparent)`,
            }}
          />

          <div className="relative">
            <div className="eye justify-center mb-4 inline-flex">
              <span className="eye-dot" aria-hidden />
              One last thing
            </div>
            <h2 className="h-section max-w-2xl mx-auto">
              Your next trade deserves a <span className="grad-text-2">cleaner chart.</span>
            </h2>
            <p className="mt-5 body-muted max-w-xl mx-auto">
              Reserve once. Own it for life. Decide every trade yourself.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
              <Link href="/checkout" className="btn btn-primary btn-lg w-full sm:w-auto">
                Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link href="/product" className="btn btn-outline btn-lg w-full sm:w-auto">
                Explore the tools
              </Link>
            </div>
            <p className="mt-6 text-nano font-mono uppercase tracking-widest text-ink-40">
              7-day refund · Instant email delivery · Not investment advice
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
