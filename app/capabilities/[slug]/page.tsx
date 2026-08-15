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
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      description: "Custom injection mold manufacturing",
      priceCurrency: "USD",
    },
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
      <JsonLd data={[pageJsonLd, faqJsonLd]} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Capabilities", href: "/capabilities" },
          { label: cap.name },
        ]}
      />

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">{cap.keyword}</p>
          <h1 className="mt-2 text-4xl font-black text-steel-900">{cap.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{cap.description}</p>

          <h2 className="mt-10 text-xl font-bold text-steel-900">Key Specifications</h2>
          <div className="mt-4">
            <SpecTable rows={cap.specs} />
          </div>

          <h2 className="mt-10 text-xl font-bold text-steel-900">Typical Applications</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {cap.applications.map((app) => (
              <Badge key={app} tone="steel">
                {app}
              </Badge>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-bold text-steel-900">Frequently Asked Questions</h2>
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
              Get a quote for {cap.name}
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Send your 3D model and requirements. DFM review and estimate within 24 hours.
            </p>
            <Button href="/quote" className="mt-5 w-full">
              Request a Quote
            </Button>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Other capabilities</p>
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
