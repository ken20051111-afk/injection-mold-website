import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNav } from "@/lib/nav";
import { getSite } from "@/lib/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(site.domain),
    title: {
      default: `${site.brand} | ${site.tagline}`,
      template: `%s | ${site.brand}`,
    },
    description: `${site.brand} is a certified injection mold manufacturer in China building precision, multi-cavity, two-shot and gas-assisted molds for automotive, medical and electronics customers worldwide. ISO 9001 / IATF 16949.`,
    keywords: [
      "injection mold manufacturer",
      "plastic injection mold maker China",
      "precision injection mold",
      "multi-cavity mold",
      "two-shot molding",
      "custom injection mold supplier",
    ],
    openGraph: {
      title: `${site.brand} | ${site.tagline}`,
      description:
        "Certified injection mold manufacturer in Dongguan, China. Precision, multi-cavity, two-shot and gas-assisted molds for global OEMs.",
      url: site.domain,
      siteName: site.brand,
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [nav, site] = await Promise.all([getNav(), getSite()]);
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    url: site.domain,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressCountry: "CN",
    },
    foundingDate: String(site.founded),
  };
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={orgJsonLd} />
        <Header nav={nav} brand={site.brand} />
        <main className="flex-1">{children}</main>
        <Footer nav={nav} site={site} />
        <ChatWidget />
      </body>
    </html>
  );
}
