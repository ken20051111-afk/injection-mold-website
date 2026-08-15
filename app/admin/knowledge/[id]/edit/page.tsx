import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { KnowledgeForm } from "@/components/admin/KnowledgeForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function KnowledgeEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";

  let initial: { category: string; title: string; content: string; sourceUrl: string };
  let originalId = "";

  if (isNew) {
    initial = { category: "general", title: "", content: "", sourceUrl: "" };
  } else {
    const doc = await prisma.knowledgeDoc.findUnique({ where: { id } }).catch(() => null);
    if (!doc) notFound();
    originalId = doc.id;
    initial = {
      category: doc.category,
      title: doc.title,
      content: doc.content,
      sourceUrl: doc.sourceUrl ?? "",
    };
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
            {isNew ? "New" : "Edit"} Knowledge Doc
          </p>
          <h2 className="text-xl font-bold text-steel-900">
            {isNew ? "Create Knowledge Doc" : initial.title}
          </h2>
        </div>
        <Link
          href="/admin/knowledge"
          className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
        >
          &larr; Back
        </Link>
      </div>
      <KnowledgeForm originalId={originalId} initial={initial} />
    </div>
  );
}
