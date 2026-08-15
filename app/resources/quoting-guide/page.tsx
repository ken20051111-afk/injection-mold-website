import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "Mold Quoting Guide",
    description:
      "How to structure an RFQ for injection molds so suppliers quote accurately the first time: drawings, materials, volumes, and what affects price.",
    path: "/resources/quoting-guide",
  });
}

const steps = [
  {
    title: "Prepare complete drawings",
    detail:
      "Send the STEP/IGES 3D model plus a 2D PDF with critical tolerances and surface finish callouts. Incomplete files make every supplier pad the quote.",
  },
  {
    title: "State the annual volume",
    detail:
      "Volume decides cavity count and steel grade - the two biggest price drivers. Give realistic annual volume, not a vague 'high volume'.",
  },
  {
    title: "Name the material",
    detail:
      "Specify the exact resin grade (e.g. PC/ABS Bayer T85). If unsure, describe the application and environment and let the mold maker recommend.",
  },
  {
    title: "Set the mold life expectation",
    detail:
      "100k-shot prototype and 2M-shot production tool are different products. Tell us the target, we will size steel and design accordingly.",
  },
  {
    title: "Give your deadline",
    detail:
      "A realistic deadline lets us schedule machining capacity. Emergency programs carry a surcharge - plan 3-6 weeks for standard molds.",
  },
  {
    title: "Compare like-for-like",
    detail:
      "Ask every supplier for the same specification sheet: cavity count, steel grade, hot runner brand, mold life, delivery. Then compare apples to apples.",
  },
];

export default function QuotingGuidePage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Guide"
        title="The Mold Quoting Guide"
        description="Six steps to get an accurate, comparable injection mold quote from any supplier - including us."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {steps.map((step, i) => (
          <Card key={step.title} className="flex gap-4 p-6">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent-500 text-sm font-black text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-bold text-steel-900">{step.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.detail}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button href="/quote" size="lg">
          Start your RFQ now
        </Button>
      </div>
    </Container>
  );
}
