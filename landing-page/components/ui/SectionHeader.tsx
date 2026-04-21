import type { ReactNode } from "react";

type Props = {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
};

export default function SectionHeader({ kicker, title, lede, align = "left" }: Props) {
  const a = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-3xl ${a}`}>
      {kicker && <div className="label-kicker">{kicker}</div>}
      <h2 className={`${kicker ? "mt-3" : ""} font-display text-display-md text-balance`}>{title}</h2>
      {lede && <p className="mt-5 text-lg text-cream-muted leading-relaxed text-balance">{lede}</p>}
    </div>
  );
}
