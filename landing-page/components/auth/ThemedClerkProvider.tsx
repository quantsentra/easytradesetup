"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";

// ClerkProvider rendered on the client so the hosted sign-in / sign-up
// widgets track the site theme toggle. Watches <html class> for the
// `.light` flag (set pre-hydration in layout.tsx) and swaps the Clerk
// baseTheme in real time.
export default function ThemedClerkProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const update = () => setIsDark(!document.documentElement.classList.contains("light"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const darkVars = {
    colorPrimary: "#2B7BFF",
    colorBackground: "#05070F",
    colorText: "#EDF1FA",
    colorTextSecondary: "rgba(237,241,250,0.62)",
    colorInputBackground: "rgba(255,255,255,0.04)",
    colorInputText: "#EDF1FA",
    borderRadius: "10px",
  };

  const lightVars = {
    colorPrimary: "#2B7BFF",
    colorBackground: "#FFFFFF",
    colorText: "#0D0D0D",
    colorTextSecondary: "rgba(13,13,13,0.64)",
    colorInputBackground: "#F6F7FA",
    colorInputText: "#0D0D0D",
    borderRadius: "10px",
  };

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: isDark ? darkVars : lightVars,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
