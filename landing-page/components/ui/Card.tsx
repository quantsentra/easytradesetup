import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "white" | "page" | "elevated";
};

export default function Card({ children, className = "", variant = "white" }: Props) {
  const v = {
    white: "card-white",
    page: "card-apple",
    elevated: "card-elevated",
  }[variant];
  return <div className={`${v} p-6 sm:p-8 md:p-10 ${className}`}>{children}</div>;
}
