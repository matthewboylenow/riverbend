"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin";
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", password: "", role: "admin" });
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/users");
    setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create() {
    setError(null);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) {
      const msg = (await res.json()).error || "Failed";
      setError(msg);
      toast.error(msg);
      return;
    }
    setDraft({ name: "", email: "", password: "", role: "admin" });
    setShowNew(false);
    await load();
    toast.success("Admin user created");
  }

  async function remove(id: string, email: string) {
    if (!confirm(`Remove admin user ${email}?`)) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      await load();
      toast.success(`${email} removed`);
    } else {
      toast.error((await res.json()).error || "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Admin Users</h1>
        {!showNew && (
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 bg-camp-red text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-camp-red-dark"
          >
            <Plus className="h-4 w-4" />
            New User
          </button>
        )}
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl border border-stone/30 p-5 mb-6">
          <h2 className="font-semibold text-charcoal mb-4">New admin user</h2>
          {error && <p className="mb-3 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="px-4 py-2 rounded-lg border border-stone bg-white text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="px-4 py-2 rounded-lg border border-stone bg-white text-sm"
            />
            <input
              type="password"
              placeholder="Password (min 10 chars)"
              value={draft.password}
              onChange={(e) => setDraft({ ...draft, password: e.target.value })}
              className="px-4 py-2 rounded-lg border border-stone bg-white text-sm"
            />
            <select
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              className="px-4 py-2 rounded-lg border border-stone bg-white text-sm"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={create} className="px-4 py-2 bg-camp-red text-white text-sm font-semibold rounded-full hover:bg-camp-red-dark">
              Create
            </button>
            <button onClick={() => { setShowNew(false); setError(null); }} className="px-4 py-2 text-sm hover:bg-sand rounded-full">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone/30 overflow-hidden">
        {loading ? (
          <p className="px-4 py-6 text-sm text-bark">Loading…</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone/20 bg-cream/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Added</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-stone/10 hover:bg-cream/50">
                  <td className="px-4 py-3 text-sm font-semibold text-charcoal">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-bark">{u.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-sand text-bark">
                      {u.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-bark">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove(u.id, u.email)}
                      className="p-2 text-bark hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
