import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <section className="container-x py-32 md:py-40">
      <div className="max-w-2xl mx-auto text-center">
        <div className="label-kicker">Order confirmed</div>
        <h1 className="mt-4 font-display text-display-lg text-balance">
          Welcome. Check your <span className="italic text-gold">inbox.</span>
        </h1>
        <p className="mt-6 text-lg text-cream-muted text-balance leading-relaxed">
          Your Pine Script, trade logic PDF, and risk calculator link are on the way. Arrival in under 60 seconds. If
          nothing lands, check spam and then email us.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Button variant="primary" size="lg" href="/docs/install">
            Install guide
          </Button>
          <Button variant="secondary" size="lg" href="/strategy">
            Strategy library
          </Button>
        </div>
      </div>
    </section>
  );
}
