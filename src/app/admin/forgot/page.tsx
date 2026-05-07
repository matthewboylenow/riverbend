"use client";

import { useState } from "react";
import Link from "next/link";
import { requestReset } from "./actions";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await requestReset(email);
    setLoading(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-7">
          <h1 className="font-camp text-2xl text-charcoal">Reset your password</h1>
          <p className="text-sm text-bark mt-1">
            We&apos;ll email a link to set a new password.
          </p>
        </div>

        {done ? (
          <div className="space-y-4">
            <p className="text-sm text-charcoal bg-meadow/20 px-4 py-3 rounded-lg">
              If an account exists for <span className="font-semibold">{email}</span>,
              a reset link is on its way. The link expires in 15 minutes.
            </p>
            <Link
              href="/admin/login"
              className="block text-center text-sm text-bark hover:text-camp-red"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <p className="text-center text-sm text-bark">
              <Link href="/admin/login" className="hover:text-camp-red underline-offset-2 hover:underline">
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
