import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
}

export async function getEmbedding(text: string): Promise<number[] | null> {
  const openai = getOpenAI();
  if (!openai) return null;
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });
  return res.data[0]?.embedding ?? null;
}

export async function embedMany(texts: string[]): Promise<number[][] | null> {
  const openai = getOpenAI();
  if (!openai) return null;
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts.map((t) => t.slice(0, 8000)),
  });
  return res.data.map((d) => d.embedding);
}

export async function chatComplete(
  messages: ChatCompletionMessageParam[],
  opts: { temperature?: number } = {},
) {
  const openai = getOpenAI();
  if (!openai) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: opts.temperature ?? 0.3,
    messages,
  });
}
