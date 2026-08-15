"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getEmbedding } from "@/lib/openai";
import { saveSite } from "@/lib/settings";
import { Prisma } from "@/generated/prisma/client";
import type { ContentType } from "@/lib/content";

async function requireAdmin() {
  const store = await cookies();
  if (store.get("crm_token")?.value !== process.env.CRM_PASSWORD) {
    throw new Error("Unauthorized");
  }
}

function revalidateContent(type: string, slug: string) {
  const paths = ["/sitemap.xml"];
  switch (type) {
    case "capability":
      paths.push("/", "/capabilities", `/capabilities/${slug}`);
      break;
    case "industry":
      paths.push("/industries", `/industries/${slug}`);
      break;
    case "caseStudy":
      paths.push("/", "/case-studies", `/case-studies/${slug}`);
      break;
    case "post":
      paths.push("/resources", "/resources/blog", `/resources/blog/${slug}`);
      break;
  }
  for (const p of paths) revalidatePath(p);
}

export async function saveContent(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const type = formData.get("type") as ContentType;
  const originalSlug = (formData.get("originalSlug") as string) || "";
  const slug = ((formData.get("slug") as string) || "").trim().replace(/\s+/g, "-").toLowerCase();
  const raw = formData.get("data") as string;

  if (!slug) return { ok: false, error: "Slug is required" };
  if (!raw) return { ok: false, error: "Content data is missing" };

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return { ok: false, error: "Invalid JSON payload" };
  }
  const jsonData = data as unknown as Prisma.InputJsonValue;

  let title = slug;
  let excerpt = "";
  switch (type) {
    case "capability":
      title = String(data.name ?? slug);
      excerpt = String(data.shortDescription ?? "");
      break;
    case "industry":
      title = String(data.name ?? slug);
      excerpt = String(data.shortDescription ?? "");
      break;
    case "caseStudy":
      title = String(data.title ?? slug);
      excerpt = String(data.challenge ?? "").slice(0, 150);
      break;
    case "post":
      title = String(data.title ?? slug);
      excerpt = String(data.excerpt ?? "");
      break;
  }

  try {
    if (originalSlug && originalSlug !== slug) {
      await prisma.contentPage.deleteMany({ where: { type, slug: originalSlug } });
    }
    await prisma.contentPage.upsert({
      where: { type_slug: { type, slug } },
      update: { title, excerpt, data: jsonData, published: data.published !== false },
      create: {
        type,
        slug,
        title,
        excerpt,
        data: jsonData,
        published: data.published !== false,
      },
    });
    revalidateContent(type, slug);
    return { ok: true };
  } catch (e) {
    console.error("saveContent failed:", e);
    return { ok: false, error: "Database error while saving" };
  }
}

export async function deleteContent(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const type = formData.get("type") as string;
  const slug = (formData.get("slug") as string) || "";
  try {
    await prisma.contentPage.deleteMany({ where: { type, slug } });
    revalidateContent(type, slug);
    return { ok: true };
  } catch (e) {
    console.error("deleteContent failed:", e);
    return { ok: false, error: "Database error while deleting" };
  }
}

export async function deleteContentForm(formData: FormData) {
  await deleteContent(formData);
}

export async function saveKnowledge(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const originalId = (formData.get("originalId") as string) || "";
  const category = (formData.get("category") as string) || "general";
  const title = (formData.get("title") as string) || "";
  const content = (formData.get("content") as string) || "";
  const sourceUrl = (formData.get("sourceUrl") as string) || null;

  if (!title) return { ok: false, error: "Title is required" };

  let embedding: number[] = [];
  try {
    embedding = (await getEmbedding(`${title}\n${content}`)) ?? [];
  } catch {
    // no API key -> store without embedding, keyword fallback still works
  }

  try {
    if (originalId && originalId !== title) {
      await prisma.knowledgeDoc.delete({ where: { id: originalId } }).catch(() => {});
    }
    await prisma.knowledgeDoc.upsert({
      where: { id: title },
      update: { category, content, sourceUrl, embedding },
      create: { id: title, category, title, content, sourceUrl, embedding },
    });
    revalidatePath("/admin/knowledge");
    return { ok: true };
  } catch (e) {
    console.error("saveKnowledge failed:", e);
    return { ok: false, error: "Database error while saving" };
  }
}

export async function deleteKnowledge(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const id = (formData.get("id") as string) || "";
  try {
    await prisma.knowledgeDoc.delete({ where: { id } });
    revalidatePath("/admin/knowledge");
    return { ok: true };
  } catch (e) {
    console.error("deleteKnowledge failed:", e);
    return { ok: false, error: "Database error while deleting" };
  }
}

export async function deleteKnowledgeForm(formData: FormData) {
  await deleteKnowledge(formData);
}

function parseNumber(value: FormDataEntryValue | null): number | undefined {
  const n = Number(value ?? NaN);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function parseLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveSystemSettings(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  try {
    await saveSite({
      brand: String(formData.get("brand") ?? "").trim(),
      legalName: String(formData.get("legalName") ?? "").trim(),
      tagline: String(formData.get("tagline") ?? "").trim(),
      domain: String(formData.get("domain") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      salesTeamEmails: parseLines(formData.get("salesTeamEmails")),
      founded: parseNumber(formData.get("founded")),
      machines: parseNumber(formData.get("machines")),
      engineers: parseNumber(formData.get("engineers")),
      annualMolds: parseNumber(formData.get("annualMolds")),
      exportsCountries: parseNumber(formData.get("exportsCountries")),
      certifications: parseLines(formData.get("certifications")),
      leadTimeWeeks: parseNumber(formData.get("leadTimeWeeks")),
      deliveryRate: parseNumber(formData.get("deliveryRate")),
    });
    for (const p of ["/", "/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) {
      revalidatePath(p);
    }
    return { ok: true };
  } catch (e) {
    console.error("saveSystemSettings failed:", e);
    return { ok: false, error: "Database error while saving settings" };
  }
}
