import { prisma } from "./db";
import { capabilities, getCapability, type Capability } from "../data/capabilities";
import { industries, getIndustry, type Industry } from "../data/industries";
import { caseStudies, getCaseStudy, type CaseStudy } from "../data/caseStudies";
import { posts, getPost, type Post } from "../data/posts";

export type ContentType = "capability" | "industry" | "caseStudy" | "post";

export const contentTypes: { type: ContentType; label: string; publicBase: string }[] = [
  { type: "capability", label: "加工能力", publicBase: "/capabilities" },
  { type: "industry", label: "服务行业", publicBase: "/industries" },
  { type: "caseStudy", label: "成功案例", publicBase: "/case-studies" },
  { type: "post", label: "行业博客", publicBase: "/resources/blog" },
];

export type ContentMeta = {
  slug: string;
  title: string;
  excerpt: string;
  published: boolean;
  updatedAt: Date;
};

type RecordRow = {
  slug: string;
  title: string;
  excerpt: string;
  data: unknown;
};

let dbWarned = false;

function warnDb(label: string, e: unknown) {
  if (!dbWarned) {
    console.warn(`Content DB unavailable (${label}), using built-in data fallback:`, e);
    dbWarned = true;
  }
}

function parseStrings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function parsePairs(v: unknown): { label: string; value: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === "object")
    .map((x) => ({ label: String(x.label ?? ""), value: String(x.value ?? "") }));
}

function parseFaqs(v: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === "object")
    .map((x) => ({ question: String(x.question ?? ""), answer: String(x.answer ?? "") }));
}

function toCapability(r: RecordRow): Capability {
  const d = (r.data ?? {}) as Record<string, unknown>;
  return {
    slug: r.slug,
    name: String(d.name ?? r.title),
    shortDescription: String(d.shortDescription ?? ""),
    description: String(d.description ?? ""),
    keyword: String(d.keyword ?? ""),
    specs: parsePairs(d.specs),
    applications: parseStrings(d.applications),
    faqs: parseFaqs(d.faqs),
  };
}

function toIndustry(r: RecordRow): Industry {
  const d = (r.data ?? {}) as Record<string, unknown>;
  return {
    slug: r.slug,
    name: String(d.name ?? r.title),
    shortDescription: String(d.shortDescription ?? ""),
    description: String(d.description ?? ""),
    keyword: String(d.keyword ?? ""),
    typicalParts: parseStrings(d.typicalParts),
    standards: parseStrings(d.standards),
    materials: parseStrings(d.materials),
  };
}

function toPost(r: RecordRow): Post {
  const d = (r.data ?? {}) as Record<string, unknown>;
  return {
    slug: r.slug,
    title: String(d.title ?? r.title),
    excerpt: String(d.excerpt ?? ""),
    category: String(d.category ?? ""),
    readMinutes: Number(d.readMinutes ?? 5),
    keyword: String(d.keyword ?? ""),
    datePublished: String(d.datePublished ?? new Date().toISOString()),
    body: parseStrings(d.body),
    faqs: parseFaqs(d.faqs),
  };
}

function toCaseStudy(r: RecordRow): CaseStudy {
  const d = (r.data ?? {}) as Record<string, unknown>;
  return {
    slug: r.slug,
    title: String(d.title ?? r.title),
    industry: String(d.industry ?? ""),
    challenge: String(d.challenge ?? ""),
    solution: String(d.solution ?? ""),
    results: parsePairs(d.results),
    moldSpecs: parsePairs(d.moldSpecs),
  };
}

async function queryAll(type: ContentType): Promise<RecordRow[]> {
  try {
    const rows = await prisma.contentPage.findMany({
      where: { type, published: true },
      select: { slug: true, title: true, excerpt: true, data: true },
      orderBy: { title: "asc" },
    });
    return rows.map((r) => ({ slug: r.slug, title: r.title, excerpt: r.excerpt, data: r.data }));
  } catch (e) {
    warnDb(type, e);
    return [];
  }
}

async function queryOne(type: ContentType, slug: string): Promise<RecordRow | null> {
  try {
    const row = await prisma.contentPage.findUnique({
      where: { type_slug: { type, slug } },
      select: { slug: true, title: true, excerpt: true, data: true, published: true },
    });
    if (row && row.published) {
      return { slug: row.slug, title: row.title, excerpt: row.excerpt, data: row.data };
    }
  } catch (e) {
    warnDb(`${type}/${slug}`, e);
  }
  return null;
}

async function dbHasContent(): Promise<boolean> {
  try {
    const count = await prisma.contentPage.count();
    return count > 0;
  } catch (e) {
    warnDb("count", e);
    return false;
  }
}

export async function listCapabilities(): Promise<Capability[]> {
  const rows = await queryAll("capability");
  if (rows.length > 0) return rows.map(toCapability);
  return capabilities;
}

export async function getCapabilityContent(slug: string): Promise<Capability | null> {
  const row = await queryOne("capability", slug);
  if (row) return toCapability(row);
  if (!(await dbHasContent())) return getCapability(slug) ?? null;
  return null;
}

export async function listIndustries(): Promise<Industry[]> {
  const rows = await queryAll("industry");
  if (rows.length > 0) return rows.map(toIndustry);
  return industries;
}

export async function getIndustryContent(slug: string): Promise<Industry | null> {
  const row = await queryOne("industry", slug);
  if (row) return toIndustry(row);
  if (!(await dbHasContent())) return getIndustry(slug) ?? null;
  return null;
}

export async function listPosts(): Promise<Post[]> {
  const rows = await queryAll("post");
  if (rows.length > 0) return rows.map(toPost);
  return posts;
}

export async function getPostContent(slug: string): Promise<Post | null> {
  const row = await queryOne("post", slug);
  if (row) return toPost(row);
  if (!(await dbHasContent())) return getPost(slug) ?? null;
  return null;
}

export async function listCaseStudies(): Promise<CaseStudy[]> {
  const rows = await queryAll("caseStudy");
  if (rows.length > 0) return rows.map(toCaseStudy);
  return caseStudies;
}

export async function getCaseStudyContent(slug: string): Promise<CaseStudy | null> {
  const row = await queryOne("caseStudy", slug);
  if (row) return toCaseStudy(row);
  if (!(await dbHasContent())) return getCaseStudy(slug) ?? null;
  return null;
}

export async function listContentMeta(type: ContentType): Promise<ContentMeta[]> {
  try {
    const rows = await prisma.contentPage.findMany({
      where: { type },
      select: { slug: true, title: true, excerpt: true, published: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    return rows;
  } catch (e) {
    warnDb(`${type} meta`, e);
    return [];
  }
}

export function emptyContent(type: ContentType): Record<string, unknown> {
  switch (type) {
    case "capability":
      return { slug: "", name: "", shortDescription: "", description: "", keyword: "", specs: [], applications: [], faqs: [] };
    case "industry":
      return { slug: "", name: "", shortDescription: "", description: "", keyword: "", typicalParts: [], standards: [], materials: [] };
    case "caseStudy":
      return { slug: "", title: "", industry: "", challenge: "", solution: "", results: [], moldSpecs: [] };
    case "post":
      return { slug: "", title: "", excerpt: "", category: "", readMinutes: 5, keyword: "", body: [], faqs: [] };
  }
}

export function recordToFormData(type: ContentType, row: { slug: string; data: unknown }): Record<string, unknown> {
  const base = { slug: row.slug };
  const d = (row.data ?? {}) as Record<string, unknown>;
  return { ...base, ...d };
}
