import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <section className="above-bg">
      <div className="container-wide py-32 md:py-40 text-center max-w-2xl mx-auto">
        <div className="eye justify-center inline-flex">
          <span className="eye-dot" aria-hidden />
          Order confirmed
        </div>
        <h1 className="mt-5 h-hero">
          Welcome. Check your inbox.
        </h1>
        <p className="mt-6 text-body-lg text-ink-60 leading-relaxed">
          Your Pine Script, Trade Logic PDF, and risk calculator link are on the way — arrival in under 60 seconds.
          If nothing lands, check spam, then email us.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <Link href="/docs/install" className="btn btn-primary">
            Install guide
          </Link>
          <Link href="/docs/faq" className="btn btn-outline">
            Read the FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}
