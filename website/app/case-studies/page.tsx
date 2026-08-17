import { listCaseStudies } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";
import { getSite } from "@/lib/settings";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata({
    title: "注塑模具案例",
    description:
      "真实注塑模具项目：为汽车、医疗与电动工具客户实现的项目交期、型腔精度、周期缩短与模具寿命。",
    path: "/case-studies",
    keywords: ["注塑模具案例", "模具项目案例", "汽车模具案例", "医疗模具案例", "模具交付案例"],
  });
}

export default async function CaseStudiesPage() {
  const [cases, site] = await Promise.all([listCaseStudies(), getSite()]);

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cases.map((cs, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.domain}/case-studies/${cs.slug}`,
      name: cs.title,
    })),
  };

  return (
    <Container className="py-14">
      <JsonLd data={listJsonLd} />
      <SectionHeading
        eyebrow="客户见证"
        title="案例研究"
        description="在真实期限压力下交付的项目——并且有数据支撑。"
        as="h1"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((cs) => (
          <Card key={cs.slug} className="flex flex-col p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500">{cs.industry}</p>
            <h2 className="mt-2 text-base font-bold leading-snug text-steel-900">{cs.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{cs.challenge.slice(0, 140)}...</p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              {cs.results.slice(0, 2).map((r) => (
                <div key={r.label}>
                  <p className="text-lg font-black text-steel-900">{r.value}</p>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">{r.label}</p>
                </div>
              ))}
            </div>
            <Button href={`/case-studies/${cs.slug}`} size="sm" className="mt-5 self-start">
              阅读完整案例
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
