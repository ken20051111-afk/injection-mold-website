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
<html lang="zh-CN">
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
    ["询价编号", data.rfqId],
    ["公司", data.company],
    ["联系人", data.name],
    ["国家/地区", data.country],
    ["材料", data.materials.join(", ")],
    ["年需求量", data.annualVolume?.toLocaleString() ?? "-"],
    ["目标腔数", data.cavityTarget?.toString() ?? "-"],
    ["图纸", data.drawingsAvailable ? "有" : "无"],
    ["交期要求", data.deadline ?? "-"],
    ["目标价格", data.targetPrice ? `¥${data.targetPrice.toLocaleString()}` : "-"],
    ["线索评分", `${data.score}/100`],
    ["建议动作", data.action],
  ];

  const bodyHtml = `
    <p style="color:#374151;font-size:14px;">有一条新的询价需要您跟进处理。</p>
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
       style="display:inline-block;margin-top:8px;padding:12px 20px;background:#e8500e;color:#ffffff;text-decoration:none;font-size:14px;border-radius:4px;">在 CRM 中打开</a>`;

  await transport.sendMail({
    from: `"${site.brand}" <${process.env.SMTP_USER ?? site.email}>`,
    to: site.salesTeamEmails.join(", "),
    subject: `[询价 ${data.score}/100] ${data.company} - ${data.materials.join("/")}`,
    html: wrap(site, `新询价 - 线索评分 ${data.score}/100（${data.action}）`, bodyHtml, emailLogId ? trackingPixel(site, emailLogId) : ""),
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
    <p style="color:#374151;font-size:14px;">${escapeHtml(data.name)}，您好：</p>
    <p style="color:#374151;font-size:14px;">
      我们已收到您的报价请求 <strong>${escapeHtml(data.rfqId)}</strong>。工程师团队将尽快审核您的需求，
      并在 2 个工作日内给出正式报价方案。
    </p>
    <p style="color:#374151;font-size:14px;">您也可以直接在网站上与我们的团队在线沟通，或回复本邮件补充图纸与需求。</p>
    <p style="color:#6b7280;font-size:13px;">此致敬礼，<br/>${site.brand} 工程团队</p>`;

  await transport.sendMail({
    from: `"${site.brand}" <${process.env.SMTP_USER ?? site.email}>`,
    to: data.to,
    subject: `我们已收到您的报价请求 ${data.rfqId}`,
    html: wrap(site, "报价请求已收到", bodyHtml, emailLogId ? trackingPixel(site, emailLogId) : ""),
  });
  return true;
}
