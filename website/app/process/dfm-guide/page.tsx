import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata() {
  return buildMetadata({
    title: "注塑模具 DFM 设计指南",
    description:
      "注塑成型的可制造性设计规则：均匀壁厚、脱模斜度、加强筋设计、进胶位置与公差，降低模具成本。",
    path: "/process/dfm-guide",
    keywords: ["DFM设计", "注塑模具设计", "可制造性设计", "模具成本优化", "注塑件设计规则"],
  });
}

const rules = [
  {
    title: "保持壁厚均匀",
    detail: "壁厚在 2.5 mm 至 4 mm 之间波动会拖慢冷却并引发缩痕。均匀壁厚可缩短成型周期并降低模具复杂度。",
  },
  {
    title: "避免深而窄的加强筋",
    detail: "筋深超过壁厚的 4 倍需要淬硬镶件和更长时间的火花加工。至少增加 0.5-1.0 度脱模斜度。",
  },
  {
    title: "内角倒圆",
    detail: "尖锐的内角会成为应力集中点，并需要额外的加工工序。0.5R 的内圆角是零成本的。",
  },
  {
    title: "设计时消除倒扣",
    detail: "一个滑块可能使模具成本增加 8-12%。通过旋转零件、调整分型线或增加孔位来避免滑块。",
  },
  {
    title: "设定切合实际的公差",
    detail: "每增加一个 ±0.005 mm 都会增加 CMM 检测成本。只为影响装配与功能的尺寸锁定公差。",
  },
  {
    title: "尽早确定进胶位置",
    detail: "进胶位置决定流动、熔接痕与外观面。错误的位置意味着模具返工。",
  },
  {
    title: "STEP 文件与 2D 图纸一起发送",
    detail: "完整的几何数据让我们能一次准确报价，而不必为未知因素加价。",
  },
  {
    title: "尽早考虑纹理",
    detail: "纹理深度需要额外增加脱模斜度。在钢材开料前确认 SPI/VDI 纹理要求。",
  },
];

export default function DfmGuidePage() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "注塑模具可制造性设计（DFM）检查流程",
    description: "在提交模具询价前，按照这八条规则检查您的注塑件设计，可以有效降低模具成本和交期",
    step: rules.map((rule, i) => ({
      "@type": "HowToStep",
      name: rule.title,
      text: rule.detail,
      position: i + 1,
    })),
  };

  return (
    <Container className="py-14">
      <JsonLd data={howToJsonLd} />
      <SectionHeading
        eyebrow="工艺"
        title="可制造性设计指南"
        description="这八条规则在问题到达模具厂之前，就消除了最常见模具成本与交期超支的来源。"
        as="h1"
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
          发送您的设计，免费获取 DFM 评审
        </Button>
      </div>
    </Container>
  );
}
