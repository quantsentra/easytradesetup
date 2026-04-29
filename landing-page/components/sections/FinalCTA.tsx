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
                Trade from structure
              </span>
              <h2 className="mt-5 font-display text-[42px] sm:text-[54px] font-semibold leading-[1] tracking-[-0.03em]" style={{ color: "#EDF1FA" }}>
                Trade from structure, <span className="grad-text-2">not confusion.</span>
              </h2>
              <p className="mt-5 max-w-[520px] text-[15px] sm:text-[16px] leading-[1.55]" style={{ color: "rgba(237, 241, 250, 0.72)" }}>
                If your chart feels overloaded, your entries feel emotional, or your decisions
                change from trade to trade, Golden Indicator gives you a cleaner way to read the
                market. One indicator. One process. <Price variant="amount" /> once. Not{" "}
                <Price variant="amount" />/month. Ever.
              </p>
              <p className="mt-4 font-mono text-[10.5px] font-bold uppercase tracking-widest" style={{ color: "rgba(237, 241, 250, 0.5)" }}>
                Instant access · Lifetime updates · Support, 24h reply · Educational, not investment advice
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-[220px]">
              <Link href="/checkout" className="btn btn-primary btn-lg justify-center">
                Get Golden Indicator · <Price variant="amount" /> <span className="arrow" aria-hidden>→</span>
              </Link>
              <Link
                href="/sample"
                className="btn btn-lg justify-center"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.18)",
                  color: "#EDF1FA",
                  background: "transparent",
                }}
              >
                Read free sample
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
