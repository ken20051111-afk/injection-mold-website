import { listPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Button, Card, Container, SectionHeading } from "@/components/ui";

export const revalidate = 60;

export async function generateMetadata() {
  return buildMetadata({
    title: "Resources",
    description:
      "Free guides for injection mold buyers: quoting guides, DFM tips, material selection, steel grades and lead time expectations.",
    path: "/resources",
  });
}

export default async function ResourcesPage() {
  const posts = await listPosts();

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Resources"
        title="Knowledge for Mold Buyers"
        description="Practical engineering guides written to help you make better tooling decisions - and spot a good quote."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <Card className="flex flex-col items-center justify-center border-dashed bg-slate-50 p-6 text-center">
          <p className="font-bold text-steel-900">The Mold Quoting Guide</p>
          <p className="mt-2 text-sm text-slate-600">
            How to structure an RFQ so suppliers quote you accurately the first time.
          </p>
          <Button href="/resources/quoting-guide" size="sm" className="mt-4">
            Open the guide
          </Button>
        </Card>
      </div>
    </Container>
  );
}
