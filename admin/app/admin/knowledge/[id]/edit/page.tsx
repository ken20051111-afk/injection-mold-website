import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { KnowledgeForm } from "@/components/admin/KnowledgeForm";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

type DocFromDb = Awaited<ReturnType<typeof prisma.knowledgeDoc.findUnique>>;

export default async function KnowledgeEditPage({ params }: PageProps) {
  const { id: rawId } = await params;
  let id: string;
  try {
    id = decodeURIComponent(rawId);
  } catch {
    id = rawId;
  }
  const isNew = id === "new";

  let initial: { category: string; title: string; content: string; sourceUrl: string } = {
    category: "general",
    title: "",
    content: "",
    sourceUrl: "",
  };
  let originalId = "";
  let loadError = "";

  if (isNew) {
    initial = { category: "general", title: "", content: "", sourceUrl: "" };
  } else {
    let doc: DocFromDb;
    try {
      doc = await prisma.knowledgeDoc.findUnique({ where: { id } });
    } catch (e) {
      console.error("knowledge edit load failed:", e);
      loadError = "连接数据库失败，无法加载该文档。请确认数据库可用后重试。";
      doc = null;
    }
    if (!doc) {
      if (!loadError) notFound();
    } else {
      originalId = doc.id;
      initial = {
        category: doc.category,
        title: doc.title,
        content: doc.content,
        sourceUrl: doc.sourceUrl ?? "",
      };
    }
  }

  if (loadError) {
    return (
      <div>
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
            编辑 知识库文档
          </p>
          <h2 className="text-xl font-bold text-steel-900">加载失败</h2>
        </div>
        <Card className="border-red-500/30 bg-red-500/10 p-6 text-red-700">
          <p className="text-sm">{loadError}</p>
        </Card>
        <div className="mt-5">
          <Link
            href="/admin/knowledge"
            className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
          >
            &larr; 返回知识库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
            {isNew ? "新建" : "编辑"} 知识库文档
          </p>
          <h2 className="text-xl font-bold text-steel-900">
            {isNew ? "创建知识库文档" : initial.title}
          </h2>
        </div>
        <Link
          href="/admin/knowledge"
          className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
        >
          &larr; 返回
        </Link>
      </div>
      <KnowledgeForm originalId={originalId} initial={initial} />
    </div>
  );
}