import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { contentTypes, emptyContent, recordToFormData, type ContentType } from "@/lib/content";
import { EditForm } from "@/components/admin/EditForm";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ type: string; slug: string }>;
};

export default async function ContentEditPage({ params }: PageProps) {
  const { type, slug } = await params;
  const meta = contentTypes.find((c) => c.type === type);
  if (!meta) notFound();

  let initial: Record<string, unknown>;
  const originalSlug = slug === "new" ? "" : slug;

  if (slug === "new") {
    initial = emptyContent(type as ContentType);
  } else {
    const row = await prisma.contentPage
      .findFirst({ where: { type: type as ContentType, slug } })
      .catch(() => null);
    if (!row) notFound();
    initial = recordToFormData(type as ContentType, { slug: row.slug, data: row.data });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-500">
            {slug === "new" ? "新建" : "编辑"} {meta.label.slice(0, -1)}
          </p>
          <h2 className="text-xl font-bold text-steel-900">
            {slug === "new" ? `创建${meta.label.slice(0, -1)}` : initial.title as string}
          </h2>
        </div>
        <Link
          href={`/admin/${meta.type}`}
          className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
        >
          &larr; 返回
        </Link>
      </div>
      <EditForm type={meta.type} originalSlug={originalSlug} initial={initial} />
    </div>
  );
}
