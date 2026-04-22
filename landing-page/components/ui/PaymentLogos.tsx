const methods = [
  { name: "UPI",         note: "India" },
  { name: "Razorpay",    note: "India" },
  { name: "Visa",        note: "Global" },
  { name: "Mastercard",  note: "Global" },
  { name: "Net Banking", note: "India" },
  { name: "Stripe",      note: "International" },
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
        className={`text-nano font-semibold text-ink-40 uppercase tracking-widest ${
          align === "center" ? "text-center" : "text-left"
        }`}
      >
        {label}
      </div>
      <ul className={`mt-3 flex flex-wrap ${a} items-center gap-x-2.5 gap-y-2`}>
        {methods.map((m) => (
          <li
            key={m.name}
            className="inline-flex items-center rounded-md bg-white/5 border border-rule-2 px-2.5 py-1 font-mono text-nano text-ink-60 uppercase tracking-wider font-semibold"
            title={`${m.name} — ${m.note}`}
          >
            {m.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
