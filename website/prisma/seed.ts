import "dotenv/config";
import { knowledgeBase } from "../data/knowledge";
import { capabilities } from "../data/capabilities";
import { industries } from "../data/industries";
import { caseStudies } from "../data/caseStudies";
import { posts } from "../data/posts";
import { prisma } from "../lib/db";
import { embedMany } from "../lib/openai";

type ContentSeed = {
  type: "capability" | "industry" | "caseStudy" | "post";
  slug: string;
  title: string;
  excerpt: string;
  data: object;
};

const contentSeed: ContentSeed[] = [
  ...capabilities.map((c) => ({
    type: "capability" as const,
    slug: c.slug,
    title: c.name,
    excerpt: c.shortDescription,
    data: {
      name: c.name,
      shortDescription: c.shortDescription,
      description: c.description,
      keyword: c.keyword,
      specs: c.specs,
      applications: c.applications,
      faqs: c.faqs,
    },
  })),
  ...industries.map((i) => ({
    type: "industry" as const,
    slug: i.slug,
    title: i.name,
    excerpt: i.shortDescription,
    data: {
      name: i.name,
      shortDescription: i.shortDescription,
      description: i.description,
      keyword: i.keyword,
      typicalParts: i.typicalParts,
      standards: i.standards,
      materials: i.materials,
    },
  })),
  ...caseStudies.map((c) => ({
    type: "caseStudy" as const,
    slug: c.slug,
    title: c.title,
    excerpt: c.challenge.slice(0, 150),
    data: {
      title: c.title,
      industry: c.industry,
      challenge: c.challenge,
      solution: c.solution,
      results: c.results,
      moldSpecs: c.moldSpecs,
    },
  })),
  ...posts.map((p) => ({
    type: "post" as const,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    data: {
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      readMinutes: p.readMinutes,
      keyword: p.keyword,
      body: p.body,
      faqs: p.faqs,
    },
  })),
];

async function seedContent() {
  for (const c of contentSeed) {
    await prisma.contentPage.upsert({
      where: { type_slug: { type: c.type, slug: c.slug } },
      update: { title: c.title, excerpt: c.excerpt, data: c.data },
      create: { type: c.type, slug: c.slug, title: c.title, excerpt: c.excerpt, data: c.data },
    });
  }
  console.log(`Seeded ${contentSeed.length} content pages`);
}

async function seedKnowledge() {
  const texts = knowledgeBase.map((k) => `${k.title}\n${k.content}`);
  let embeddings: number[][] | null = null;
  try {
    embeddings = await embedMany(texts);
  } catch (e) {
    console.warn("OpenAI embedding skipped:", e instanceof Error ? e.message : e);
  }

  for (let i = 0; i < knowledgeBase.length; i++) {
    const entry = knowledgeBase[i];
    await prisma.knowledgeDoc.upsert({
      where: { id: entry.title },
      update: {
        category: entry.category,
        content: entry.content,
        sourceUrl: entry.sourceUrl ?? null,
        embedding: embeddings?.[i] ?? [],
      },
      create: {
        id: entry.title,
        category: entry.category,
        title: entry.title,
        content: entry.content,
        sourceUrl: entry.sourceUrl ?? null,
        embedding: embeddings?.[i] ?? [],
      },
    });
  }
  console.log(`Seeded ${knowledgeBase.length} knowledge documents`);
}

const keywords = [
  { keyword: "注塑模具制造商", intent: "commercial", volume: 8800, targetUrl: "/capabilities", difficulty: 78 },
  { keyword: "注塑模具厂", intent: "commercial", volume: 3200, targetUrl: "/capabilities", difficulty: 65 },
  { keyword: "精密注塑模具", intent: "commercial", volume: 1900, targetUrl: "/capabilities/precision-molds", difficulty: 55 },
  { keyword: "多腔注塑模具", intent: "commercial", volume: 720, targetUrl: "/capabilities/multi-cavity-molds", difficulty: 38 },
  { keyword: "双色注塑模具", intent: "commercial", volume: 480, targetUrl: "/capabilities/two-shot-molding", difficulty: 30 },
  { keyword: "汽车注塑模具", intent: "commercial", volume: 2100, targetUrl: "/industries/automotive", difficulty: 61 },
  { keyword: "医疗注塑模具", intent: "commercial", volume: 1300, targetUrl: "/industries/medical", difficulty: 52 },
  { keyword: "注塑模具多少钱", intent: "informational", volume: 5400, targetUrl: "/resources/blog/injection-mold-cost-guide", difficulty: 48 },
  { keyword: "注塑模具交期", intent: "informational", volume: 1200, targetUrl: "/resources/blog/lead-time-explained", difficulty: 35 },
  { keyword: "模具钢怎么选", intent: "informational", volume: 900, targetUrl: "/resources/blog/steel-grade-selection", difficulty: 33 },
  { keyword: "注塑模具 DFM", intent: "informational", volume: 650, targetUrl: "/resources/blog/dfm-tips-reduce-mold-cost", difficulty: 40 },
  { keyword: "注塑模具报价", intent: "transactional", volume: 1600, targetUrl: "/quote", difficulty: 42 },
];

async function seedKeywords() {
  for (const kw of keywords) {
    await prisma.seoKeyword.upsert({
      where: { id: kw.keyword },
      update: { intent: kw.intent, volume: kw.volume, difficulty: kw.difficulty, targetUrl: kw.targetUrl },
      create: { id: kw.keyword, keyword: kw.keyword, intent: kw.intent, volume: kw.volume, difficulty: kw.difficulty, targetUrl: kw.targetUrl },
    });
  }
  console.log(`Seeded ${keywords.length} keywords`);
}

async function main() {
  await seedContent();
  await seedKnowledge();
  await seedKeywords();
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
