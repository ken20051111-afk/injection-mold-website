import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Card, Container, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata() {
  const s = await getSite();
  return buildMetadata({
    title: "常见问题",
    description: `${s.brand}注塑模具常见问题解答：模具价格、交期、材料、公差、DFM 设计、质量认证等采购方最关心的问题。`,
    path: "/faq",
    keywords: ["注塑模具FAQ", "模具价格", "模具交期", "模具材料", "模具公差", "DFM设计", "模具采购问题"],
  });
}

const faqGroups = [
  {
    category: "模具价格与报价",
    items: [
      {
        q: "一套注塑模具大概多少钱？",
        a: "模具价格取决于腔数、复杂度、钢材和公差要求。简单的单腔试制模具约 2-5 万元，4 腔中等复杂度模具约 10-20 万元，8 腔带热流道的精密模具约 20-40 万元。128 腔包装模具可达 100 万元以上。建议发送 3D 图纸获取精确报价。",
      },
      {
        q: "报价包含哪些内容？",
        a: "我们的正式报价包含：模具设计费、材料费、加工费、热流道系统（如需要）、试模费、CMM 检测报告、标准备件包以及 12 个月模具质保。不含注塑生产费用和物流费用。",
      },
      {
        q: "为什么不同供应商的报价差别很大？",
        a: "报价差异主要来自六个方面：腔数选择、模具钢等级（P20 vs S136 可差 3 倍）、公差精度要求、模具寿命目标、热流道品牌以及是否包含完整的 DFM 评审。建议用同一份规格书向多家供应商询价。",
      },
      {
        q: "付款方式是怎样的？",
        a: "标准付款方式为：签约时预付 50%，试模验收后支付 40%，出厂前付清剩余 10%。对于长期合作客户，可协商更灵活的付款条件。",
      },
    ],
  },
  {
    category: "交期与项目管理",
    items: [
      {
        q: "一套模具从下单到交付需要多长时间？",
        a: "标准项目周期为 4-8 周：DFM 评审 1 周、机加工 2-3 周、配模抛光 1-2 周、试模调试 1-2 周。简单试制模具最快 3-4 周，精密多腔模具通常需要 6-8 周。具体交期以报价时确认为准。",
      },
      {
        q: "如何保证按时交付？",
        a: "我们采用项目管理系统跟踪每个节点，每周向客户发送进度报告。交付率达 96% 以上。导致延期的主要原因是后期工程变更，因此我们建议在 DFM 评审阶段冻结设计。",
      },
      {
        q: "可以加急吗？",
        a: "可以。加急项目会安排专属团队和优先排产，但通常会产生 15-25% 的加急费用。请在询价时说明紧急程度，我们会评估可行性和费用。",
      },
    ],
  },
  {
    category: "材料与工艺",
    items: [
      {
        q: "你们能加工哪些塑料材料？",
        a: "我们常加工的材料包括：ABS、PC、PP、PA（尼龙）、POM（赛钢）、PE、PVC、PMMA（亚克力）、PEEK、PBT、TPE/TPU 等。也包括玻纤增强、阻燃、医用级等特殊牌号。如果您需要的材料不在列表中，请联系我们确认。",
      },
      {
        q: "模具钢怎么选？",
        a: "选钢取决于产量和树脂类型：P20（28-32 HRC）适合 25 万次以内的试制模；718H（33-38 HRC）适合 100 万次中批量；NAK80（38-42 HRC）适合高光外观件；S136（48-52 HRC）适合腐蚀性树脂和 300 万次长寿命模具。详细对照表请参考我们的模具钢选型指南。",
      },
      {
        q: "公差能做到多少？",
        a: "常规公差为 ±0.05mm，精密公差可达 ±0.005mm。关键配合尺寸我们建议指定精密公差，非关键尺寸使用常规公差以控制成本。所有精密尺寸均经过 CMM 三坐标检测验证。",
      },
      {
        q: "表面光洁度有哪些选择？",
        a: "我们提供 SPI A1（镜面抛光）到 D3（粗加工）全系列等级，以及 VDI 纹面（如 MT 11020 等）。外观件通常需要 A1-A2 级，结构件 B1-B2 级即可。纹面可以掩盖轻微的缩痕和熔接线。",
      },
    ],
  },
  {
    category: "质量与认证",
    items: [
      {
        q: "你们有哪些质量认证？",
        a: "我们通过了 ISO 9001:2015 质量管理体系认证、IATF 16949 汽车行业质量管理体系认证和 ISO 14001 环境管理体系认证。汽车项目严格执行 APQP 流程，可提供 PPAP 三级文档。",
      },
      {
        q: "如何验证模具质量？",
        a: "每套模具出厂前均经过：试模验证（至少 2 次试模）、CMM 全尺寸检测（出具检测报告）、装配验证和外观检查。客户可安排第三方验货或亲自来厂验收。",
      },
      {
        q: "模具质保期是多久？",
        a: "我们提供 12 个月模具质保（自出厂之日起），质保范围内免费修复因模具质量问题导致的缺陷。终身提供技术支持和有偿维修服务。",
      },
    ],
  },
  {
    category: "合作流程",
    items: [
      {
        q: "从询价到量产的合作流程是什么？",
        a: "标准流程：1) 发送 3D 图纸和需求 → 2) 24 小时内 DFM 反馈 → 3) 正式报价（含模具寿命和交期）→ 4) 确认报价并签约 → 5) 模具设计评审 → 6) 机加工和装配 → 7) 试模和金样确认 → 8) 量产交付。",
      },
      {
        q: "需要提供哪些资料才能报价？",
        a: "请提供：3D 模型文件（STEP/IGES 格式最佳）、2D 工程图纸（标注关键公差）、材料牌号和颜色要求、年需求量、期望的模具寿命。资料越完整，报价越准确。",
      },
      {
        q: "你们接受小批量试制吗？",
        a: "是的，我们欢迎试制项目。试制模具可以使用性价比更高的 P20 钢材，降低前期投入。很多客户从试制开始合作，量产后再追加多腔模具。",
      },
    ],
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      }))
    ),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "如何获取注塑模具报价",
    description: "从发送图纸到收到正式报价的标准流程",
    step: [
      {
        "@type": "HowToStep",
        name: "发送图纸与需求",
        text: "准备 3D 模型文件（STEP/IGES）、2D 工程图纸、材料牌号和年需求量，通过在线表单或邮件发送给我们。",
      },
      {
        "@type": "HowToStep",
        name: "DFM 评审反馈",
        text: "工程师在 24 小时内审阅您的设计，提供可制造性建议，包括进胶位置、拔模角、公差和壁厚优化。",
      },
      {
        "@type": "HowToStep",
        name: "收到正式报价",
        text: "基于确认的 DFM 方案，2 个工作日内提供正式报价，包含模具成本、交期、模具寿命保证和付款条件。",
      },
      {
        "@type": "HowToStep",
        name: "确认并启动项目",
        text: "确认报价后签约，支付预付款，启动模具设计和制造流程。",
      },
    ],
  };

  return (
    <Container className="py-14">
      <JsonLd data={[faqJsonLd, howToJsonLd]} />
      <SectionHeading
        eyebrow="帮助中心"
        title="常见问题"
        description="关于注塑模具价格、交期、材料、质量和合作流程的常见问题解答。"
        as="h1"
      />

      <div className="space-y-12">
        {faqGroups.map((group) => (
          <section key={group.category}>
            <h2 className="mb-6 text-xl font-bold text-steel-900">{group.category}</h2>
            <div className="space-y-4">
              {group.items.map((item) => (
                <Card key={item.q} className="p-6">
                  <h3 className="font-bold text-steel-900">{item.q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Card className="mt-16 bg-steel-900 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">没有找到您的问题？</h2>
        <p className="mt-3 text-slate-300">
          我们的工程师团队随时准备回答您的技术问题。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-sm bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600"
          >
            联系工程团队
          </a>
          <a
            href="/quote"
            className="inline-flex items-center justify-center rounded-sm border border-white/30 px-6 py-3 font-semibold text-white hover:border-white hover:bg-white/10"
          >
            直接获取报价
          </a>
        </div>
      </Card>
    </Container>
  );
}
