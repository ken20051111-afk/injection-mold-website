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
    title: `${ind.name} Injection Molds`,
    description: ind.shortDescription,
    path: `/industries/${ind.slug}`,
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
    serviceType: `${ind.name} injection molding`,
    provider: { "@type": "Organization", name: site.legalName },
    description: ind.shortDescription,
  };

  return (
    <Container className="py-14">
      <JsonLd data={pageJsonLd} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: ind.name },
        ]}
      />
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">{ind.keyword}</p>
          <h1 className="mt-2 text-4xl font-black text-steel-900">{ind.name} Injection Molds</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{ind.description}</p>

          <h2 className="mt-10 text-xl font-bold text-steel-900">Typical Parts</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {ind.typicalParts.map((p) => (
              <Badge key={p} tone="steel">
                {p}
              </Badge>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-bold text-steel-900">Compliance & Standards</h2>
          <ul className="mt-4 space-y-2">
            {ind.standards.map((s) => (
              <li key={s} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] text-white">&#10003;</span>
                {s}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-xl font-bold text-steel-900">Materials We Mold</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {ind.materials.map((m) => (
              <Badge key={m}>{m}</Badge>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <Card className="bg-steel-900 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              {ind.name} program?
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Tell us your part and standards. We handle APQP, PPAP and IMDS documentation.
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
