import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

// Clerk path-routed sign-in. Lives on the portal host (portal.easytradesetup.com
// /sign-in). After sign-in, fallback to "/" which the middleware maps to the
// portal dashboard.
const appearance = {
  variables: {
    colorPrimary: "#2B7BFF",
    colorBackground: "#0E1530",
    colorText: "#E6ECFF",
    colorInputBackground: "#0B1024",
    colorInputText: "#E6ECFF",
    borderRadius: "0.6rem",
  },
};

export default function SignInPage() {
  return (
    <section className="above-bg min-h-[calc(100vh-12rem)]">
      <div className="container-wide py-16 sm:py-20">
        <div className="max-w-[420px] mx-auto">
          <div className="text-center mb-8">
            <span className="eye justify-center inline-flex">
              <span className="eye-dot" aria-hidden />
              Sign in
            </span>
            <h1 className="mt-4 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              Welcome back.
            </h1>
            <p className="mt-2 text-[14px] text-ink-60">
              Sign in with Google or email to reach your portal.
            </p>
          </div>

          <div className="flex justify-center">
            <SignIn
              appearance={appearance}
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
