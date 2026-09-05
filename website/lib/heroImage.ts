import { cache } from "react";
import { prisma } from "./db";

export type HeroImage = {
  mimeType: string;
  data: string;
};

let warned = false;

export const getHeroImage = cache(async (): Promise<HeroImage | null> => {
  try {
    const row = await prisma.systemSetting.findUnique({ where: { key: "siteHeroImage" } });
    const v = (row?.value ?? null) as { mimeType?: string; data?: string } | null;
    if (v && typeof v.data === "string" && v.data.length > 0) {
      return { mimeType: typeof v.mimeType === "string" ? v.mimeType : "image/jpeg", data: v.data };
    }
    return null;
  } catch (e) {
    if (!warned) {
      console.warn("Hero image DB unavailable, showing none:", e);
      warned = true;
    }
    return null;
  }
});