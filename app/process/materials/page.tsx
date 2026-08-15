import { materials } from "@/data/materials";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "Injection Molding Materials Guide",
    description:
      "Plastic resin selection guide for injection molds: ABS, PC, PC/ABS, PP, PA, POM, PEEK and more with shrink rates and applications.",
    path: "/process/materials",
  });
}

export default function MaterialsPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Process"
        title="Injection Molding Materials Guide"
        description="Material choice drives mold design, shrink compensation and cycle time. This table covers the resins we mold most."
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Key Properties</th>
              <th className="px-4 py-3">Applications</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Shrink</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m.shortName} className="border-b border-slate-100 odd:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-steel-700">
                  {m.shortName}
                  <span className="block text-xs font-normal text-slate-400">{m.name}</span>
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-1 text-slate-600">
                    {m.properties.map((p) => (
                      <li key={p}>&middot; {p}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 text-slate-600">{m.applications.join(", ")}</td>
                <td className="px-4 py-3 text-slate-600">{m.costIndex}</td>
                <td className="px-4 py-3 text-slate-600">{m.shrink}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="mt-8 bg-steel-900 p-6 text-white">
        <p className="font-bold">Not sure which material fits?</p>
        <p className="mt-2 text-sm text-slate-300">
          Our engineers pick materials against your application, environment and budget during the
          DFM review.
        </p>
        <Button href="/quote" className="mt-5">
          Ask our engineers
        </Button>
      </Card>
    </Container>
  );
}
