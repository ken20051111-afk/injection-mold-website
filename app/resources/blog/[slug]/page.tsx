import { notFound } from "next/navigation";
import { getPostContent, listPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb, Button, Card, Container } from "@/components/ui";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSite } from "@/lib/settings";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostContent(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/resources/blog/${post.slug}`,
  });
}

export async function generateStaticParams() {
  return (await listPosts()).map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, posts, site] = await Promise.all([getPostContent(slug), listPosts(), getSite()]);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date().toISOString(),
    author: { "@type": "Organization", name: site.legalName },
    publisher: { "@type": "Organization", name: site.brand },
    mainEntityOfPage: `${site.domain}/resources/blog/${post.slug}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <Container className="py-14">
      <JsonLd data={[articleJsonLd, faqJsonLd]} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Blog", href: "/resources/blog" },
          { label: post.title },
        ]}
      />
      <div className="grid gap-12 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
            {post.category} &middot; {post.readMinutes} min read
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-steel-900 lg:text-4xl">
            {post.title}
          </h1>
          <div className="prose mt-8 max-w-none space-y-5 text-slate-600">
            {post.body.map((paragraph, i) => (
              <p key={i} className="text-[15px] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <h2 className="mt-12 text-xl font-bold text-steel-900">FAQ</h2>
          <div className="mt-4 space-y-4">
            {post.faqs.map((f) => (
              <Card key={f.question} className="p-5">
                <h3 className="font-bold text-steel-900">{f.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.answer}</p>
              </Card>
            ))}
          </div>
        </article>

        <aside className="space-y-5">
          <Card className="bg-steel-900 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-400">
              Need a real quote?
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Send your drawing and requirements. Estimate within 24 hours.
            </p>
            <Button href="/quote" className="mt-5 w-full">
              Request a Quote
            </Button>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">More reading</p>
            <ul className="mt-3 space-y-2">
              {posts
                .filter((p) => p.slug !== post.slug)
                .map((p) => (
                  <li key={p.slug}>
                    <a href={`/resources/blog/${p.slug}`} className="text-sm text-slate-600 hover:text-accent-500">
                      {p.title}
                    </a>
                  </li>
                ))}
            </ul>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
