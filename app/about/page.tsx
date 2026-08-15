import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  const s = await getSite();
  return buildMetadata({
    title: "About Our Factory",
    description:
      `Meet ${s.brand}: a Dongguan, China injection mold manufacturer founded in ${s.founded}, building ${s.annualMolds}+ molds a year for OEMs in ${s.exportsCountries}+ countries.`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const site = await getSite();
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="About"
        title={`The Factory Behind ${site.brand}`}
        description={`Founded in ${site.founded} in Chang'an, Dongguan - China's tooling capital - we have grown into a ${site.machines}-machine precision mold factory serving the US and Europe.`}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: site.founded, label: "Years building molds" },
          { value: `${site.machines}+`, label: "CNC & EDM machines" },
          { value: site.engineers, label: "Engineers & technicians" },
          { value: `${site.deliveryRate}%`, label: "On-time delivery" },
        ].map((stat) => (
          <Card key={stat.label} className="p-6 text-center">
            <p className="text-3xl font-black text-accent-500">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-steel-700">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-steel-900">Quality Management System</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Our QMS is certified to ISO 9001:2015, IATF 16949 and ISO 14001. Automotive programs run
            APQP with PPAP Level 3 documentation and IMDS submissions. Every cavity is CMM-inspected
            before the mold leaves our floor.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {site.certifications.map((c) => (
              <span key={c} className="rounded-sm border border-accent-500/40 bg-accent-500/10 px-3 py-1.5 text-xs font-bold text-accent-500">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-steel-900">Who We Work With</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            German Tier-1 automotive suppliers, US medical device OEMs, European packaging brands and
            power tool manufacturers. Customers stay with us for the same three reasons: transparent
            engineering communication, CMM-verified quality and a delivery record we publish.
          </p>
        </div>
      </div>

      <Card className="mt-12 bg-steel-900 p-8 text-white">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Visit us or send your drawing</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {site.address} &middot; {site.phone} &middot; {site.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Button href="/quote" size="lg">
              Request a Quote
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              Contact Us
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}
