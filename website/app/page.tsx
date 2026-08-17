import { listCapabilities, listCaseStudies } from "@/lib/content";
import { companyFacts } from "@/lib/site";
import { getSite } from "@/lib/settings";
import { Button, Card, Container, SectionHeading } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export default async function HomePage() {
  const [caps, cases, site] = await Promise.all([
    listCapabilities(),
    listCaseStudies(),
    getSite(),
  ]);

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand,
    url: site.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.domain}/resources/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const orgSpeakable = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand,
    url: site.domain,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".speakable-hero", ".speakable-intro"],
    },
  };

  return (
    <>
      <JsonLd data={[pageJsonLd, orgSpeakable]} />
      <section className="grid-pattern bg-steel-900 text-white">
        <Container className="py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-sm border border-accent-500/40 bg-accent-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-400">
              ISO 9001 &middot; IATF 16949 &middot; 中国东莞
            </p>
            <h1 className="speakable-hero text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              精密注塑模具，{" "}
              <span className="text-accent-400">准期交付，次次如一</span>
            </h1>
            <p className="speakable-intro mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              每年为汽车、医疗、电子与包装客户交付 {site.annualMolds}+ 套模具，产品远销{" "}
              {site.exportsCountries}+ 个国家。24 小时工程评审，{site.leadTimeWeeks} 周内交付样品。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/quote" size="lg">
                24 小时内获取报价
              </Button>
              <Button href="/capabilities" size="lg" variant="secondary">
                了解我们的能力
              </Button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-steel-700 bg-steel-700 sm:grid-cols-4">
            {companyFacts.map((fact) => (
              <div key={fact.label} className="bg-steel-800 p-6">
                <p className="text-3xl font-black text-white">
                  {fact.value.toLocaleString()}
                  {fact.suffix}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="核心能力"
            title="为量产而生的注塑模具"
            description="从试制件到 128 腔量产模具，全部在同一工厂内完成设计与验证。"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {caps.map((cap) => (
              <Card key={cap.slug} className="group flex flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent-500">
                  {cap.specs[0]?.value}
                </p>
                <h3 className="text-lg font-bold text-steel-900 group-hover:text-accent-500">
                  {cap.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {cap.shortDescription}
                </p>
                <Button href={`/capabilities/${cap.slug}`} variant="ghost" size="sm" className="mt-4 self-start">
                  了解更多 &rarr;
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-steel-900 py-16 text-white lg:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="为什么选择勇鑫塑胶"
                title="一个工厂，零意外"
                description="设计、加工、试模与检测在同一屋檐下完成——您的项目永远不受制于外协环节。"
              />
              <ul className="space-y-4">
                {[
                  ["24 小时工程响应", "1 个工作日内给出进胶、拔模角与公差方面的 DFM 反馈"],
                  ["每个型腔 CMM 测量验证", "每套模具随附尺寸检测报告，无需另行申请"],
                  [`${site.deliveryRate}% 准期交付率`, "项目管理团队每周发送进度报告"],
                  ["12 个月模具质保", "免费设计评审与终身技术支持"],
                ].map(([title, desc]) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                      &#10003;
                    </span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-slate-400">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-steel-700 bg-steel-800 p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
                交期实况对照
              </p>
              <dl className="mt-6 space-y-5">
                {[
                  ["试制模具", `${site.leadTimeWeeks - 1} - 4 周`],
                  ["精密量产模具", "5 - 6 周"],
                  ["多腔 / 双色模具", "6 - 8 周"],
                  ["叠层模具", "8 - 10 周"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between border-b border-steel-700 pb-3 last:border-0">
                    <dt className="text-sm text-slate-400">{label}</dt>
                    <dd className="font-bold text-white">{value}</dd>
                  </div>
                ))}
              </dl>
              <Button href="/process" variant="secondary" className="mt-8 w-full">
                查看完整工艺能力
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="客户见证"
            title="高压之下如期交付的项目"
            description="真实的模具项目以及我们交付的成绩。"
            align="center"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {cases.map((cs) => (
              <Card key={cs.slug} className="flex flex-col p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
                  {cs.industry}
                </p>
                <h3 className="mt-2 text-base font-bold leading-snug text-steel-900">{cs.title}</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {cs.results.slice(0, 4).map((r) => (
                    <div key={r.label}>
                      <p className="text-lg font-black text-steel-900">{r.value}</p>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">{r.label}</p>
                    </div>
                  ))}
                </div>
                <Button href={`/case-studies/${cs.slug}`} variant="ghost" size="sm" className="mt-5 self-start">
                  阅读案例 &rarr;
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16 lg:py-20">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold text-steel-900">准备好为您的模具报价了吗？</h2>
            <p className="max-w-xl text-slate-600">
              发送您的 3D 模型与需求。我们的工程师将在 24 小时内返回 DFM 评审与成本估算，
              免费且无任何义务。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/quote" size="lg">
                立即获取报价
              </Button>
              <Button href="/resources/blog/injection-mold-cost-guide" size="lg" variant="secondary">
                阅读模具成本指南
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
