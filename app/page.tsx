import { listCapabilities, listCaseStudies } from "@/lib/content";
import { companyFacts } from "@/lib/site";
import { getSite } from "@/lib/settings";
import { Button, Card, Container, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export default async function HomePage() {
  const [caps, cases, site] = await Promise.all([
    listCapabilities(),
    listCaseStudies(),
    getSite(),
  ]);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand,
    url: site.domain,
  };

  return (
    <>
      <JsonLd data={pageJsonLd} />
      <section className="grid-pattern bg-steel-900 text-white">
        <Container className="py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-sm border border-accent-500/40 bg-accent-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-400">
              ISO 9001 &middot; IATF 16949 &middot; Dongguan, China
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Precision Injection Molds That Ship On Time,{" "}
              <span className="text-accent-400">Every Time</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              {site.annualMolds}+ molds built each year for automotive, medical, electronics and
              packaging programs in {site.exportsCountries}+ countries. Engineering review within
              24 hours, gold samples in {site.leadTimeWeeks} weeks.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/quote" size="lg">
                Get a Quote in 24h
              </Button>
              <Button href="/capabilities" size="lg" variant="secondary">
                Explore Capabilities
              </Button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-steel-700 bg-steel-700 sm:grid-cols-4">
            {companyFacts.map((fact) => (
              <div key={fact.label} className="bg-steel-800 p-6">
                <p className="text-3xl font-black text-white">
                  {fact.value.toLocaleString()}
                  {fact.suffix}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="Injection Molds Built for Production"
            description="From prototype to 128-cavity production tooling, engineered and validated in one facility."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {caps.map((cap) => (
              <Card key={cap.slug} className="group flex flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent-500">
                  {cap.specs[0]?.value}
                </p>
                <h3 className="text-lg font-bold text-steel-900 group-hover:text-accent-500">
                  {cap.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {cap.shortDescription}
                </p>
                <Button href={`/capabilities/${cap.slug}`} variant="ghost" size="sm" className="mt-4 self-start">
                  Learn more &rarr;
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-steel-900 py-16 text-white lg:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Why MoldCraft"
                title="One Factory. Zero Surprises."
                description="Engineering, machining, sampling and inspection under one roof - so your program is never hostage to a subcontractor."
              />
              <ul className="space-y-4">
                {[
                  ["24h engineering response", "DFM feedback on gating, draft and tolerances within one business day"],
                  ["CMM-verified every cavity", "Dimensional reports shipped with every mold, not on request"],
                  [`${site.deliveryRate}% on-time delivery`, "Program management with weekly status reports"],
                  ["12-month mold warranty", "Free design reviews and lifetime technical support"],
                ].map(([title, desc]) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                      &#10003;
                    </span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-slate-400">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-steel-700 bg-steel-800 p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
                Lead time reality check
              </p>
              <dl className="mt-6 space-y-5">
                {[
                  ["Prototype mold", `${site.leadTimeWeeks - 1} - 4 weeks`],
                  ["Precision production mold", "5 - 6 weeks"],
                  ["Multi-cavity / two-shot", "6 - 8 weeks"],
                  ["Stack molds", "8 - 10 weeks"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between border-b border-steel-700 pb-3 last:border-0">
                    <dt className="text-sm text-slate-400">{label}</dt>
                    <dd className="font-bold text-white">{value}</dd>
                  </div>
                ))}
              </dl>
              <Button href="/process" variant="secondary" className="mt-8 w-full">
                View Full Process Capability
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Proof"
            title="Programs Delivered Under Pressure"
            description="Real tooling programs with the results we shipped."
            align="center"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {cases.map((cs) => (
              <Card key={cs.slug} className="flex flex-col p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                  {cs.industry}
                </p>
                <h3 className="mt-2 text-base font-bold leading-snug text-steel-900">{cs.title}</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {cs.results.slice(0, 4).map((r) => (
                    <div key={r.label}>
                      <p className="text-lg font-black text-steel-900">{r.value}</p>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">{r.label}</p>
                    </div>
                  ))}
                </div>
                <Button href={`/case-studies/${cs.slug}`} variant="ghost" size="sm" className="mt-5 self-start">
                  Read case study &rarr;
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16 lg:py-20">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold text-steel-900">Ready to quote your mold?</h2>
            <p className="max-w-xl text-slate-600">
              Send your 3D model and requirements. Our engineers will return a DFM review and
              cost estimate within 24 hours - free and without obligation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/quote" size="lg">
                Request a Quote
              </Button>
              <Button href="/resources/blog/injection-mold-cost-guide" size="lg" variant="secondary">
                Read the Mold Cost Guide
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
