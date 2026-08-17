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
    description: `${site.brand} 是中国经认证的注塑模具制造商，为全球汽车、医疗和电子客户制造精密模具、多腔模具、双色模具和气辅模具。ISO 9001 / IATF 16949 认证。`,
    keywords: [
      "注塑模具制造商",
      "注塑模具厂",
      "精密注塑模具",
      "多腔模具",
      "双色注塑",
      "定制注塑模具供应商",
    ],
    openGraph: {
      title: `${site.brand} | ${site.tagline}`,
      description:
        "位于中国东莞的经认证注塑模具制造商，为全球 OEM 客户提供精密、多腔、双色与气辅模具。",
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
      lang="zh-CN"
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
