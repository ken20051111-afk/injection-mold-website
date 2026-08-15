import { listPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata({
    title: "Injection Molding Blog",
    description:
      "Articles on injection mold cost, lead times, DFM rules, mold steel selection and surface finishes for B2B buyers.",
    path: "/resources/blog",
  });
}

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Blog"
        title="Injection Molding Insights"
        description="New guides published weekly. Everything a sourcing engineer needs before sending an RFQ."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.slug} className="flex flex-col p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-500">{post.category}</p>
              <p className="text-xs text-slate-400">{post.readMinutes} min read</p>
            </div>
            <h2 className="mt-3 text-lg font-bold leading-snug text-steel-900">{post.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
            <Button href={`/resources/blog/${post.slug}`} variant="ghost" size="sm" className="mt-4 self-start">
              Read article &rarr;
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
