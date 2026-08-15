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
    provider: { "@type": "Organization", name: site.legalName },
    description: cs.solution.slice(0, 200),
  };

  return (
    <Container className="py-14">
      <JsonLd data={pageJsonLd} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
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
            <h2 className="text-xl font-bold text-steel-900">The Challenge</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{cs.challenge}</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-steel-900">The Solution</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{cs.solution}</p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-bold text-steel-900">Results Delivered</h2>
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
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Mold Specifications</p>
            <SpecTable rows={cs.moldSpecs} />
          </Card>
          <Card className="bg-steel-900 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              Build your program with us
            </p>
            <Button href="/quote" className="mt-5 w-full">
              Request a Quote
            </Button>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
