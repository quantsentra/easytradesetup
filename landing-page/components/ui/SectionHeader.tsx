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
      {eyebrow && <div className="text-micro font-semibold text-blue-link uppercase tracking-wider">{eyebrow}</div>}
      <h2 className={`${eyebrow ? "mt-3" : ""} h-section`}>{title}</h2>
      {lede && <p className="mt-5 text-body-lg text-muted">{lede}</p>}
    </div>
  );
}
