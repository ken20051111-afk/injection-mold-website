import { notFound } from "next/navigation";
import { getCaseStudyContent, listCaseStudies } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Breadcrumb, Button, Card, Container, SpecTable } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const cs = await getCaseStudyContent(slug);
  if (!cs) return {};
  return buildMetadata({
    title: cs.title,
    description: cs.challenge.slice(0, 150),
    path: `/case-studies/${cs.slug}`,
    keywords: [cs.title, cs.industry, "注塑模具案例", "模具项目案例"],
  });
}

export async function generateStaticParams() {
  return (await listCaseStudies()).map((c) => ({ slug: c.slug }));
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const [cs, site] = await Promise.all([getCaseStudyContent(slug), getSite()]);
  if (!cs) notFound();

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: cs.title,
    about: cs.industry,
    provider: { "@type": "Organization", name: site.legalName, url: site.domain },
    description: cs.solution.slice(0, 200),
    result: cs.results.map((r) => `${r.label}: ${r.value}`).join("; "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: site.domain },
      { "@type": "ListItem", position: 2, name: "案例研究", item: `${site.domain}/case-studies` },
      { "@type": "ListItem", position: 3, name: cs.title },
    ],
  };

  return (
    <Container className="py-14">
      <JsonLd data={[pageJsonLd, breadcrumbJsonLd]} />
      <Breadcrumb
        items={[
          { label: "首页", href: "/" },
          { label: "案例研究", href: "/case-studies" },
          { label: cs.title },
        ]}
      />

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">{cs.industry}</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight text-steel-900 lg:text-4xl">
        {cs.title}
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="text-xl font-bold text-steel-900">项目挑战</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{cs.challenge}</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-steel-900">解决方案</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{cs.solution}</p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-bold text-steel-900">交付成果</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {cs.results.map((r) => (
                <Card key={r.label} className="p-5">
                  <p className="text-2xl font-black text-accent-500">{r.value}</p>
                  <p className="mt-1 text-sm font-semibold text-steel-700">{r.label}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <Card className="p-6">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">模具规格</p>
            <SpecTable rows={cs.moldSpecs} />
          </Card>
          <Card className="bg-steel-900 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              与我们一起打造您的项目
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
