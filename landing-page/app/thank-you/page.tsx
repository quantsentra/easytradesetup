import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <section className="bg-page">
      <div className="container-wide py-32 md:py-40 text-center max-w-2xl mx-auto">
        <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">
          Order confirmed
        </div>
        <h1 className="mt-4 h-hero">
          Welcome. Check your inbox.
        </h1>
        <p className="mt-5 text-body-lg text-muted">
          Your Pine Script, trade logic PDF, and risk calculator link are on the way. Arrival in under 60 seconds. If
          nothing lands, check spam and then email us.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-5">
          <Link href="/docs/install" className="inline-flex items-center justify-center rounded-lg bg-blue text-white px-6 py-3 text-body">
            Install guide
          </Link>
          <Link href="/strategy" className="link-apple chevron">
            Strategy library
          </Link>
        </div>
      </div>
    </section>
  );
}
