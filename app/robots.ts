import type { MetadataRoute } from "next";
import { getSite } from "@/lib/settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/crm", "/api/"],
      },
    ],
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
