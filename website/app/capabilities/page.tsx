import { listCapabilities } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSite } from "@/lib/settings";

export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata({
    title: "注塑模具制造能力",
    description:
      "来自中国东莞认证制造商：精密、多腔、双色、气辅与叠层注塑模具。了解我们的模具制造能力。",
    path: "/capabilities",
    keywords: ["注塑模具制造能力", "精密模具", "多腔模具", "双色注塑", "气辅注塑", "叠层模具"],
  });
}

export default async function CapabilitiesPage() {
  const [caps, site] = await Promise.all([listCapabilities(), getSite()]);

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "注塑模具制造能力",
    itemListElement: caps.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.domain}/capabilities/${c.slug}`,
      name: c.name,
    })),
  };

  return (
    <Container className="py-14">
      <JsonLd data={listJsonLd} />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">核心能力</p>
      <h1 className="mt-2 text-4xl font-black text-steel-900">注塑模具制造能力</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        {site.machines} 台 CNC 与 EDM 设备、{site.engineers} 名工程师，每年交付 {site.annualMolds}+ 套模具。
        以下每一项能力均为自主制造，并经过 CMM 检测验证。
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {caps.map((cap) => (
          <Card key={cap.slug} className="flex flex-col p-7 transition-shadow hover:shadow-lg">
            <h2 className="text-xl font-bold text-steel-900">{cap.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{cap.shortDescription}</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-sm">
              {cap.specs.slice(0, 4).map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{spec.label}</dt>
                  <dd className="mt-0.5 font-semibold text-steel-700">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400">{cap.keyword}</span>
              <Button href={`/capabilities/${cap.slug}`} size="sm">
                详情
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
