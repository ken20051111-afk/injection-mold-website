import { surfaceFinishes, steelGrades } from "@/data/materials";
import { buildMetadata } from "@/lib/seo";
import { Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "Injection Mold Surface Finishes",
    description:
      "SPI surface finish grades A1 to D3 and VDI textures for injection molds, with Ra roughness values and typical applications.",
    path: "/process/surface-finishes",
  });
}

export default function SurfaceFinishesPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Process"
        title="Surface Finish Standards"
        description="Pick the finish your part needs. Every grade below is achievable in-house, from mirror polish to molded-in texture."
      />

      <h2 className="mb-4 text-xl font-bold text-steel-900">SPI Finish Grades</h2>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Finish</th>
              <th className="px-4 py-3">Roughness</th>
              <th className="px-4 py-3">Typical Use</th>
            </tr>
          </thead>
          <tbody>
            {surfaceFinishes.map((f) => (
              <tr key={f.grade} className="border-b border-slate-100 last:border-0 odd:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-steel-700">{f.grade}</td>
                <td className="px-4 py-3 text-slate-600">{f.finish}</td>
                <td className="px-4 py-3 text-slate-600">{f.roughness}</td>
                <td className="px-4 py-3 text-slate-600">{f.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 mt-12 text-xl font-bold text-steel-900">Mold Steel Grades</h2>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Hardness</th>
              <th className="px-4 py-3">Best For</th>
              <th className="px-4 py-3">Expected Life</th>
            </tr>
          </thead>
          <tbody>
            {steelGrades.map((s) => (
              <tr key={s.grade} className="border-b border-slate-100 last:border-0 odd:bg-slate-50/60">
                <td className="px-4 py-3 font-semibold text-steel-700">{s.grade}</td>
                <td className="px-4 py-3 text-slate-600">{s.hardness}</td>
                <td className="px-4 py-3 text-slate-600">{s.use}</td>
                <td className="px-4 py-3 text-slate-600">{s.life}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
