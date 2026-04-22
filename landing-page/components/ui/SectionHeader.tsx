import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
};

export default function SectionHeader({ eyebrow, title, lede, align = "center" }: Props) {
  const a = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-[720px] ${a}`}>
      {eyebrow && (
        <div className="eye justify-center mb-4 inline-flex">
          <span className="eye-dot" aria-hidden />
          {eyebrow}
        </div>
      )}
      <h2 className="h-section">{title}</h2>
      {lede && (
        <p className="mt-5 body-muted">{lede}</p>
      )}
    </div>
  );
}
