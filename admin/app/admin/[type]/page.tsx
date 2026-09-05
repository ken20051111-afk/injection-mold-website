import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { contentTypes, type ContentType } from "@/lib/content";
import { getPublicSiteBase } from "@/lib/settings";
import { Card } from "@/components/ui";
import { deleteContentForm } from "@/app/admin/actions";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ type: string }>;
};

export default async function ContentListPage({ params }: PageProps) {
  const { type } = await params;
  const meta = contentTypes.find((c) => c.type === type);
  if (!meta) notFound();

  const siteBase = await getPublicSiteBase();

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
          <p className="text-sm text-slate-500">{rows.length} 条</p>
        </div>
        <Link
          href={`/admin/${meta.type}/new/edit`}
          className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          + 新建{meta.label.slice(0, -1)}
        </Link>
      </div>

      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-500">
          暂无内容。点击“+ 新建”创建第一条。
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
                      草稿
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-400">
                  /{meta.publicBase}/{row.slug} &middot; 更新于 {row.updatedAt.toLocaleString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`${siteBase}${meta.publicBase}/${row.slug}`}
                  target="_blank"
                  className="rounded-sm border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
                >
                  查看
                </Link>
                <Link
                  href={`/admin/${meta.type}/${row.slug}/edit`}
                  className="rounded-sm bg-steel-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-steel-800"
                >
                  编辑
                </Link>
                <form action={deleteContentForm}>
                  <input type="hidden" name="type" value={meta.type} />
                  <input type="hidden" name="slug" value={row.slug} />
                  <DeleteConfirmButton title={row.title} />
                </form>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
