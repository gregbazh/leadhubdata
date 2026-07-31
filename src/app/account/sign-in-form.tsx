"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm({ initialEmail }: { initialEmail?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStep("code");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Invalid code. Check and try again.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl border border-blue/10 bg-white shadow-[0_20px_60px_rgba(0,85,255,0.06)]">
      {step === "email" ? (
        <form onSubmit={requestCode}>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Sign in</h2>
          <p className="mt-2 text-sm text-foreground/55 font-medium leading-relaxed">
            Use the email from your purchase. We&apos;ll send you a 6-digit code — no
            password needed.
          </p>
          <label className="block mt-6 text-xs font-bold text-foreground/50 uppercase tracking-[0.2em]">
            Email
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="mt-2 w-full h-12 px-4 rounded-xl border border-blue/15 text-base font-medium text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-all"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full h-12 bg-blue text-white text-sm font-bold rounded-full hover:bg-blue-dark transition-all duration-300 disabled:opacity-50"
          >
            {busy ? "Sending..." : "Email me a code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode}>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Check your email</h2>
          <p className="mt-2 text-sm text-foreground/55 font-medium leading-relaxed">
            We sent a 6-digit code to <span className="font-bold text-foreground">{email}</span>.
            It expires in 10 minutes.
          </p>
          <label className="block mt-6 text-xs font-bold text-foreground/50 uppercase tracking-[0.2em]">
            Code
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="mt-2 w-full h-12 px-4 rounded-xl border border-blue/15 text-xl font-bold tracking-[0.4em] text-center text-foreground placeholder:text-foreground/20 placeholder:tracking-[0.4em] focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-all"
            />
          </label>
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="mt-6 w-full h-12 bg-blue text-white text-sm font-bold rounded-full hover:bg-blue-dark transition-all duration-300 disabled:opacity-50"
          >
            {busy ? "Verifying..." : "Sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
            className="mt-3 w-full text-sm font-semibold text-foreground/50 hover:text-blue transition-colors"
          >
            Use a different email
          </button>
        </form>
      )}
      {error && (
        <p className="mt-4 text-sm font-semibold text-red-600 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
