import { buildMetadata } from "@/lib/seo";
import { Container, SectionHeading } from "@/components/ui";
import { QuoteForm } from "@/components/quote/QuoteForm";

export async function generateMetadata() {
  return buildMetadata({
    title: "获取模具报价",
    description:
      "24 小时内获得 DFM 评审与模具成本估算。发送您的零件需求，我们的工程师将回复报价方案。",
    path: "/quote",
    keywords: ["注塑模具报价", "模具价格估算", "模具询价", "DFM 评审", "模具成本", "RFQ 模具"],
  });
}

export default function QuotePage() {
  return (
    <Container className="py-14">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionHeading
            eyebrow="询价 RFQ"
            title="获取模具报价"
            description="免费 DFM 评审。24 小时内工程响应，2 个工作日内正式报价。"
            as="h1"
          />
          <ul className="mt-6 space-y-4">
            {[
              ["24 小时工程响应", "任何承诺之前，先给出 DFM 反馈"],
              ["CMM 验证的质量", "每套模具随附尺寸检测报告"],
              ["价格透明可比", "透明规格清单，同等条件下报价"],
              ["12 个月质保", "免费设计评审，终身技术支持"],
            ].map(([title, desc]) => (
              <li key={title} className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs text-white">&#10003;</span>
                <div>
                  <p className="font-semibold text-steel-900">{title}</p>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">接下来的流程</p>
            <ol className="mt-3 space-y-2 text-sm text-slate-600">
              <li>1. 工程师审阅您的需求（24 小时内）</li>
              <li>2. 提供 DFM 反馈与成本估算</li>
              <li>3. 正式报价，包含模具寿命与交期</li>
              <li>4. 出货前经“金样”确认</li>
            </ol>
          </div>
        </div>
        <div className="lg:col-span-3">
          <QuoteForm />
        </div>
      </div>
    </Container>
  );
}
