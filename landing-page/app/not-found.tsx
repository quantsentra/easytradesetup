import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-page">
      <div className="container-wide py-32 md:py-40 text-center max-w-xl mx-auto">
        <div className="font-display font-semibold text-[96px] leading-none text-ink">404</div>
        <h1 className="mt-6 h-tile">This chart has no data.</h1>
        <p className="mt-4 text-body text-muted">
          The page you&apos;re looking for doesn&apos;t exist, or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/" className="link-apple chevron">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
