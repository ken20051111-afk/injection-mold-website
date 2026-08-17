import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata() {
  return buildMetadata({
    title: "模具询价指南",
    description:
      "如何组织注塑模具 RFQ，让供应商一次给出准确报价：图纸、材料、数量以及影响价格的因素。",
    path: "/resources/quoting-guide",
    keywords: ["模具询价", "RFQ模板", "模具报价流程", "注塑模具采购", "模具供应商比价"],
  });
}

const steps = [
  {
    title: "准备完整的图纸",
    detail:
      "发送 STEP/IGES 3D 模型，外加标注关键公差与表面处理要求的 2D PDF。不完整的文件会让每个供应商都在报价里加“保险”费用。",
  },
  {
    title: "说明年需求量",
    detail:
      "数量决定腔数与钢种——这是两大价格驱动因素。给出切合实际的年需求量，而不是笼统的“大批量”。",
  },
  {
    title: "指明材料",
    detail:
      "注明具体的树脂牌号（例如 PC/ABS Bayer T85）。如果不确定，描述应用场景与使用环境，让模具厂为您推荐。",
  },
  {
    title: "设定模具寿命预期",
    detail:
      "10 万次寿命的试制模与 200 万次寿命的量产模是两种不同的产品。告诉我们目标寿命，我们会据此选择钢材与设计方案。",
  },
  {
    title: "提供交付期限",
    detail:
      "切合实际的交期让我们能安排机加工产能。加急项目需支付加急费——常规模具请预留 3-6 周。",
  },
  {
    title: "同口径比价",
    detail:
      "向每家供应商索要相同的规格清单：腔数、钢种、热流道品牌、模具寿命、交期。然后进行公平对比。",
  },
];

export default function QuotingGuidePage() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "如何组织注塑模具询价（RFQ）",
    description: "六个步骤，让任何模具供应商给出准确、可比的注塑模具报价",
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      name: step.title,
      text: step.detail,
      position: i + 1,
    })),
  };

  return (
    <Container className="py-14">
      <JsonLd data={howToJsonLd} />
      <SectionHeading
        eyebrow="指南"
        title="模具询价指南"
        description="六个步骤，让任何供应商（包括我们）给出准确、可比的注塑模具报价。"
        as="h1"
      />
      <div className="grid gap-5 md:grid-cols-2">
        {steps.map((step, i) => (
          <Card key={step.title} className="flex gap-4 p-6">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent-500 text-sm font-black text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-bold text-steel-900">{step.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.detail}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button href="/quote" size="lg">
          立即发起 RFQ
        </Button>
      </div>
    </Container>
  );
}
