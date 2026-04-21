import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="container-x py-24 md:py-32">
      <div className="relative text-center max-w-3xl mx-auto">
        <h2 className="font-display text-display-lg text-balance">
          Your next trade deserves a <span className="italic text-gold">cleaner</span> chart.
        </h2>
        <p className="mt-6 text-lg text-cream-muted text-balance">
          Stop stacking indicators. Start reading the market.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Button variant="gold" size="lg" href="/checkout">
            Get Golden Indicator — ₹2,499
          </Button>
        </div>
      </div>
    </section>
  );
}
