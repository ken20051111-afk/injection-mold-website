import { notFound } from "next/navigation";
import { getIndustryContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Badge, Breadcrumb, Button, Card, Container } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const ind = await getIndustryContent(slug);
  if (!ind) return {};
  return buildMetadata({
    title: `${ind.name} 注塑模具`,
    description: ind.shortDescription,
    path: `/industries/${ind.slug}`,
    keywords: [ind.name, `${ind.name}注塑模具`, `${ind.name}模具`, "注塑模具", "模具定制"],
  });
}

export async function generateStaticParams() {
  const { listIndustries } = await import("@/lib/content");
  return (await listIndustries()).map((i) => ({ slug: i.slug }));
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const [ind, site] = await Promise.all([getIndustryContent(slug), getSite()]);
  if (!ind) notFound();

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${ind.name} 注塑成型`,
    provider: {
      "@type": "Organization",
      name: site.legalName,
      url: site.domain,
    },
    description: ind.shortDescription,
    areaServed: "全球",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${ind.name} 注塑零件`,
      itemListElement: ind.typicalParts.map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: p,
        },
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: site.domain },
      { "@type": "ListItem", position: 2, name: "行业应用", item: `${site.domain}/industries` },
      { "@type": "ListItem", position: 3, name: ind.name },
    ],
  };

  return (
    <Container className="py-14">
      <JsonLd data={[pageJsonLd, breadcrumbJsonLd]} />
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "行业应用", href: "/industries" },
          { label: ind.name },
        ]}
      />
      {ind.heroImage && (
        <figure className="mt-8 overflow-hidden rounded-lg border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ind.heroImage}
            alt={`${ind.name} 注塑模具`}
            className="h-52 w-full object-cover sm:h-72 lg:h-96"
          />
        </figure>
      )}
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">{ind.keyword}</p>
          <h1 className="mt-2 text-4xl font-black text-steel-900">{ind.name} 注塑模具</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{ind.description}</p>

          <h2 className="mt-10 text-xl font-bold text-steel-900">典型零件</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {ind.typicalParts.map((p) => (
              <Badge key={p} tone="steel">
                {p}
              </Badge>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-bold text-steel-900">合规与标准</h2>
          <ul className="mt-4 space-y-2">
            {ind.standards.map((s) => (
              <li key={s} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] text-white">&#10003;</span>
                {s}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-xl font-bold text-steel-900">可成型材料</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {ind.materials.map((m) => (
              <Badge key={m}>{m}</Badge>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <Card className="bg-steel-900 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              {ind.name} 项目？
            </p>
            <p className="mt-3 text-sm text-slate-300">
              告诉我们您的零件与标准，我们处理 APQP、PPAP 与 IMDS 文档。
            </p>
            <Button href="/quote" className="mt-5 w-full">
              获取报价
            </Button>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
