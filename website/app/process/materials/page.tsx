import { materials } from "@/data/materials";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "注塑材料指南",
    description:
      "注塑模具塑料树脂选型指南：ABS、PC、PC/ABS、PP、PA、POM、PEEK 等，含收缩率与典型应用。",
    path: "/process/materials",
    keywords: ["注塑材料", "塑料树脂", "ABS", "PC", "PA", "PEEK", "注塑材料选型", "材料收缩率"],
  });
}

export default function MaterialsPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="工艺"
        title="注塑材料指南"
        description="材料选择决定模具设计、收缩补偿与成型周期。下表涵盖我们最常成型的树脂。"
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">材料</th>
              <th className="px-4 py-3">关键性能</th>
              <th className="px-4 py-3">应用</th>
              <th className="px-4 py-3">成本</th>
              <th className="px-4 py-3">收缩率</th>
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
        <p className="font-bold">不确定选哪种材料？</p>
        <p className="mt-2 text-sm text-slate-300">
          我们的工程师会在 DFM 评审中，根据您的应用场景、使用环境与预算推荐合适的材料。
        </p>
        <Button href="/quote" className="mt-5">
          咨询我们的工程师
        </Button>
      </Card>
    </Container>
  );
}
