import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export const revalidate = 60;

export async function generateMetadata() {
  const s = await getSite();
  return buildMetadata({
    title: "关于我们",
    description:
      `了解${s.brand}：成立于 ${s.founded} 年的中国东莞注塑模具制造商，每年为 ${s.exportsCountries}+ 个国家的 OEM 客户交付 ${s.annualMolds}+ 套模具。`,
    path: "/about",
    keywords: ["注塑模具工厂", "东莞模具厂", "中国模具制造商", "ISO 9001 模具", "IATF 16949 模具", "精密注塑模具厂"],
  });
}

export default async function AboutPage() {
  const site = await getSite();
  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="关于我们"
        title={`${site.brand} 背后的工厂`}
        description={`${site.founded} 年创立于"中国模具之都"东莞长安镇，我们已成长为拥有 ${site.machines} 台设备的精密模具工厂，服务欧美客户。`}
        as="h1"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: site.founded, label: "造模年限" },
          { value: `${site.machines}+`, label: "CNC 与 EDM 设备" },
          { value: site.engineers, label: "工程师与技师" },
          { value: `${site.deliveryRate}%`, label: "准期交付率" },
        ].map((stat) => (
          <Card key={stat.label} className="p-6 text-center">
            <p className="text-3xl font-black text-accent-500">{stat.value}</p>
            <p className="mt-1 text-sm font-semibold text-steel-700">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-steel-900">质量管理体系</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            我们的质量管理体系已通过 ISO 9001:2015、IATF 16949 与 ISO 14001 认证。汽车项目严格执行
            APQP 流程，提供 PPAP 三级文档与 IMDS 提交。每一套模具出厂前，所有型腔均经过 CMM 检测。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {site.certifications.map((c) => (
              <span key={c} className="rounded-sm border border-accent-500/40 bg-accent-500/10 px-3 py-1.5 text-xs font-bold text-accent-500">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-steel-900">我们的客户</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            德国汽车一级供应商、美国医疗器械 OEM、欧洲包装品牌与电动工具制造商。客户选择长期与我们
            合作，原因始终是三个：透明的工程沟通、经 CMM 验证的质量，以及我们公开的交付记录。
          </p>
        </div>
      </div>

      <Card className="mt-12 bg-steel-900 p-8 text-white">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">欢迎来访，或直接发送图纸</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {site.address} &middot; {site.phone} &middot; {site.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Button href="/quote" size="lg">
              获取报价
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              联系我们
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}
