import { getSite } from "./settings";

export type RfqNotification = {
  rfqId: string;
  company: string;
  contact: string;
  email?: string;
  country?: string;
  materials: string[];
  annualVolume?: number;
  cavityTarget?: number;
  drawingsAvailable?: boolean;
  deadline?: string;
  score: number;
  action: string;
};

async function buildSummary(data: RfqNotification): Promise<string> {
  const site = await getSite();
  const lines = [
    `[新询价 RFQ] ${data.company} (${data.country ?? "未知国家"})`,
    `联系人: ${data.contact}${data.email ? ` <${data.email}>` : ""}`,
    `材料: ${data.materials.join("/") || "-"}`,
    data.annualVolume ? `年用量: ${data.annualVolume.toLocaleString()}` : null,
    data.cavityTarget ? `腔数: ${data.cavityTarget}` : null,
    data.drawingsAvailable ? "有图纸" : null,
    data.deadline ? `目标交期: ${data.deadline}` : null,
    `评分: ${data.score}/100 (建议: ${data.action})`,
    `链接: ${site.domain}/crm/rfqs/${data.rfqId}`,
  ].filter(Boolean);
  return lines.join("\n");
}

async function postJson(url: string, body: unknown): Promise<boolean> {
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`Webhook notify failed: ${res.status}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Webhook notify error:", e);
    return false;
  }
}

export async function notifySalesTeam(data: RfqNotification): Promise<void> {
  const summary = await buildSummary(data);

  await Promise.all([
    postJson(process.env.SLACK_WEBHOOK_URL ?? "", {
      text: summary,
    }),
    postJson(process.env.WECOM_WEBHOOK_URL ?? "", {
      msgtype: "markdown",
      markdown: {
        content: summary.replace(/\n/g, "\n> ").slice(0, 4000),
      },
    }),
  ]);
}
