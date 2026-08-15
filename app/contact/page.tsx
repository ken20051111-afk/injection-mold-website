import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Card, Container, SectionHeading } from "@/components/ui";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata() {
  const s = await getSite();
  return buildMetadata({
    title: "Contact Us",
    description:
      `Contact ${s.brand} for injection mold quotes, engineering questions or factory visits. ${s.phone} - ${s.email}.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const site = await getSite();
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact",
    url: `${site.domain}/contact`,
    about: `Contact the ${site.brand} engineering team`,
  };
  return (
    <Container className="py-14">
      <JsonLd data={contactJsonLd} />
      <SectionHeading
        eyebrow="Contact"
        title="Talk to an Engineer, Not a Salesperson"
        description="Your message goes straight to the engineering team. We reply within one business day."
      />
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Factory</p>
            <p className="mt-2 text-sm text-slate-600">{site.address}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Phone</p>
            <p className="mt-2 text-sm text-slate-600">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-accent-500">{site.phone}</a>
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Email</p>
            <p className="mt-2 text-sm text-slate-600">
              <a href={`mailto:${site.email}`} className="hover:text-accent-500">{site.email}</a>
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Working hours</p>
            <p className="mt-2 text-sm text-slate-600">Mon - Sat, 8:00 - 20:00 (GMT+8)</p>
            <p className="mt-1 text-xs text-slate-400">24h response to quote requests</p>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="p-6 sm:p-8">
            <ContactForm />
          </Card>
        </div>
      </div>
    </Container>
  );
}
