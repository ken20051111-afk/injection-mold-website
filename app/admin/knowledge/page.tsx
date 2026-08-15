import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui";
import { deleteKnowledgeForm } from "@/app/admin/actions";

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
          <h2 className="text-xl font-bold text-steel-900">AI Knowledge Base</h2>
          <p className="text-sm text-slate-500">
            {docs.length} docs &middot; used by the chat assistant (vector + keyword retrieval)
          </p>
        </div>
        <Link
          href="/admin/knowledge/new/edit"
          className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + New Doc
        </Link>
      </div>

      {docs.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-500">
          Knowledge base is empty. Run <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run seed</code> to
          import the built-in docs, or add one manually.
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
                  Edit
                </Link>
                <form action={deleteKnowledgeForm}>
                  <input type="hidden" name="id" value={doc.id} />
                  <button
                    type="submit"
                    className="rounded-sm border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      if (!confirm(`Delete "${doc.title}"?`)) e.preventDefault();
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
