import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/settings";
import { Card, Container, SectionHeading } from "@/components/ui";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata() {
  const s = await getSite();
  return buildMetadata({
    title: "联系我们",
    description:
      `联系${s.brand}获取注塑模具报价、工程咨询或工厂参观。${s.phone} - ${s.email}。`,
    path: "/contact",
    keywords: ["注塑模具报价", "模具工厂联系", "注塑模具咨询", "模具工厂参观", "东莞模具厂联系"],
  });
}

export default async function ContactPage() {
  const site = await getSite();
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "联系我们",
    url: `${site.domain}/contact`,
    about: `联系${site.brand}工程团队`,
  };
  return (
    <Container className="py-14">
      <JsonLd data={contactJsonLd} />
      <SectionHeading
        eyebrow="联系我们"
        title="与工程师直接沟通，而不是销售"
        description="您的留言将直接送达工程团队，我们会在 1 个工作日内回复。"
        as="h1"
      />
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">工厂地址</p>
            <p className="mt-2 text-sm text-slate-600">{site.address}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">电话</p>
            <p className="mt-2 text-sm text-slate-600">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-accent-500">{site.phone}</a>
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">邮箱</p>
            <p className="mt-2 text-sm text-slate-600">
              <a href={`mailto:${site.email}`} className="hover:text-accent-500">{site.email}</a>
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">工作时间</p>
            <p className="mt-2 text-sm text-slate-600">周一至周六，8:00 - 20:00（GMT+8）</p>
            <p className="mt-1 text-xs text-slate-400">报价请求 24 小时内响应</p>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="p-6 sm:p-8">
            <ContactForm />
          </Card>
        </div>
      </div>
    </Container>
  );
}
