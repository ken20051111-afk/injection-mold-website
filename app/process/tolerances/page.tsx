import { tolerances } from "@/data/materials";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "Injection Mold Tolerances",
    description:
      "Standard and precision injection mold dimensional tolerances held by MoldCraft, verified with CMM on every cavity.",
    path: "/process/tolerances",
  });
}

export default function TolerancesPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Process"
        title="Dimensional Tolerance Capability"
        description="Tolerance is a cost driver. Specify only the tolerances your assembly actually needs, and we will hold the rest at standard cost."
      />
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">Feature</th>
              <th className="px-4 py-3">Standard</th>
              <th className="px-4 py-3">Precision</th>
            </tr>
          </thead>
          <tbody>
            {tolerances.map((t) => (
              <tr key={t.feature} className="border-b border-slate-100 last:border-0 odd:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-steel-700">{t.feature}</td>
                <td className="px-4 py-3 text-slate-600">{t.standard}</td>
                <td className="px-4 py-3 text-slate-600">{t.precision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="mt-8 bg-steel-900 p-6 text-white">
        <p className="font-bold">Note on precision pricing</p>
        <p className="mt-2 text-sm text-slate-300">
          Precision (+/-0.005 mm) adds machining and CMM verification time. We flag precision-only
          dimensions in our DFM review so you never pay for tolerance you do not use.
        </p>
        <Button href="/quote" className="mt-5">
          Discuss your tolerance requirements
        </Button>
      </Card>
    </Container>
  );
}
