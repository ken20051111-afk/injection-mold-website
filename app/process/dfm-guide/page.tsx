import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "Injection Mold DFM Guide",
    description:
      "Design for manufacturability rules for injection molding: uniform walls, draft, rib design, gate location and tolerances that cut mold cost.",
    path: "/process/dfm-guide",
  });
}

const rules = [
  {
    title: "Keep wall thickness uniform",
    detail: "Variation between 2.5 mm and 4 mm forces slower cooling and invites sink marks. Uniform walls reduce cycle and tool complexity.",
  },
  {
    title: "Avoid deep, narrow ribs",
    detail: "Rib depth beyond 4x wall thickness requires hardened inserts and longer EDM. Add 0.5-1.0 degrees of draft minimum.",
  },
  {
    title: "Round internal corners",
    detail: "Sharp internal corners become stress risers and need extra machining passes. A 0.5R internal radius is free.",
  },
  {
    title: "Design out undercuts",
    detail: "One slide can add 8-12% to mold cost. Rotate the part, split the parting line or add holes to eliminate slides.",
  },
  {
    title: "Specify realistic tolerances",
    detail: "Every +/-0.005 mm adds CMM verification. Lock only the tolerances that affect fit and function.",
  },
  {
    title: "Decide gate location early",
    detail: "Gate location drives flow, weld lines and cosmetic surfaces. A wrong gate means mold rework.",
  },
  {
    title: "Send STEP + 2D drawings together",
    detail: "Complete geometry lets us quote accurately the first time instead of padding for unknowns.",
  },
  {
    title: "Consider texture early",
    detail: "Texture depth needs added draft. Confirm SPI/VDI texture before steel is cut.",
  },
];

export default function DfmGuidePage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Process"
        title="Design for Manufacturability Guide"
        description="These eight rules remove the most common sources of mold cost and lead time overruns before they reach the tool shop."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {rules.map((rule, i) => (
          <Card key={rule.title} className="flex gap-4 p-6">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent-500 text-sm font-black text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-bold text-steel-900">{rule.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{rule.detail}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="/quote" size="lg">
          Send us your design for a free DFM review
        </Button>
      </div>
    </Container>
  );
}
