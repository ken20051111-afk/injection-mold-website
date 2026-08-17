import { knowledgeBase } from "../data/knowledge";
import { getEmbedding } from "./openai";
import { prisma } from "./db";

export type RetrievedChunk = {
  title: string;
  content: string;
  score: number;
};

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function keywordSearch(query: string, limit: number): Promise<RetrievedChunk[]> {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
  if (tokens.length === 0) return [];

  const rank = (title: string, content: string) => {
    const text = `${title} ${content}`.toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (text.includes(token)) score += 1;
      if (title.toLowerCase().includes(token)) score += 2;
    }
    return score;
  };

  let entries: { title: string; content: string }[] = [];
  try {
    const docs = await prisma.knowledgeDoc.findMany({
      select: { title: true, content: true },
    });
    if (docs.length > 0) entries = docs;
  } catch {
    // DB unavailable -> fall back to the built-in knowledge file
  }
  if (entries.length === 0) {
    entries = knowledgeBase.map((e) => ({ title: e.title, content: e.content }));
  }

  return entries
    .map((entry) => {
      const score = rank(entry.title, entry.content);
      return { title: entry.title, content: entry.content, score };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function vectorSearch(query: string, limit: number): Promise<RetrievedChunk[] | null> {
  const embedding = await getEmbedding(query);
  if (!embedding) return null;

  const docs = await prisma.knowledgeDoc.findMany({
    select: { id: true, title: true, content: true, embedding: true },
  });
  if (docs.length === 0) return null;

  const ranked = docs
    .map((doc) => ({
      title: doc.title,
      content: doc.content,
      score: cosineSimilarity(embedding, doc.embedding),
    }))
    .filter((d) => d.score > 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked.length > 0 ? ranked : null;
}

export async function retrieveContext(query: string, limit = 5): Promise<RetrievedChunk[]> {
  try {
    const vector = await vectorSearch(query, limit);
    if (vector && vector.length > 0) return vector;
  } catch {
    // fall back to keyword search when DB / API unavailable
  }
  return keywordSearch(query, limit);
}

export function contextToPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "未找到匹配的知识内容。";
  return chunks
    .map((c, i) => `[${i + 1}] ${c.title}\n${c.content}`)
    .join("\n\n");
}
