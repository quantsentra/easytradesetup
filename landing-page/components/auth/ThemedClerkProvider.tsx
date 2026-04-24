"use client";

import { ClerkProvider } from "@clerk/nextjs";

// Light-only ClerkProvider wrapper. Kept as a client component so that
// `appearance` can pass through without import-order issues in the server
// component that renders RootLayout.
export default function ThemedClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#2B7BFF",
          colorBackground: "#FFFFFF",
          colorText: "#0D0D0D",
          colorTextSecondary: "rgba(13,13,13,0.64)",
          colorInputBackground: "#F6F7FA",
          colorInputText: "#0D0D0D",
          borderRadius: "10px",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
