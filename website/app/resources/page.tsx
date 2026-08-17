import { listPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata({
    title: "资源中心",
    description:
      "面向注塑模具采购方的免费指南：询价指南、DFM 技巧、材料选型、模具钢与交期预期。",
    path: "/resources",
    keywords: ["注塑模具指南", "模具采购知识", "DFM 技巧", "模具材料选型", "模具钢选择", "模具交期"],
  });
}

export default async function ResourcesPage() {
  const posts = await listPosts();

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="资源中心"
        title="模具采购知识库"
        description="实用工程指南，帮助您做出更好的模具决策——并识别一份靠谱的报价。"
        as="h1"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.slug} className="flex flex-col p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">{post.category}</p>
              <p className="text-xs text-slate-400">约 {post.readMinutes} 分钟阅读</p>
            </div>
            <h2 className="mt-3 text-lg font-bold leading-snug text-steel-900">{post.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
            <Button href={`/resources/blog/${post.slug}`} variant="ghost" size="sm" className="mt-4 self-start">
              阅读文章 &rarr;
            </Button>
          </Card>
        ))}
        <Card className="flex flex-col items-center justify-center border-dashed bg-slate-50 p-6 text-center">
          <p className="font-bold text-steel-900">模具询价指南</p>
          <p className="mt-2 text-sm text-slate-600">
            如何组织 RFQ，让供应商一次给出准确报价。
          </p>
          <Button href="/resources/quoting-guide" size="sm" className="mt-4">
            打开指南
          </Button>
        </Card>
      </div>
    </Container>
  );
}
