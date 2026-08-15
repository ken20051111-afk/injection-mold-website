import { listIndustries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Badge, Button, Card, Container, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata({
    title: "Industries We Serve",
    description:
      "Injection molds for automotive, medical, consumer electronics, packaging and power tools - engineered to the standards each industry demands.",
    path: "/industries",
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
      name: `${i.name} injection molds`,
    })),
  };

  return (
    <Container className="py-14">
      <JsonLd data={listJsonLd} />
      <SectionHeading
        eyebrow="Industries"
        title="Industries We Serve"
        description="Every industry has its own standards, materials and validation expectations. Our tooling is engineered to meet them."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {inds.map((ind) => (
          <Card key={ind.slug} className="flex flex-col p-7 transition-shadow hover:shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500">{ind.keyword}</p>
            <h2 className="mt-2 text-xl font-bold text-steel-900">{ind.name} Molds</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{ind.shortDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ind.standards.map((s) => (
                <Badge key={s} tone="steel">
                  {s}
                </Badge>
              ))}
            </div>
            <Button href={`/industries/${ind.slug}`} variant="ghost" size="sm" className="mt-5 self-start">
              View capabilities &rarr;
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
