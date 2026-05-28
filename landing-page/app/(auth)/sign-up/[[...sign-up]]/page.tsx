import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

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

export default function SignUpPage() {
  return (
    <section className="above-bg min-h-[calc(100vh-12rem)]">
      <div className="container-wide py-16 sm:py-20">
        <div className="max-w-[420px] mx-auto">
          <div className="text-center mb-8">
            <span className="eye justify-center inline-flex">
              <span className="eye-dot" aria-hidden />
              Create account
            </span>
            <h1 className="mt-4 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              Get your portal.
            </h1>
            <p className="mt-2 text-[14px] text-ink-60">
              Sign up with Google or email. Lifetime access on purchase.
            </p>
          </div>

          <div className="flex justify-center">
            <SignUp
              appearance={appearance}
              signInUrl="/sign-in"
              fallbackRedirectUrl="/"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
