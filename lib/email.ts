import nodemailer from "nodemailer";
import { getSite, type SiteConfig } from "./settings";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
};

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return {
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  };
}

function buildTransport() {
  const config = getSmtpConfig();
  if (!config) return null;
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.user ? { user: config.user, pass: config.pass } : undefined,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(site: SiteConfig, title: string, bodyHtml: string, pixel: string): string {
  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e7eb;">
        <tr>
          <td style="padding:24px 32px;background:#0b1220;">
            <h1 style="margin:0;color:#ffffff;font-size:18px;letter-spacing:1px;">${site.brand}</h1>
            <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">${site.tagline}</p>
          </td>
        </tr>
        <tr><td style="padding:24px 32px;">
          <h2 style="margin:0 0 16px;color:#111827;font-size:16px;">${title}</h2>
          ${bodyHtml}
        </td></tr>
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
            ${site.legalName} &middot; ${escapeHtml(site.address)} &middot; ${escapeHtml(site.phone)}
          </td>
        </tr>
      </table>
      ${pixel}
    </td></tr>
  </table>
</body>
</html>`;
}

function trackingPixel(site: SiteConfig, emailLogId: string): string {
  const src = `${site.domain}/api/webhooks/email-open?emailId=${encodeURIComponent(emailLogId)}`;
  return `<img src="${src}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;" />`;
}

export type RfqEmailData = {
  rfqId: string;
  name: string;
  company: string;
  country: string;
  materials: string[];
  annualVolume?: number;
  cavityTarget?: number;
  drawingsAvailable?: boolean;
  deadline?: string;
  targetPrice?: number;
  details?: string;
  score: number;
  action: string;
};

export async function sendRfqAlert(data: RfqEmailData, emailLogId?: string): Promise<boolean> {
  const transport = buildTransport();
  if (!transport) return false;
  const site = await getSite();

  const rows = [
    ["RFQ ID", data.rfqId],
    ["Company", data.company],
    ["Contact", data.name],
    ["Country", data.country],
    ["Materials", data.materials.join(", ")],
    ["Annual volume", data.annualVolume?.toLocaleString() ?? "-"],
    ["Cavity target", data.cavityTarget?.toString() ?? "-"],
    ["Drawings", data.drawingsAvailable ? "Yes" : "No"],
    ["Deadline", data.deadline ?? "-"],
    ["Target price", data.targetPrice ? `$${data.targetPrice.toLocaleString()}` : "-"],
    ["Lead score", `${data.score}/100`],
    ["Recommended action", data.action],
  ];

  const bodyHtml = `
    <p style="color:#374151;font-size:14px;">A new quote request needs your attention.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;">
      ${rows
        .map(
          ([k, v]) =>
            `<tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;border-bottom:1px solid #f3f4f6;">${escapeHtml(k)}</td>
              <td style="padding:6px 0;color:#111827;font-size:13px;border-bottom:1px solid #f3f4f6;font-weight:bold;">${escapeHtml(String(v))}</td>
            </tr>`,
        )
        .join("")}
    </table>
    ${data.details ? `<p style="color:#374151;font-size:13px;white-space:pre-wrap;">${escapeHtml(data.details)}</p>` : ""}
    <a href="${site.domain}/crm/rfqs/${data.rfqId}"
       style="display:inline-block;margin-top:8px;padding:12px 20px;background:#e8500e;color:#ffffff;text-decoration:none;font-size:14px;border-radius:4px;">Open in CRM</a>`;

  await transport.sendMail({
    from: `"${site.brand}" <${process.env.SMTP_USER ?? site.email}>`,
    to: site.salesTeamEmails.join(", "),
    subject: `[RFQ ${data.score}/100] ${data.company} - ${data.materials.join("/")}`,
    html: wrap(site, `New RFQ - Lead Score ${data.score}/100 (${data.action})`, bodyHtml, emailLogId ? trackingPixel(site, emailLogId) : ""),
  });
  return true;
}

export async function sendRfqConfirmation(data: {
  to: string;
  name: string;
  rfqId: string;
}, emailLogId?: string): Promise<boolean> {
  const transport = buildTransport();
  if (!transport) return false;
  const site = await getSite();

  const bodyHtml = `
    <p style="color:#374151;font-size:14px;">Hi ${escapeHtml(data.name)},</p>
    <p style="color:#374151;font-size:14px;">
      Thank you for your quote request <strong>${escapeHtml(data.rfqId)}</strong>. Our engineers will review
      your specifications and respond with a proposal within 2 business days.
    </p>
    <p style="color:#374151;font-size:14px;">You can also chat with our team directly on the website, or reply to this email to add drawings or requirements.</p>
    <p style="color:#6b7280;font-size:13px;">Best regards,<br/>${site.brand} Engineering Team</p>`;

  await transport.sendMail({
    from: `"${site.brand}" <${process.env.SMTP_USER ?? site.email}>`,
    to: data.to,
    subject: `We received your quote request ${data.rfqId}`,
    html: wrap(site, "Quote Request Received", bodyHtml, emailLogId ? trackingPixel(site, emailLogId) : ""),
  });
  return true;
}
