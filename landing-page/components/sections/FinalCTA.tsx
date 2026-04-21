import Link from "next/link";
import Price from "@/components/ui/Price";

export default function FinalCTA() {
  return (
    <section className="bg-page">
      <div className="container-wide py-16 sm:py-20 md:py-28 text-center">
        <h2 className="h-hero max-w-[22ch] mx-auto">
          Stop guessing. Start reading the market.
        </h2>
        <p className="mt-5 sm:mt-6 text-body-lg text-muted max-w-[52ch] mx-auto">
          The difference between losing traders and consistent ones isn&apos;t luck — it&apos;s clarity.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body font-medium hover:brightness-110 transition-all w-full sm:w-auto"
          >
            <Price variant="cta" />
          </Link>
          <Link href="/product" className="link-apple chevron">
            Explore the product
          </Link>
        </div>

        <p className="mt-5 text-caption text-muted-faint">
          One-time payment · Instant delivery · Lifetime access
        </p>
      </div>
    </section>
  );
}
