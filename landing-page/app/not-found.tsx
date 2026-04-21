import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x py-32 md:py-40">
      <div className="max-w-xl mx-auto text-center">
        <div className="font-display text-[120px] leading-none text-gold/50">404</div>
        <h1 className="mt-6 font-display text-display-md">
          This chart has no data.
        </h1>
        <p className="mt-4 text-cream-muted">
          The page you&apos;re looking for doesn&apos;t exist, or has been moved.
        </p>
        <div className="mt-8">
          <Button variant="primary" size="md" href="/">
            ← Back home
          </Button>
        </div>
      </div>
    </section>
  );
}
