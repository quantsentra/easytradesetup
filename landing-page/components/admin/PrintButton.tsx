"use client";

export default function PrintButton({ label = "Print / save PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      className="tz-btn"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
    >
      {label}
    </button>
  );
}
