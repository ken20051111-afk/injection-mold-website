import { notFound } from "next/navigation";
import { getCapabilityContent, listCapabilities } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Badge, Breadcrumb, Button, Card, Container, SpecTable } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const cap = await getCapabilityContent(slug);
  if (!cap) return {};
  return buildMetadata({
    title: cap.name,
    description: cap.shortDescription,
    path: `/capabilities/${cap.slug}`,
    keywords: [cap.name, cap.keyword, "注塑模具", "模具制造能力"],
  });
}

export async function generateStaticParams() {
  return (await listCapabilities()).map((c) => ({ slug: c.slug }));
}

export default async function CapabilityPage({ params }: PageProps) {
  const { slug } = await params;
  const [cap, caps, site] = await Promise.all([
    getCapabilityContent(slug),
    listCapabilities(),
    getSite(),
  ]);
  if (!cap) notFound();

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: cap.name,
    provider: {
      "@type": "Organization",
      name: site.legalName,
      url: site.domain,
    },
    description: cap.shortDescription,
    areaServed: "全球",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: cap.name,
      itemListElement: cap.specs.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.label,
          description: s.value,
        },
      })),
    },
    offers: {
      "@type": "Offer",
      description: "定制注塑模具制造",
      priceCurrency: "CNY",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: site.domain },
      { "@type": "ListItem", position: 2, name: "核心能力", item: `${site.domain}/capabilities` },
      { "@type": "ListItem", position: 3, name: cap.name },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cap.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <Container className="py-14">
      <JsonLd data={[pageJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "核心能力", href: "/capabilities" },
          { label: cap.name },
        ]}
      />

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">{cap.keyword}</p>
          <h1 className="mt-2 text-4xl font-black text-steel-900">{cap.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{cap.description}</p>

          <h2 className="mt-10 text-xl font-bold text-steel-900">关键技术规格</h2>
          <div className="mt-4">
            <SpecTable rows={cap.specs} />
          </div>

          <h2 className="mt-10 text-xl font-bold text-steel-900">典型应用</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {cap.applications.map((app) => (
              <Badge key={app} tone="steel">
                {app}
              </Badge>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-bold text-steel-900">常见问题</h2>
          <div className="mt-4 space-y-4">
            {cap.faqs.map((f) => (
              <Card key={f.question} className="p-5">
                <h3 className="font-bold text-steel-900">{f.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <Card className="bg-steel-900 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              {cap.name} 报价咨询
            </p>
            <p className="mt-3 text-sm text-slate-300">
              发送您的 3D 模型与需求，24 小时内给出 DFM 评审与估算。
            </p>
            <Button href="/quote" className="mt-5 w-full">
              获取报价
            </Button>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">其他能力</p>
            <ul className="mt-3 space-y-2">
              {caps
                .filter((c) => c.slug !== cap.slug)
                .map((c) => (
                  <li key={c.slug}>
                    <a href={`/capabilities/${c.slug}`} className="text-sm text-slate-600 hover:text-accent-500">
                      {c.name} &rarr;
                    </a>
                  </li>
                ))}
            </ul>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
