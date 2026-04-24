"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Mode = "sign-in" | "sign-up";

export default function SignInForm({
  redirectTo,
  error,
  msg,
  mode = "sign-in",
}: {
  redirectTo: string;
  error?: string;
  msg?: string;
  mode?: Mode;
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onGoogle() {
    setLocalError(null);
    setBusy(true);
    try {
      const supa = supabaseBrowser();
      const callback = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;
      const { error } = await supa.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback },
      });
      if (error) setLocalError(error.message);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);
    setBusy(true);
    try {
      const supa = supabaseBrowser();
      const callback = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;
      const { error } = await supa.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: callback,
          shouldCreateUser: mode === "sign-up",
        },
      });
      if (error) {
        setLocalError(error.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const shownError = localError || error;

  return (
    <div className="glass-card-soft p-6 flex flex-col gap-4">
      {sent ? (
        <div className="text-center py-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan">
            Check your inbox
          </div>
          <h2 className="mt-2 font-display text-[20px] font-semibold text-ink">
            Sign-in link sent.
          </h2>
          <p className="mt-3 text-[13.5px] text-ink-60 leading-relaxed">
            Click the link in the email from{" "}
            <strong className="text-ink">{email}</strong> to finish signing in. The link expires in
            one hour.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-4 text-[12px] text-cyan hover:underline"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={onGoogle}
            disabled={busy}
            className="btn btn-outline w-full justify-center gap-2 disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M23.49 12.27c0-.78-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.12 2.77-2.39 3.62v3.02h3.86c2.27-2.08 3.55-5.16 3.55-8.67z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.86-3.02c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.78-2.12-6.72-4.96H1.32v3.13C3.3 21.3 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.23-.72-.37-1.48-.37-2.27s.13-1.55.37-2.27V6.6H1.32A11.97 11.97 0 0 0 0 12c0 1.92.46 3.74 1.32 5.4l3.96-3.13z" />
              <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.59 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.33 0 3.3 2.7 1.32 6.6l3.96 3.13C6.22 6.89 8.87 4.77 12 4.77z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-[11px] text-ink-40 font-mono uppercase tracking-widest">
            <div className="flex-1 h-px bg-rule" />
            or
            <div className="flex-1 h-px bg-rule" />
          </div>

          <form onSubmit={onEmail} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10.5px] uppercase tracking-widest text-ink-40">
                Email
              </span>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
            </label>
            <button
              type="submit"
              disabled={busy || !email}
              className="btn btn-primary justify-center disabled:opacity-60"
            >
              {busy ? "Sending link…" : "Email me a sign-in link"}
            </button>
          </form>
        </>
      )}

      {shownError && (
        <div className="text-[13px] text-rose-500 bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
          {shownError}
        </div>
      )}

      {msg && !shownError && (
        <div className="text-[13px] text-ink-60 bg-panel/80 border border-rule rounded-lg p-3">
          {msg}
        </div>
      )}

      <p className="mt-2 text-center text-nano font-mono uppercase tracking-widest text-ink-40">
        No password · Magic link expires in 1 hour
      </p>
    </div>
  );
}
