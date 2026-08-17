import type { Metadata } from "next";
import { getSite } from "./settings";

export async function buildMetadata({
  title,
  description,
  path,
  noindex,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  keywords?: string[];
}): Promise<Metadata> {
  const site = await getSite();
  return {
    title: `${title} | ${site.brand}`,
    description,
    keywords,
    alternates: {
      canonical: `${site.domain}${path}`,
      languages: site.locales.reduce<Record<string, string>>(
        (acc, locale) => {
          acc[locale] = `${site.domain}/${locale}${path === "/" ? "" : path}`;
          return acc;
        },
        {},
      ),
    },
    openGraph: {
      title: `${title} | ${site.brand}`,
      description,
      url: `${site.domain}${path}`,
      type: "website",
      siteName: site.brand,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
