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
    ["SMTP_HOST", "Email (SMTP)", "RFQ alerts & customer confirmations"],
    ["OPENAI_API_KEY", "OpenAI", "AI lead scoring, chat & knowledge embeddings"],
    ["SLACK_WEBHOOK_URL", "Slack", "New-RFQ push notifications"],
    ["WECOM_WEBHOOK_URL", "WeCom (WeChat Work)", "New-RFQ push notifications"],
    ["CRM_PASSWORD", "Admin / CRM password", "Protects /admin and /crm"],
  ];
  return rows.map(([envKey, label, detail]) => ({
    envKey,
    label,
    detail,
    configured: Boolean(process.env[envKey]),
  }));
}
