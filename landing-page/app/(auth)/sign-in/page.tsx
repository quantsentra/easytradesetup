import type { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string; msg?: string }>;
}) {
  return <SignInFormWrapper searchParams={searchParams} />;
}

async function SignInFormWrapper({
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
              Sign in
            </span>
            <h1 className="mt-4 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              Welcome back.
            </h1>
            <p className="mt-2 text-[14px] text-ink-60">
              Sign in with Google or get a one-time link by email.
            </p>
          </div>

          <SignInForm redirectTo={redirect} error={sp.error} msg={sp.msg} />

          <p className="mt-8 text-center text-[13px] text-ink-60">
            New here?{" "}
            <a href="/sign-up" className="text-cyan hover:underline">
              Create an account →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
