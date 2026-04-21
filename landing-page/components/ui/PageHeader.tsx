import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "page" | "white";
};

export default function PageHeader({ eyebrow, title, lede, tone = "page" }: Props) {
  const bg = tone === "page" ? "bg-page" : "bg-surface";
  return (
    <section className={`${bg} hairline-b`}>
      <div className="container-wide pt-20 md:pt-28 pb-14 md:pb-20 text-center">
        {eyebrow && (
          <div className="text-micro font-semibold text-blue-link uppercase tracking-wider mb-5">
            {eyebrow}
          </div>
        )}
        <h1 className="h-hero max-w-3xl mx-auto">{title}</h1>
        {lede && (
          <p className="mt-6 text-body-lg text-muted max-w-2xl mx-auto">{lede}</p>
        )}
      </div>
    </section>
  );
}
