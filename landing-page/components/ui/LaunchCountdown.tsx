// Permanent launch price — no countdown UI. Component intentionally
// renders nothing so existing importers stay safe; the variant prop is
// kept to preserve the public API.

export default function LaunchCountdown(_props: { variant?: "card" | "inline" }) {
  return null;
}
