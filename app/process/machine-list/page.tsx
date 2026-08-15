import { machines, productionLines } from "@/data/machines";
import { buildMetadata } from "@/lib/seo";
import { Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "Injection Mold Factory Equipment",
    description:
      "MoldCraft's machine list: 5-axis CNC, wire and sinker EDM, precision grinding, 80-1,500 ton injection molding and CMM inspection.",
    path: "/process/machine-list",
  });
}

export default function MachineListPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Process"
        title="Factory Equipment"
        description="In-house machining, molding and inspection means no outsourcing steps in your mold program."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {machines.map((m) => (
          <Card key={m.category} className="p-6">
            <p className="text-3xl font-black text-accent-500">{m.count}</p>
            <h2 className="mt-1 font-bold text-steel-900">{m.category} Machines</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.detail}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-xl font-bold text-steel-900">Production Lines</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {productionLines.map((line) => (
          <Card key={line.name} className="p-6">
            <h3 className="font-bold text-steel-900">{line.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{line.detail}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
