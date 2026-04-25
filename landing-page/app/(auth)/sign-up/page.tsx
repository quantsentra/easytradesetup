import type { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string; msg?: string }>;
}) {
  const sp = await searchParams;
  const redirect = sp.redirect || "/portal";
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
              Sign up with Google or get a one-time link by email. No password.
            </p>
          </div>

          <SignInForm redirectTo={redirect} error={sp.error} msg={sp.msg} mode="sign-up" />

          <p className="mt-8 text-center text-[13px] text-ink-60">
            Already have an account?{" "}
            <a href="/sign-in" className="text-cyan hover:underline">
              Sign in →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
