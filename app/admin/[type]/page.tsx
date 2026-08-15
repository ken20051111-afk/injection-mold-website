import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { contentTypes, type ContentType } from "@/lib/content";
import { Card } from "@/components/ui";
import { deleteContentForm } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ type: string }>;
};

export default async function ContentListPage({ params }: PageProps) {
  const { type } = await params;
  const meta = contentTypes.find((c) => c.type === type);
  if (!meta) notFound();

  const rows = await prisma.contentPage
    .findMany({
      where: { type: meta.type as ContentType },
      select: { slug: true, title: true, excerpt: true, published: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-steel-900">{meta.label}</h2>
          <p className="text-sm text-slate-500">{rows.length} items</p>
        </div>
        <Link
          href={`/admin/${meta.type}/new/edit`}
          className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + New {meta.label.slice(0, -1)}
        </Link>
      </div>

      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-500">
          No content yet. Click “+ New” to create the first one.
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <Card key={row.slug} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-bold text-steel-900">{row.title}</p>
                  {!row.published && (
                    <span className="shrink-0 rounded-sm border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                      DRAFT
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-400">
                  /{meta.publicBase}/{row.slug} &middot; updated {row.updatedAt.toLocaleString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`${meta.publicBase}/${row.slug}`}
                  target="_blank"
                  className="rounded-sm border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
                >
                  View
                </Link>
                <Link
                  href={`/admin/${meta.type}/${row.slug}/edit`}
                  className="rounded-sm bg-steel-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-steel-800"
                >
                  Edit
                </Link>
                <form action={deleteContentForm}>
                  <input type="hidden" name="type" value={meta.type} />
                  <input type="hidden" name="slug" value={row.slug} />
                  <button
                    type="submit"
                    className="rounded-sm border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      if (!confirm(`Delete "${row.title}"?`)) e.preventDefault();
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
