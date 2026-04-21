import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-page">
      <div className="container-wide py-20 md:py-28 text-center">
        <h2 className="h-hero max-w-2xl mx-auto">
          Your next trade deserves a cleaner chart.
        </h2>
        <p className="mt-5 text-body-lg text-muted max-w-xl mx-auto">
          Stop stacking indicators. Start reading the market.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
          <Link href="/checkout" className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body">
            Buy ₹2,499
          </Link>
          <Link href="/product" className="link-apple chevron">
            Explore the tools
          </Link>
        </div>
      </div>
    </section>
  );
}
