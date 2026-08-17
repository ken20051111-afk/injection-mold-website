import { listPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata({
    title: "注塑模具博客",
    description:
      "面向 B2B 采购方的文章：模具成本、交期、DFM 规则、模具钢选型与表面处理。",
    path: "/resources/blog",
  });
}

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="博客"
        title="注塑成型洞察"
        description="每周发布新指南。采购工程师在发送 RFQ 前需要的一切。"
      />
      <div className="grid gap-6 md:grid-cols-2">
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
      </div>
    </Container>
  );
}
