// Single source of truth for Clerk widget styling (SignIn / SignUp /
// UserButton). The site runs the light theme (--c-bg #FFFFFF, dark ink,
// blue→cyan→gold accents), so Clerk must render light too — passing dark
// `colorBackground` here was the cause of the dark-card-on-light-page
// mismatch. Applied once on <ClerkProvider> in app/layout.tsx; every Clerk
// component inherits it.
export const clerkAppearance = {
  variables: {
    colorPrimary: "#2B7BFF",            // electric blue — brand primary
    colorBackground: "#FFFFFF",         // card surface (was #0E1530 dark)
    colorText: "#0D0D0D",               // --c-ink
    colorTextSecondary: "rgba(13,13,13,0.60)",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#0D0D0D",
    colorBorder: "rgba(0,0,0,0.12)",    // --c-rule-2
    colorDanger: "#d93b3b",
    colorSuccess: "#1f9d55",
    borderRadius: "0.7rem",
    fontFamily: '"Inter Tight", system-ui, -apple-system, sans-serif',
  },
  elements: {
    // Soft brand card shadow + hairline border to match .glass-card.
    card: "shadow-[0_8px_28px_-8px_rgba(0,0,0,0.14)] border border-[rgba(0,0,0,0.08)]",
    headerTitle: "font-semibold tracking-[-0.01em]",
    formButtonPrimary:
      "bg-[#2B7BFF] hover:bg-[#1e5fb8] text-white normal-case font-semibold",
    socialButtonsBlockButton:
      "border border-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.04)]",
  },
} as const;
