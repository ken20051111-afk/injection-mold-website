import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata() {
  return buildMetadata({
    title: "注塑模具工艺与规格",
    description:
      "中国东莞定制注塑模具的公差、材料、表面处理、设备清单与 DFM 设计指南。",
    path: "/process",
    keywords: ["注塑模具工艺", "模具公差标准", "注塑材料指南", "模具表面处理", "DFM 设计指南", "模具设备"],
  });
}

const sections = [
  {
    title: "公差标准",
    href: "/process/tolerances",
    desc: "常规与精密尺寸公差控制，经 CMM 检测验证。",
  },
  {
    title: "材料指南",
    href: "/process/materials",
    desc: "塑料树脂选择，含性能、收缩率与典型应用。",
  },
  {
    title: "表面处理",
    href: "/process/surface-finishes",
    desc: "SPI A1-D3 等级与 VDI 纹面，含粗糙度数值。",
  },
  {
    title: "设备清单",
    href: "/process/machine-list",
    desc: "我们的 CNC、EDM、磨床、注塑机与检测设备。",
  },
  {
    title: "DFM 设计指南",
    href: "/process/dfm-guide",
    desc: "可制造性设计规则，降低模具成本与交期。",
  },
];

export default function ProcessPage() {
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="工艺"
        title="工程与制造流程"
        description="发送图纸前，采购方应先阅读这五份参考资料——它们为您说明了模具所能达到的水平。"
        as="h1"
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.href} className="flex flex-col p-6">
            <h2 className="text-lg font-bold text-steel-900">{s.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            <Button href={s.href} variant="ghost" size="sm" className="mt-4 self-start">
              了解更多 &rarr;
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
