"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: string;
}

interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  camperName: string | null;
  phone: string | null;
  shippingAddress: Record<string, string> | null;
  paymentMethod: "stripe" | "account_billing";
  stripeSessionId: string | null;
  status: string;
  subtotal: string;
  shippingCost: string;
  total: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STATUSES = [
  "pending",
  "paid",
  "shipped",
  "fulfilled",
  "cancelled",
  "pending_invoice",
  "invoiced",
];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/orders/${params.id}`);
    const data = await res.json();
    setOrder(data);
    setNotes(data?.notes || "");
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // load is stable enough; tracking only the order id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function updateStatus(status: string) {
    setSaving(true);
    await fetch(`/api/orders/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setSaving(false);
  }

  async function saveNotes() {
    setSaving(true);
    await fetch(`/api/orders/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSaving(false);
  }

  if (loading) return <p className="text-sm text-bark">Loading…</p>;
  if (!order) return <p className="text-sm text-bark">Order not found.</p>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="flex items-center justify-center h-9 w-9 rounded-lg bg-sand text-bark hover:text-charcoal">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Order #{order.orderNumber}</h1>
          <p className="text-sm text-bark">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-stone/30 p-5">
          <h2 className="font-semibold text-charcoal mb-3">Customer</h2>
          <dl className="space-y-1.5 text-sm">
            <div><dt className="inline text-bark">Name: </dt><dd className="inline">{order.customerName}</dd></div>
            <div><dt className="inline text-bark">Email: </dt><dd className="inline">{order.customerEmail}</dd></div>
            <div><dt className="inline text-bark">Phone: </dt><dd className="inline">{order.phone || "—"}</dd></div>
            <div><dt className="inline text-bark">Camper: </dt><dd className="inline">{order.camperName || "—"}</dd></div>
            <div><dt className="inline text-bark">Payment: </dt><dd className="inline">{order.paymentMethod === "stripe" ? "Stripe (card)" : "Account billing"}</dd></div>
          </dl>
        </div>

        <div className="bg-white rounded-2xl border border-stone/30 p-5">
          <h2 className="font-semibold text-charcoal mb-3">Shipping</h2>
          {order.shippingAddress ? (
            <address className="not-italic text-sm text-charcoal">
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.line2 && (<>{order.shippingAddress.line2}<br /></>)}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </address>
          ) : (
            <p className="text-sm text-bark">No shipping address on file.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone/30 mb-6">
        <div className="px-5 py-4 border-b border-stone/20">
          <h2 className="font-semibold text-charcoal">Items</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-cream/50">
              <th className="text-left px-5 py-2 text-xs font-semibold text-bark uppercase">Product</th>
              <th className="text-left px-5 py-2 text-xs font-semibold text-bark uppercase">Variant</th>
              <th className="text-right px-5 py-2 text-xs font-semibold text-bark uppercase">Qty</th>
              <th className="text-right px-5 py-2 text-xs font-semibold text-bark uppercase">Unit</th>
              <th className="text-right px-5 py-2 text-xs font-semibold text-bark uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it) => (
              <tr key={it.id} className="border-t border-stone/10">
                <td className="px-5 py-2 text-sm">{it.productName}</td>
                <td className="px-5 py-2 text-sm text-bark">{it.variantName || "—"}</td>
                <td className="px-5 py-2 text-sm text-right">{it.quantity}</td>
                <td className="px-5 py-2 text-sm text-right">${it.unitPrice}</td>
                <td className="px-5 py-2 text-sm text-right font-semibold">
                  ${(Number(it.unitPrice) * it.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-stone/20">
              <td colSpan={4} className="px-5 py-2 text-sm text-right text-bark">Subtotal</td>
              <td className="px-5 py-2 text-sm text-right">${order.subtotal}</td>
            </tr>
            <tr>
              <td colSpan={4} className="px-5 py-2 text-sm text-right text-bark">Shipping</td>
              <td className="px-5 py-2 text-sm text-right">${order.shippingCost}</td>
            </tr>
            <tr className="border-t border-stone/20">
              <td colSpan={4} className="px-5 py-3 text-sm text-right font-semibold">Total</td>
              <td className="px-5 py-3 text-base text-right font-bold">${order.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-stone/30 p-5">
          <h2 className="font-semibold text-charcoal mb-3">Status</h2>
          <p className="text-sm text-bark mb-3">Current: <span className="font-semibold text-charcoal">{order.status.replace(/_/g, " ")}</span></p>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={saving || s === order.status}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone hover:border-camp-red hover:bg-cream/50 disabled:opacity-40"
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone/30 p-5">
          <h2 className="font-semibold text-charcoal mb-3">Internal notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-stone bg-white text-sm"
          />
          <button
            onClick={saveNotes}
            disabled={saving}
            className="mt-2 px-4 py-1.5 bg-camp-red text-white text-sm font-semibold rounded-full hover:bg-camp-red-dark disabled:opacity-50"
          >
            Save notes
          </button>
        </div>
      </div>
    </div>
  );
}
