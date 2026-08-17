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
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">询价单</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-black text-steel-900">{knowledgeCount}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">AI 知识库文档</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-black text-steel-900">
            {contentTypes.reduce((n, c) => n + (counts.get(c.type) ?? 0), 0)}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">内容页面</p>
        </Card>
        <Card className="p-6">
          <p className="text-3xl font-black text-steel-900">60s</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">缓存刷新</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contentTypes.map((ct) => (
          <Card key={ct.type} className="flex items-center justify-between p-6">
            <div>
              <p className="font-bold text-steel-900">{ct.label}</p>
              <p className="mt-1 text-sm text-slate-500">
                {counts.get(ct.type) ?? 0} 条 &middot; {ct.publicBase}
              </p>
            </div>
            <Link
              href={`/admin/${ct.type}`}
              className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
            >
              管理
            </Link>
          </Card>
        ))}
        <Card className="flex items-center justify-between p-6">
          <div>
            <p className="font-bold text-steel-900">AI 知识库</p>
            <p className="mt-1 text-sm text-slate-500">{knowledgeCount} 份文档，供聊天助手使用</p>
          </div>
          <Link
            href="/admin/knowledge"
            className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            管理
          </Link>
        </Card>
        <Card className="flex items-center justify-between p-6">
          <div>
            <p className="font-bold text-steel-900">系统设置</p>
            <p className="mt-1 text-sm text-slate-500">品牌、联系方式、集成状态</p>
          </div>
          <Link
            href="/admin/system"
            className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            打开
          </Link>
        </Card>
        <Card className="flex items-center justify-between p-6">
          <div>
            <p className="font-bold text-steel-900">销售 CRM</p>
            <p className="mt-1 text-sm text-slate-500">询价管道、评分与报价</p>
          </div>
          <Link
            href="/crm"
            className="rounded-sm bg-steel-900 px-4 py-2 text-sm font-semibold text-white hover:bg-steel-800"
          >
            打开 CRM
          </Link>
        </Card>
      </div>

      <Card className="p-6 text-sm text-slate-600">
        <p className="font-bold text-steel-900">内容管理机制说明</p>
        <p className="mt-2">
          编辑后的内容存储在数据库中，60 秒内（ISR 重新验证）即可在公开网站生效，无需改代码或重新部署。
          带有新 slug 的新条目会自动出现在列表页、站点地图以及（下次索引后）搜索引擎中。
        </p>
      </Card>
    </div>
  );
}
