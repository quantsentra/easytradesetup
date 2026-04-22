import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
};

export default function PageHeader({ eyebrow, title, lede }: Props) {
  return (
    <section className="relative above-bg hairline-b">
      <div className="container-wide pt-16 md:pt-24 pb-12 md:pb-16 text-center">
        {eyebrow && (
          <div className="eye justify-center mb-5 inline-flex">
            <span className="eye-dot" aria-hidden />
            {eyebrow}
          </div>
        )}
        <h1 className="h-hero max-w-3xl mx-auto">{title}</h1>
        {lede && (
          <p className="mt-6 body-muted max-w-2xl mx-auto">{lede}</p>
        )}
      </div>
    </section>
  );
}
