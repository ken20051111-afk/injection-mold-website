import { machines, productionLines } from "@/data/machines";
import { buildMetadata } from "@/lib/seo";
import { Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "注塑模具工厂设备",
    description:
      "勇鑫塑胶设备清单：五轴 CNC、慢走丝与火花机、精密磨床、80-1,500 吨注塑机及 CMM 检测。",
    path: "/process/machine-list",
    keywords: ["注塑模具设备", "CNC加工中心", "EDM火花机", "注塑机", "CMM检测设备", "模具工厂设备"],
  });
}

export default function MachineListPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="工艺"
        title="工厂设备"
        description="机加工、注塑与检测均在厂内完成，您的模具项目没有外协环节。"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {machines.map((m) => (
          <Card key={m.category} className="p-6">
            <p className="text-3xl font-black text-accent-500">{m.count}</p>
            <h2 className="mt-1 font-bold text-steel-900">{m.category} 设备</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.detail}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-xl font-bold text-steel-900">生产线</h2>
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
