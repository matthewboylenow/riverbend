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
    "Payment method: Account billing — charge the camper's account on file.";

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

// ─── Admin auth emails ──────────────────────────────────────

function authEmailShell(heading: string, bodyHtml: string): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#2a2a2a">
      <h2 style="font-family:Georgia,serif;color:#db3832;margin:0 0 16px">${heading}</h2>
      ${bodyHtml}
      <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px">
        Camp Riverbend admin · If you didn't expect this email, you can safely ignore it.
      </p>
    </div>
  `;
}

export async function sendPasswordResetEmail(args: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<void> {
  const client = getClient();
  if (!client) {
    console.log(`[email] skipped (no RESEND_API_KEY) — password reset for ${args.to}: ${args.resetUrl}`);
    return;
  }

  const html = authEmailShell(
    "Reset your password",
    `
      <p>Hi ${args.name.split(" ")[0]},</p>
      <p>Someone (hopefully you) requested a password reset for your Camp Riverbend admin account.</p>
      <p style="margin:24px 0">
        <a href="${args.resetUrl}" style="background:#db3832;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;display:inline-block;font-weight:600">
          Reset password
        </a>
      </p>
      <p style="color:#666;font-size:14px">This link expires in 15 minutes and can only be used once.</p>
      <p style="color:#666;font-size:13px;word-break:break-all">Or copy &amp; paste: ${args.resetUrl}</p>
    `,
  );

  try {
    await client.emails.send({
      from: FROM,
      to: args.to,
      subject: "Reset your Camp Riverbend admin password",
      html,
    });
  } catch (err) {
    console.error("[email] password reset send failed:", err);
  }
}

export async function sendLoginCodeEmail(args: {
  to: string;
  name: string;
  code: string;
}): Promise<void> {
  const client = getClient();
  if (!client) {
    console.log(`[email] skipped (no RESEND_API_KEY) — login code for ${args.to}: ${args.code}`);
    return;
  }

  const html = authEmailShell(
    "Your sign-in code",
    `
      <p>Hi ${args.name.split(" ")[0]},</p>
      <p>Use this code to finish signing in to the Camp Riverbend admin:</p>
      <p style="font-family:Menlo,Consolas,monospace;font-size:32px;letter-spacing:8px;font-weight:700;color:#2a2a2a;background:#f7f5ef;border:1px solid #e6e1d3;border-radius:12px;padding:16px;text-align:center;margin:24px 0">
        ${args.code}
      </p>
      <p style="color:#666;font-size:14px">This code expires in 10 minutes. If you didn't try to sign in, please reset your password immediately.</p>
    `,
  );

  try {
    await client.emails.send({
      from: FROM,
      to: args.to,
      subject: `Camp Riverbend sign-in code: ${args.code}`,
      html,
    });
  } catch (err) {
    console.error("[email] login code send failed:", err);
  }
}
