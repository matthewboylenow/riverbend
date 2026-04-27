/**
 * Email helpers — Resend.
 *
 * Gracefully no-op when RESEND_API_KEY is not configured (logs to console),
 * so the rest of the order flow keeps working in local/dev without keys.
 */
import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "Camp Riverbend <noreply@campriverbend.com>";
const ADMIN_TO = process.env.ADMIN_NOTIFICATION_EMAIL || "abby@campriverbend.com";

let cachedClient: Resend | null = null;
function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!cachedClient) cachedClient = new Resend(process.env.RESEND_API_KEY);
  return cachedClient;
}

interface OrderForEmail {
  orderNumber: number | string;
  customerName: string;
  customerEmail: string;
  camperName: string | null;
  phone: string | null;
  paymentMethod: "stripe" | "account_billing";
  subtotal: string | number;
  shippingCost: string | number;
  total: string | number;
  items: Array<{ productName: string; variantName?: string | null; quantity: number; unitPrice: string | number }>;
  shippingAddress: Record<string, string> | null;
}

function fmtMoney(v: string | number): string {
  return `$${Number(v).toFixed(2)}`;
}

function itemsHtml(items: OrderForEmail["items"]): string {
  return items
    .map(
      (it) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${it.productName}${
          it.variantName ? ` <span style="color:#777">(${it.variantName})</span>` : ""
        }</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${
          it.quantity
        }</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${fmtMoney(
          it.unitPrice
        )}</td></tr>`
    )
    .join("");
}

function addressHtml(addr: Record<string, string> | null): string {
  if (!addr) return "<p>(No shipping address)</p>";
  if (addr.pickup) return "<p>Pickup at camp</p>";
  return `
    <p style="margin:0">${addr.line1 || ""}</p>
    ${addr.line2 ? `<p style="margin:0">${addr.line2}</p>` : ""}
    <p style="margin:0">${addr.city || ""}, ${addr.state || ""} ${addr.postalCode || addr.zip || ""}</p>
  `;
}

export async function sendOrderEmails(order: OrderForEmail): Promise<void> {
  const client = getClient();
  if (!client) {
    console.log(`[email] skipped (no RESEND_API_KEY) — order #${order.orderNumber} for ${order.customerEmail}`);
    return;
  }

  const subject = `Order #${order.orderNumber} — ${order.customerName}`;
  const paymentNote =
    order.paymentMethod === "account_billing"
      ? "Payment method: Account billing — invoice will be sent with the camper's tuition bill."
      : "Payment method: Credit card (paid via Stripe).";

  const adminHtml = `
    <h2>New order #${order.orderNumber}</h2>
    <p><strong>Customer:</strong> ${order.customerName} &lt;${order.customerEmail}&gt;</p>
    <p><strong>Phone:</strong> ${order.phone || "—"}</p>
    <p><strong>Camper:</strong> ${order.camperName || "—"}</p>
    <p>${paymentNote}</p>
    <h3 style="margin-top:24px">Shipping</h3>
    ${addressHtml(order.shippingAddress)}
    <h3 style="margin-top:24px">Items</h3>
    <table style="border-collapse:collapse;width:100%;max-width:560px">
      <thead><tr><th align="left" style="padding:6px 12px;border-bottom:2px solid #ccc">Item</th><th style="padding:6px 12px;border-bottom:2px solid #ccc">Qty</th><th align="right" style="padding:6px 12px;border-bottom:2px solid #ccc">Unit</th></tr></thead>
      <tbody>${itemsHtml(order.items)}</tbody>
      <tfoot>
        <tr><td colspan="2" style="padding:6px 12px;text-align:right">Subtotal</td><td style="padding:6px 12px;text-align:right">${fmtMoney(order.subtotal)}</td></tr>
        <tr><td colspan="2" style="padding:6px 12px;text-align:right">Shipping</td><td style="padding:6px 12px;text-align:right">${fmtMoney(order.shippingCost)}</td></tr>
        <tr><td colspan="2" style="padding:8px 12px;text-align:right;font-weight:bold;border-top:2px solid #ccc">Total</td><td style="padding:8px 12px;text-align:right;font-weight:bold;border-top:2px solid #ccc">${fmtMoney(order.total)}</td></tr>
      </tfoot>
    </table>
  `;

  const customerHtml = `
    <h2 style="font-family:Georgia,serif;color:#db3832">Thanks for your order, ${order.customerName.split(" ")[0]}!</h2>
    <p>We've received your Camp Riverbend store order <strong>#${order.orderNumber}</strong> and we'll get it ready shortly.</p>
    <p>${paymentNote}</p>
    <table style="border-collapse:collapse;width:100%;max-width:560px;margin-top:16px">
      <thead><tr><th align="left" style="padding:6px 12px;border-bottom:2px solid #ccc">Item</th><th style="padding:6px 12px;border-bottom:2px solid #ccc">Qty</th><th align="right" style="padding:6px 12px;border-bottom:2px solid #ccc">Unit</th></tr></thead>
      <tbody>${itemsHtml(order.items)}</tbody>
      <tfoot>
        <tr><td colspan="2" style="padding:6px 12px;text-align:right">Subtotal</td><td style="padding:6px 12px;text-align:right">${fmtMoney(order.subtotal)}</td></tr>
        <tr><td colspan="2" style="padding:6px 12px;text-align:right">Shipping</td><td style="padding:6px 12px;text-align:right">${fmtMoney(order.shippingCost)}</td></tr>
        <tr><td colspan="2" style="padding:8px 12px;text-align:right;font-weight:bold;border-top:2px solid #ccc">Total</td><td style="padding:8px 12px;text-align:right;font-weight:bold;border-top:2px solid #ccc">${fmtMoney(order.total)}</td></tr>
      </tfoot>
    </table>
    <p style="margin-top:24px">If you have questions, reply to this email or write to <a href="mailto:${ADMIN_TO}">${ADMIN_TO}</a>.</p>
    <p style="color:#777;font-size:12px;margin-top:32px">Camp Riverbend · 100 Riverbend Drive, Warren, NJ</p>
  `;

  try {
    await Promise.all([
      client.emails.send({ from: FROM, to: ADMIN_TO, subject, html: adminHtml }),
      client.emails.send({
        from: FROM,
        to: order.customerEmail,
        subject: `Your Camp Riverbend order #${order.orderNumber}`,
        html: customerHtml,
      }),
    ]);
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}
