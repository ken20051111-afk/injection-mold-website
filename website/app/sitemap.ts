import type { MetadataRoute } from "next";
import { getSite } from "@/lib/settings";
import { listCapabilities, listIndustries, listCaseStudies, listPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

const staticRoutes = [
  "", "/capabilities", "/industries", "/process", "/process/tolerances",
  "/process/materials", "/process/surface-finishes", "/process/machine-list",
  "/process/dfm-guide", "/case-studies", "/resources", "/resources/blog",
  "/resources/quoting-guide", "/about", "/quote", "/contact", "/faq",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const site = await getSite();

  const statics: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${site.domain}${path}`,
    lastModified: now,
    changeFrequency: path === "/faq" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/faq" ? 0.95 : 0.8,
  }));

  const [caps, inds, cases, blog] = await Promise.all([
    listCapabilities(),
    listIndustries(),
    listCaseStudies(),
    listPosts(),
  ]);

  const capEntries: MetadataRoute.Sitemap = caps.map((c) => ({
    url: `${site.domain}/capabilities/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const indEntries: MetadataRoute.Sitemap = inds.map((i) => ({
    url: `${site.domain}/industries/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const caseEntries: MetadataRoute.Sitemap = cases.map((c) => ({
    url: `${site.domain}/case-studies/${c.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blog.map((p) => ({
    url: `${site.domain}/resources/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...statics, ...capEntries, ...indEntries, ...caseEntries, ...blogEntries];
}
