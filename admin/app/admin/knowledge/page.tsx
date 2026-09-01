import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui";
import { deleteKnowledgeForm } from "@/app/admin/actions";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";

export const dynamic = "force-dynamic";

export default async function KnowledgeListPage() {
  const docs = await prisma.knowledgeDoc
    .findMany({
      select: { id: true, category: true, title: true, content: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-steel-900">AI 知识库</h2>
          <p className="text-sm text-slate-500">
            {docs.length} 篇文档 &middot; 供聊天助手使用（向量 + 关键词检索）
          </p>
        </div>
        <Link
          href="/admin/knowledge/new/edit"
          className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + 新建文档
        </Link>
      </div>

      {docs.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-500">
          知识库为空。运行 <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run seed</code> 导入内置文档，
          或手动添加一篇。
        </Card>
      ) : (
        <ul className="space-y-3">
          {docs.map((doc) => (
            <Card key={doc.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate font-bold text-steel-900">{doc.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{doc.content}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-accent-500">{doc.category}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/knowledge/${encodeURIComponent(doc.id)}/edit`}
                  className="rounded-sm bg-steel-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-steel-800"
                >
                  编辑
                </Link>
                <form action={deleteKnowledgeForm}>
                  <input type="hidden" name="id" value={doc.id} />
                  <DeleteConfirmButton title={doc.title} />
                </form>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
