"use client";

import { useEffect, useState } from "react";
import { Save, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin";
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/users/me")
      .then((r) => r.json())
      .then((d) => setProfile(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-bark">Loading…</p>;
  if (!profile) return <p className="text-sm text-bark">Could not load profile.</p>;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">My Profile</h1>
        <p className="text-sm text-bark mt-1">
          Update your name, email, and password.
        </p>
      </div>

      <ProfileForm profile={profile} onUpdated={setProfile} />
      <PasswordForm />
    </div>
  );
}

function ProfileForm({
  profile,
  onUpdated,
}: {
  profile: Profile;
  onUpdated: (p: Profile) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const text = data.error || "Save failed";
      setMsg({ type: "err", text });
      toast.error(text);
      return;
    }
    const updated = await res.json();
    onUpdated({ ...profile, ...updated });
    setMsg({ type: "ok", text: "Saved." });
    toast.success("Profile updated");
  }

  return (
    <form
      onSubmit={save}
      className="bg-white rounded-2xl border border-stone/30 p-6 space-y-4"
    >
      <h2 className="font-semibold text-charcoal">Account</h2>
      <Field label="Name">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
          required
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
          required
        />
      </Field>
      <div className="text-xs text-bark">
        Role: <span className="font-medium text-charcoal">{profile.role.replace("_", " ")}</span>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-camp-red text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving…" : "Save changes"}
        </button>
        {msg && (
          <span
            className={cn(
              "text-sm",
              msg.type === "ok" ? "text-green-700" : "text-red-700"
            )}
          >
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const strength = scorePassword(next);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (next !== confirm) {
      setMsg({ type: "err", text: "Passwords don't match" });
      return;
    }

    setSaving(true);
    const res = await fetch("/api/users/me/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const text = data.error || "Password change failed";
      setMsg({ type: "err", text });
      toast.error(text);
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    setMsg({ type: "ok", text: "Password updated. You'll stay signed in on this device." });
    toast.success("Password updated");
  }

  return (
    <form
      onSubmit={save}
      className="bg-white rounded-2xl border border-stone/30 p-6 space-y-4"
    >
      <h2 className="font-semibold text-charcoal flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Change password
      </h2>

      <Field label="Current password">
        <PasswordInput
          value={current}
          onChange={setCurrent}
          show={showCurrent}
          onToggle={() => setShowCurrent(!showCurrent)}
          autoComplete="current-password"
        />
      </Field>

      <Field label="New password">
        <PasswordInput
          value={next}
          onChange={setNext}
          show={showNext}
          onToggle={() => setShowNext(!showNext)}
          autoComplete="new-password"
        />
        {next.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    strength.score > i ? STRENGTH_COLOR[strength.score - 1] : "bg-stone/30"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-bark">{strength.label}</p>
          </div>
        )}
      </Field>

      <Field label="Confirm new password">
        <input
          type={showNext ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          className="w-full px-4 py-2.5 rounded-xl border border-stone bg-white"
        />
      </Field>

      <p className="text-xs text-bark">
        Must be at least 12 characters and include a mix of upper/lowercase, a number, and not start with common words.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || !current || !next || !confirm}
          className="inline-flex items-center gap-2 bg-camp-red text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-camp-red-dark disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Updating…" : "Update password"}
        </button>
        {msg && (
          <span
            className={cn(
              "text-sm",
              msg.type === "ok" ? "text-green-700" : "text-red-700"
            )}
          >
            {msg.text}
          </span>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-bark uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-stone bg-white"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-bark hover:text-charcoal"
        title={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

const STRENGTH_COLOR = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

function scorePassword(p: string): { score: number; label: string } {
  if (!p) return { score: 0, label: "" };
  let s = 0;
  if (p.length >= 12) s++;
  if (p.length >= 16) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p) && /[^a-zA-Z0-9]/.test(p)) s++;
  // Penalty for very common patterns
  if (/^(password|admin|riverbend|camp)/i.test(p)) s = Math.min(s, 1);
  if (s > 4) s = 4;
  return { score: s, label: ["", "Weak", "Fair", "Good", "Strong"][s] };
}
