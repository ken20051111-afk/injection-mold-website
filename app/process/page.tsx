import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "Injection Mold Process & Specifications",
    description:
      "Tolerances, materials, surface finishes, machine list and DFM guidelines for custom injection molds built in Dongguan, China.",
    path: "/process",
  });
}

const sections = [
  {
    title: "Tolerances",
    href: "/process/tolerances",
    desc: "Standard and precision dimensional tolerance control, validated by CMM.",
  },
  {
    title: "Materials Guide",
    href: "/process/materials",
    desc: "Plastic resin selection with properties, shrink rates and applications.",
  },
  {
    title: "Surface Finishes",
    href: "/process/surface-finishes",
    desc: "SPI grades A1-D3 and VDI textures with roughness values.",
  },
  {
    title: "Machine List",
    href: "/process/machine-list",
    desc: "Our CNC, EDM, grinding, injection molding and inspection equipment.",
  },
  {
    title: "DFM Guide",
    href: "/process/dfm-guide",
    desc: "Design for manufacturability rules that cut mold cost and lead time.",
  },
];

export default function ProcessPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Process"
        title="Engineering & Manufacturing Process"
        description="Five references every buyer should read before sending a drawing - they set expectations for what your mold can achieve."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.href} className="flex flex-col p-6">
            <h2 className="text-lg font-bold text-steel-900">{s.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            <Button href={s.href} variant="ghost" size="sm" className="mt-4 self-start">
              Read more &rarr;
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
