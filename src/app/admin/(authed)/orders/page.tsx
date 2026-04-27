"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  camperName: string | null;
  paymentMethod: "stripe" | "account_billing";
  status: string;
  total: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  fulfilled: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
  pending_invoice: "bg-orange-100 text-orange-800",
  invoiced: "bg-indigo-100 text-indigo-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    void fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const statuses = ["all", "pending", "paid", "pending_invoice", "invoiced", "shipped", "fulfilled", "cancelled"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal mb-6">Orders</h1>

      <div className="flex flex-wrap gap-1 mb-6 p-1 bg-sand rounded-xl w-fit">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-all",
              filter === s ? "bg-white text-charcoal shadow-sm" : "text-bark hover:text-charcoal"
            )}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone/30 overflow-hidden">
        {loading ? (
          <p className="px-4 py-6 text-sm text-bark">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-6 text-sm text-bark">No orders.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone/20 bg-cream/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Camper</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-bark uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-stone/10 hover:bg-cream/50">
                  <td className="px-4 py-3 text-sm font-mono">
                    <Link href={`/admin/orders/${o.id}`} className="text-camp-red hover:underline">
                      #{o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-semibold text-charcoal">{o.customerName}</div>
                    <div className="text-bark text-xs">{o.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-bark">{o.camperName || "—"}</td>
                  <td className="px-4 py-3 text-sm text-bark">
                    {o.paymentMethod === "stripe" ? "Card" : "Account"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full",
                        STATUS_COLORS[o.status] || "bg-stone/20 text-bark"
                      )}
                    >
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">${o.total}</td>
                  <td className="px-4 py-3 text-sm text-bark">
                    {new Date(o.createdAt).toLocaleDateString()}
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
