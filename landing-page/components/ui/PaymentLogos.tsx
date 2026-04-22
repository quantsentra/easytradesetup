const methods = [
  { name: "UPI",        note: "India" },
  { name: "Razorpay",   note: "India" },
  { name: "Visa",       note: "Global" },
  { name: "Mastercard", note: "Global" },
  { name: "Net Banking", note: "India" },
  { name: "Stripe",     note: "International" },
];

export default function PaymentLogos({
  align = "center",
  label = "Payment methods on launch",
}: {
  align?: "center" | "left";
  label?: string;
}) {
  const a = align === "center" ? "justify-center" : "justify-start";
  return (
    <div>
      <div
        className={`text-nano font-semibold text-muted-faint uppercase tracking-widest ${
          align === "center" ? "text-center" : "text-left"
        }`}
      >
        {label}
      </div>
      <ul className={`mt-3 flex flex-wrap ${a} items-center gap-x-3 gap-y-2`}>
        {methods.map((m) => (
          <li
            key={m.name}
            className="inline-flex items-center rounded-md border border-rule bg-surface-alt px-2.5 py-1 text-nano font-semibold text-ink tracking-tight"
            title={`${m.name} — ${m.note}`}
          >
            {m.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
