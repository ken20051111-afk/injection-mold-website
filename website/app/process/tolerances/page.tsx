import { tolerances } from "@/data/materials";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "注塑模具公差",
    description:
      "勇鑫塑胶保持的常规与精密注塑模具尺寸公差，每个型腔均经 CMM 验证。",
    path: "/process/tolerances",
    keywords: ["注塑模具公差", "模具尺寸公差", "精密公差", "CMM检测", "模具精度"],
  });
}

export default function TolerancesPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="工艺"
        title="尺寸公差能力"
        description="公差是成本的关键驱动因素。请只为装配真正需要的部位指定公差，其余部位我们按常规成本控制。"
      />
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">特征</th>
              <th className="px-4 py-3">常规</th>
              <th className="px-4 py-3">精密</th>
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
        <p className="font-bold">关于精密公差计价的说明</p>
        <p className="mt-2 text-sm text-slate-300">
          精密公差（±0.005 mm）会增加机加工与 CMM 检测时间。我们会在 DFM 评审中标注仅需精密的
          尺寸，确保您不会为用不到的公差付费。
        </p>
        <Button href="/quote" className="mt-5">
          咨询您的公差需求
        </Button>
      </Card>
    </Container>
  );
}
