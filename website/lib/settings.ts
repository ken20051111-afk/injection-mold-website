import { cache } from "react";
import { prisma } from "./db";
import { site as siteDefaults } from "./site";
import type { Prisma } from "../generated/prisma/client";

export type SiteConfig = {
  brand: string;
  legalName: string;
  tagline: string;
  domain: string;
  defaultLocale: string;
  locales: string[];
  address: string;
  phone: string;
  email: string;
  salesTeamEmails: string[];
  founded: number;
  machines: number;
  engineers: number;
  annualMolds: number;
  exportsCountries: number;
  certifications: string[];
  leadTimeWeeks: number;
  deliveryRate: number;
  heroImage: string;
};

let siteWarned = false;

export const getSite = cache(async (): Promise<SiteConfig> => {
  try {
    const row = await prisma.systemSetting.findUnique({ where: { key: "site" } });
    const stored = (row?.value ?? {}) as Record<string, unknown>;
    return { ...siteDefaults, ...stored } as unknown as SiteConfig;
  } catch (e) {
    if (!siteWarned) {
      console.warn("System settings DB unavailable, using built-in defaults:", e);
      siteWarned = true;
    }
    return { ...siteDefaults } as unknown as SiteConfig;
  }
});

export async function saveSite(config: Partial<SiteConfig>): Promise<void> {
  const value = config as unknown as Prisma.InputJsonValue;
  await prisma.systemSetting.upsert({
    where: { key: "site" },
    update: { value },
    create: { key: "site", value },
  });
}

export type IntegrationStatus = {
  envKey: string;
  label: string;
  detail: string;
  configured: boolean;
};

export function getIntegrationStatus(): IntegrationStatus[] {
  const rows: [string, string, string][] = [
    ["SMTP_HOST", "邮件 (SMTP)", "询价提醒与客户回执"],
    ["OPENAI_API_KEY", "OpenAI", "AI 评分、客服与知识库向量"],
    ["SLACK_WEBHOOK_URL", "Slack", "新询价推送通知"],
    ["WECOM_WEBHOOK_URL", "企业微信", "新询价推送通知"],
    ["CRM_PASSWORD", "后台 / CRM 密码", "保护 /admin 与 /crm"],
  ];
  return rows.map(([envKey, label, detail]) => ({
    envKey,
    label,
    detail,
    configured: Boolean(process.env[envKey]),
  }));
}
