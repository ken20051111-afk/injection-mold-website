import { surfaceFinishes, steelGrades } from "@/data/materials";
import { buildMetadata } from "@/lib/seo";
import { Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "注塑模具表面处理",
    description:
      "注塑模具 SPI 表面等级 A1 至 D3 与 VDI 纹面，含 Ra 粗糙度数值与典型应用。",
    path: "/process/surface-finishes",
    keywords: ["模具表面处理", "SPI光洁度", "VDI纹面", "模具抛光", "表面粗糙度"],
  });
}

export default function SurfaceFinishesPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="工艺"
        title="表面处理标准"
        description="选择您零件所需的表面效果。以下每个等级均可在厂内完成，从镜面抛光到模内纹理。"
      />

      <h2 className="mb-4 text-xl font-bold text-steel-900">SPI 表面等级</h2>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">等级</th>
              <th className="px-4 py-3">表面效果</th>
              <th className="px-4 py-3">粗糙度</th>
              <th className="px-4 py-3">典型应用</th>
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

      <h2 className="mb-4 mt-12 text-xl font-bold text-steel-900">模具钢种</h2>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">钢种</th>
              <th className="px-4 py-3">硬度</th>
              <th className="px-4 py-3">最佳用途</th>
              <th className="px-4 py-3">预期寿命</th>
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
