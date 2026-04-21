import Link from "next/link";
import Price from "@/components/ui/Price";

export default function FinalCTA() {
  return (
    <section className="bg-page">
      <div className="container-wide py-16 sm:py-20 md:py-28 text-center">
        <h2 className="h-hero max-w-2xl mx-auto">
          Your next trade deserves a cleaner chart.
        </h2>
        <p className="mt-4 sm:mt-5 text-body-lg text-muted max-w-xl mx-auto">
          Stop stacking indicators. Start reading the market.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-5">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body hover:brightness-110 transition-all w-full sm:w-auto"
          >
            <Price variant="cta" />
          </Link>
          <Link href="/product" className="link-apple chevron">
            Explore the tools
          </Link>
        </div>

        <p className="mt-5 text-caption text-muted-faint">
          One-time payment · Instant email delivery · Educational tool, not investment advice
        </p>
      </div>
    </section>
  );
}
