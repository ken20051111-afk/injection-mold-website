import { listIndustries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Badge, Button, Card, Container, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata({
    title: "服务行业",
    description:
      "为汽车、医疗、消费电子、包装与电动工具行业提供注塑模具——按各行业标准精心制造。",
    path: "/industries",
    keywords: ["注塑模具行业", "汽车注塑模具", "医疗注塑模具", "电子注塑模具", "包装注塑模具", "电动工具模具"],
  });
}

export default async function IndustriesPage() {
  const [inds, site] = await Promise.all([listIndustries(), getSite()]);

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: inds.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${site.domain}/industries/${i.slug}`,
      name: `${i.name} 注塑模具`,
    })),
  };

  return (
    <Container className="py-14">
      <JsonLd data={listJsonLd} />
      <SectionHeading
        eyebrow="行业应用"
        title="我们服务的行业"
        description="每个行业都有自己的标准、材料与验证要求，我们的模具制造以此为准。"
        as="h1"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {inds.map((ind) => (
          <Card key={ind.slug} className="flex flex-col p-7 transition-shadow hover:shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500">{ind.keyword}</p>
            <h2 className="mt-2 text-xl font-bold text-steel-900">{ind.name} 模具</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{ind.shortDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ind.standards.map((s) => (
                <Badge key={s} tone="steel">
                  {s}
                </Badge>
              ))}
            </div>
            <Button href={`/industries/${ind.slug}`} variant="ghost" size="sm" className="mt-5 self-start">
              查看能力 &rarr;
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
