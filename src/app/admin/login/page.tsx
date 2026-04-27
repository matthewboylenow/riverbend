"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
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
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-7">
          <h1 className="font-camp text-2xl text-charcoal">Camp Riverbend Admin</h1>
          <p className="text-sm text-bark mt-1">Sign in to manage the site</p>
        </div>
        <Suspense fallback={<div className="text-sm text-bark">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
