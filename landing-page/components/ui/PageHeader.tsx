import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
};

export default function PageHeader({ eyebrow, title, lede }: Props) {
  return (
    <section className="container-x pt-20 md:pt-28 pb-12 border-b border-ink-border">
      {eyebrow && <div className="label-kicker mb-5">{eyebrow}</div>}
      <h1 className="font-display text-display-lg text-balance max-w-4xl">{title}</h1>
      {lede && (
        <p className="mt-6 text-lg md:text-xl text-cream-muted max-w-2xl leading-relaxed text-balance">
          {lede}
        </p>
      )}
    </section>
  );
}
