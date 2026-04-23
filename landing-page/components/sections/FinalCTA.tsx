import Link from "next/link";
import Price from "@/components/ui/Price";

export default function FinalCTA() {
  return (
    <section className="above-bg">
      <div className="container-wide py-16 sm:py-20 md:py-24">
        <div
          className="relative overflow-hidden rounded-[28px] px-8 sm:px-14 py-16 sm:py-20"
          style={{
            background:
              "linear-gradient(130deg, #0f1316 0%, #13181c 100%)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 30%, rgba(143, 204, 42, 0.35), transparent 50%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(1.5px 1.5px at 25% 40%, rgba(255,255,255,.5), transparent 60%),
                radial-gradient(1.5px 1.5px at 70% 60%, rgba(255,255,255,.4), transparent 60%),
                radial-gradient(2px 2px at 80% 20%, rgba(255,255,255,.55), transparent 60%),
                radial-gradient(1.5px 1.5px at 15% 80%, rgba(255,255,255,.35), transparent 60%)`,
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_auto] gap-10 items-center">
            <div>
              <span className="eye">
                <span className="eye-dot" aria-hidden />
                Feed the edge
              </span>
              <h2 className="mt-5 font-display text-[42px] sm:text-[54px] font-semibold leading-[1] tracking-[-0.03em] text-ink">
                Feed the read. <span className="grad-text-2">Starve the noise.</span>
              </h2>
              <p className="mt-5 max-w-[520px] text-[15px] sm:text-[16px] leading-[1.55] text-ink-60">
                <Price variant="amount" /> once. Not <Price variant="amount" />/month. Ever.
                Own the script for life and decide every trade yourself.
              </p>
              <p className="mt-4 font-mono text-[10.5px] font-bold uppercase tracking-widest text-ink-40">
                7-day refund · Instant email delivery · Not investment advice
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-[220px]">
              <Link href="/checkout" className="btn btn-acid btn-lg justify-center">
                Reserve · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link href="/sample" className="btn btn-outline btn-lg justify-center">
                Free chapter first
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
