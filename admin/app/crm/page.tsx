import Link from "next/link";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";

export const metadata = {
  title: "CRM 仪表盘",
  robots: { index: false, follow: false },
};

export default async function CrmDashboardPage() {
  await requireCrmAuth();

  let stats = { new: 0, quoted: 0, won: 0, lost: 0, reviewing: 0, total: 0 };

  try {
    const [newCount, quotedCount, wonCount, lostCount, reviewingCount, total] = await Promise.all([
      prisma.rfq.count({ where: { status: "new" } }),
      prisma.rfq.count({ where: { status: "quoted" } }),
      prisma.rfq.count({ where: { status: "won" } }),
      prisma.rfq.count({ where: { status: "lost" } }),
      prisma.rfq.count({ where: { status: "reviewing" } }),
      prisma.rfq.count(),
    ]);
    stats = { new: newCount, quoted: quotedCount, won: wonCount, lost: lostCount, reviewing: reviewingCount, total };
  } catch (e) {
    console.error("CRM dashboard query failed:", e);
  }

  let sourceStats: { source: string; count: number }[] = [];
  try {
    sourceStats = await prisma.rfq.groupBy({
      by: ["source"],
      _count: { source: true },
      orderBy: { _count: { source: "desc" } },
    }) as unknown as { source: string; count: number }[];
  } catch (e) {
    console.error("Source stats query failed:", e);
  }

  let industryStats: { industry: string | null; count: number }[] = [];
  try {
    industryStats = await prisma.company.groupBy({
      by: ["industry"],
      _count: { industry: true },
      where: { industry: { not: null } },
      orderBy: { _count: { industry: "desc" } },
      take: 5,
    }) as unknown as { industry: string | null; count: number }[];
  } catch (e) {
    console.error("Industry stats query failed:", e);
  }

  let countryStats: { country: string | null; count: number }[] = [];
  try {
    countryStats = await prisma.company.groupBy({
      by: ["country"],
      _count: { country: true },
      where: { country: { not: null } },
      orderBy: { _count: { country: "desc" } },
      take: 5,
    }) as unknown as { country: string | null; count: number }[];
  } catch (e) {
    console.error("Country stats query failed:", e);
  }

  type UrgentRow = {
    id: string;
    priority: number;
    status: string;
    source: string;
    createdAt: Date;
    contact: { company: { name: string } | null; email: string };
    score: { score: number } | null;
  };
  let urgent: UrgentRow[] = [];
  try {
    urgent = await prisma.rfq.findMany({
      where: { priority: { gte: 2 }, status: "new" },
      orderBy: { priority: "desc" },
      take: 8,
      select: {
        id: true,
        priority: true,
        status: true,
        source: true,
        createdAt: true,
        contact: { select: { company: { select: { name: true } }, email: true } },
        score: { select: { score: true } },
      },
    });
  } catch (e) {
    console.error("CRM urgent query failed:", e);
  }

  const conversionRate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : "0";

  const cards = [
    { label: "新询价", value: stats.new, color: "text-blue-600" },
    { label: "审核中", value: stats.reviewing, color: "text-amber-600" },
    { label: "已报价", value: stats.quoted, color: "text-purple-600" },
    { label: "已成交", value: stats.won, color: "text-emerald-600" },
    { label: "已流失", value: stats.lost, color: "text-red-600" },
    { label: "询价总数", value: stats.total, color: "text-steel-900" },
    { label: "转化率", value: `${conversionRate}%`, color: "text-accent-500" },
  ];

  const sourceLabels: Record<string, string> = {
    quote_form: "报价表单",
    ai_chat: "AI 客服",
    contact_form: "联系表单",
  };

  return (
    <Container className="py-10">
      <CrmNav />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">来源分布</p>
          {sourceStats.length === 0 ? (
            <p className="text-sm text-slate-500">暂无数据</p>
          ) : (
            <ul className="space-y-3">
              {sourceStats.map((s) => (
                <li key={s.source} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{sourceLabels[s.source] || s.source}</span>
                  <span className="text-sm font-bold text-steel-700">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">行业分布 (Top 5)</p>
          {industryStats.length === 0 ? (
            <p className="text-sm text-slate-500">暂无数据</p>
          ) : (
            <ul className="space-y-3">
              {industryStats.map((s) => (
                <li key={s.industry} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{s.industry}</span>
                  <span className="text-sm font-bold text-steel-700">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">国家分布 (Top 5)</p>
          {countryStats.length === 0 ? (
            <p className="text-sm text-slate-500">暂无数据</p>
          ) : (
            <ul className="space-y-3">
              {countryStats.map((s) => (
                <li key={s.country} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{s.country}</span>
                  <span className="text-sm font-bold text-steel-700">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <h2 className="mb-4 mt-12 text-lg font-bold text-steel-900">高优先级询价（评分 &ge; 50）</h2>
      {urgent.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
          暂无高优先级询价。新的报价请求会自动显示在这里。
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-steel-900 text-white">
              <tr>
                <th className="px-4 py-3">评分</th>
                <th className="px-4 py-3">公司</th>
                <th className="px-4 py-3">来源</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">收到时间</th>
              </tr>
            </thead>
            <tbody>
              {urgent.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/crm/rfqs/${r.id}`} className="font-black text-accent-500 hover:underline">
                      {r.score?.score ?? r.priority}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold text-steel-700">{r.contact.company?.name ?? "未知"}</td>
                  <td className="px-4 py-3 text-slate-600">{r.source}</td>
                  <td className="px-4 py-3 text-slate-600">{r.status}</td>
                  <td className="px-4 py-3 text-slate-600">{r.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
