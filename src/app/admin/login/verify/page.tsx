"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpStep, cancelChallenge } from "../actions";

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  const [code, setCode] = useState("");
  const [trust, setTrust] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const label =
      typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 200) : null;
    const res = await verifyOtpStep(code, trust, label);
    setLoading(false);
    if (res.stage === "ok") {
      router.push(callbackUrl);
      router.refresh();
      return;
    }
    setError(res.message);
  }

  async function onCancel() {
    await cancelChallenge();
    router.push("/admin/login");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <p className="text-sm text-bark">
        We emailed you a 6-digit code. Enter it below to finish signing in.
      </p>
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-charcoal mb-1.5">
          Verification code
        </label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-white focus:outline-none focus:ring-2 focus:ring-camp-red/30 focus:border-camp-red text-charcoal text-center font-mono tracking-[0.5em] text-lg"
          autoFocus
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          checked={trust}
          onChange={(e) => setTrust(e.target.checked)}
          className="rounded border-bark/30"
        />
        Trust this device for 30 days
      </label>
      {error && (
        <p className="text-sm text-camp-red bg-camp-red/10 px-3 py-2 rounded-lg">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="w-full bg-camp-red text-white font-semibold py-2.5 rounded-full hover:bg-camp-red-dark transition-colors disabled:opacity-60"
      >
        {loading ? "Verifying…" : "Verify and sign in"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full text-sm text-bark hover:text-camp-red"
      >
        Cancel and start over
      </button>
    </form>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-7">
          <h1 className="font-camp text-2xl text-charcoal">Verify it&apos;s you</h1>
          <p className="text-sm text-bark mt-1">Two-factor authentication</p>
        </div>
        <Suspense fallback={<div className="text-sm text-bark">Loading…</div>}>
          <VerifyForm />
        </Suspense>
      </div>
    </div>
  );
}
