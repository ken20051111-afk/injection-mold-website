import Link from "next/link";
import { prisma } from "@/lib/db";
import { contentTypes } from "@/lib/content";
import { Card } from "@/components/ui";

export default async function AdminDashboard() {
  const [contentCount, knowledgeCount, rfqCount] = await Promise.all([
    prisma.contentPage.groupBy({ by: ["type"], _count: { _all: true } }).catch(() => []),
    prisma.knowledgeDoc.count().catch(() => 0),
    prisma.rfq.count().catch(() => 0),
  ]);

  const counts = new Map(contentCount.map((r) => [r.type, r._count._all]));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-6">
          <p className="text-3xl font-black text-steel-900">{rfqCount}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">RFQs</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-black text-steel-900">{knowledgeCount}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">AI Knowledge Docs</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-black text-steel-900">
            {contentTypes.reduce((n, c) => n + (counts.get(c.type) ?? 0), 0)}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Content Pages</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-black text-steel-900">60s</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Cache Refresh</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contentTypes.map((ct) => (
          <Card key={ct.type} className="flex items-center justify-between p-6">
            <div>
              <p className="font-bold text-steel-900">{ct.label}</p>
              <p className="mt-1 text-sm text-slate-500">
                {counts.get(ct.type) ?? 0} items &middot; {ct.publicBase}
              </p>
            </div>
            <Link
              href={`/admin/${ct.type}`}
              className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
            >
              Manage
            </Link>
          </Card>
        ))}
        <Card className="flex items-center justify-between p-6">
          <div>
            <p className="font-bold text-steel-900">AI Knowledge Base</p>
            <p className="mt-1 text-sm text-slate-500">{knowledgeCount} docs used by the chat assistant</p>
          </div>
          <Link
            href="/admin/knowledge"
            className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Manage
          </Link>
        </Card>
        <Card className="flex items-center justify-between p-6">
          <div>
            <p className="font-bold text-steel-900">System Settings</p>
            <p className="mt-1 text-sm text-slate-500">Brand, contact info, integration status</p>
          </div>
          <Link
            href="/admin/system"
            className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Open
          </Link>
        </Card>
        <Card className="flex items-center justify-between p-6">
          <div>
            <p className="font-bold text-steel-900">Sales CRM</p>
            <p className="mt-1 text-sm text-slate-500">RFQ pipeline, scoring and quotes</p>
          </div>
          <Link
            href="/crm"
            className="rounded-sm bg-steel-900 px-4 py-2 text-sm font-semibold text-white hover:bg-steel-800"
          >
            Open CRM
          </Link>
        </Card>
      </div>

      <Card className="p-6 text-sm text-slate-600">
        <p className="font-bold text-steel-900">How content management works</p>
        <p className="mt-2">
          Edited content is stored in the database and picked up by the public site within 60 seconds
          (ISR revalidation). No code changes or redeploys needed. New items with a new slug appear
          on the list page, sitemap and (after the next index) search engines automatically.
        </p>
      </Card>
    </div>
  );
}
