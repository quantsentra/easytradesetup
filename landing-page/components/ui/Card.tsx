import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  gold?: boolean;
};

export default function Card({ children, className = "", gold = false }: Props) {
  return (
    <div
      className={`glass-card ${gold ? "gold-border" : ""} p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
