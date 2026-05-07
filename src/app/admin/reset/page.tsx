"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { completeReset } from "../forgot/actions";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    const res = await completeReset(token, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/admin/login"), 2000);
  }

  if (!token) {
    return (
      <p className="text-sm text-camp-red bg-camp-red/10 px-3 py-2 rounded-lg">
        Missing reset token. Please request a new reset link.
      </p>
    );
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-charcoal bg-meadow/20 px-4 py-3 rounded-lg">
          Password updated. Redirecting to sign in…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-white focus:outline-none focus:ring-2 focus:ring-camp-red/30 focus:border-camp-red text-charcoal"
        />
        <p className="text-xs text-bark mt-1">At least 12 characters.</p>
      </div>
      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-charcoal mb-1.5">
          Confirm new password
        </label>
        <input
          id="confirm"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-bark/20 bg-white focus:outline-none focus:ring-2 focus:ring-camp-red/30 focus:border-camp-red text-charcoal"
        />
      </div>
      {error && (
        <p className="text-sm text-camp-red bg-camp-red/10 px-3 py-2 rounded-lg">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-camp-red text-white font-semibold py-2.5 rounded-full hover:bg-camp-red-dark transition-colors disabled:opacity-60"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
      <p className="text-center text-sm text-bark">
        <Link href="/admin/login" className="hover:text-camp-red underline-offset-2 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export default function ResetPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-7">
          <h1 className="font-camp text-2xl text-charcoal">Set a new password</h1>
        </div>
        <Suspense fallback={<div className="text-sm text-bark">Loading…</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
