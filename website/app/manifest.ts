import type { MetadataRoute } from "next";
import { getSite } from "@/lib/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSite();
  return {
    name: site.brand,
    short_name: site.brand.replace(" ", ""),
    description: site.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#0b1220",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
