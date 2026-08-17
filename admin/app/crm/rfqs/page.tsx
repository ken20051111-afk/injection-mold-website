import Link from "next/link";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";
import { RfqFilters } from "@/components/crm/RfqFilters";
import { Prisma } from "@/generated/prisma/client";

export const metadata = {
  title: "全部询价 | CRM",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 20;

function priorityBadge(score: number | null) {
  if (score === null) return null;
  const level = score >= 70 ? "bg-red-500/10 text-red-600 border-red-500/30" : score >= 50 ? "bg-amber-500/10 text-amber-600 border-amber-500/30" : "bg-slate-500/10 text-slate-500 border-slate-500/30";
  return <span className={`rounded-sm border px-2 py-0.5 text-xs font-bold ${level}`}>{score}/100</span>;
}

type PageProps = {
  searchParams: Promise<{
    status?: string;
    source?: string;
    search?: string;
    page?: string;
    minScore?: string;
    maxScore?: string;
  }>;
};

export default async function RfqsPage({ searchParams }: PageProps) {
  await requireCrmAuth();
  const params = await searchParams;
  const status = params.status || "";
  const source = params.source || "";
  const search = params.search || "";
  const minScore = params.minScore ? parseInt(params.minScore) : undefined;
  const maxScore = params.maxScore ? parseInt(params.maxScore) : undefined;
  const page = Math.max(1, parseInt(params.page || "1"));

  const where: Prisma.RfqWhereInput = {};
  if (status) where.status = status;
  if (source) where.source = source;
  if (search) {
    where.OR = [
      { projectName: { contains: search, mode: "insensitive" } },
      { contact: { email: { contains: search, mode: "insensitive" } } },
      { contact: { company: { name: { contains: search, mode: "insensitive" } } } },
    ];
  }
  if (minScore !== undefined || maxScore !== undefined) {
    const scoreFilter: Prisma.IntFilter = {};
    if (minScore !== undefined) scoreFilter.gte = minScore;
    if (maxScore !== undefined) scoreFilter.lte = maxScore;
    where.score = { score: scoreFilter };
  }

  let rfqs: {
    id: string;
    projectName: string | null;
    status: string;
    source: string;
    createdAt: Date;
    materials: string[];
    contact: { email: string; company: { name: string } | null };
    score: { score: number } | null;
  }[] = [];
  let totalCount = 0;

  try {
    [rfqs, totalCount] = await Promise.all([
      prisma.rfq.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          projectName: true,
          status: true,
          source: true,
          createdAt: true,
          materials: true,
          contact: { select: { email: true, company: { select: { name: true } } } },
          score: { select: { score: true } },
        },
      }),
      prisma.rfq.count({ where }),
    ]);
  } catch (e) {
    console.error("RFQ list query failed:", e);
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function buildUrl(overrides: Record<string, string>) {
    const sp = new URLSearchParams();
    if (status) sp.set("status", status);
    if (source) sp.set("source", source);
    if (search) sp.set("search", search);
    if (minScore !== undefined) sp.set("minScore", String(minScore));
    if (maxScore !== undefined) sp.set("maxScore", String(maxScore));
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    return `/crm/rfqs?${sp.toString()}`;
  }

  const statuses = ["new", "reviewing", "quoted", "won", "lost"];
  const sources = ["quote_form", "ai_chat", "contact_form"];

  return (
    <Container className="py-10">
      <CrmNav />

      <RfqFilters
        status={status}
        source={source}
        search={search}
        minScore={minScore}
        maxScore={maxScore}
        statuses={statuses}
        sources={sources}
      />

      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>共 {totalCount} 条询价</span>
        <span>
          第 {page} / {totalPages || 1} 页
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">公司</th>
              <th className="px-4 py-3">项目</th>
              <th className="px-4 py-3">材料</th>
              <th className="px-4 py-3">评分</th>
              <th className="px-4 py-3">来源</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">收到时间</th>
            </tr>
          </thead>
          <tbody>
            {rfqs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  暂无询价。从 /quote 提交一条来测试整条流程。
                </td>
              </tr>
            ) : (
              rfqs.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/crm/rfqs/${r.id}`} className="font-mono text-xs text-accent-500 hover:underline">
                      {r.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold text-steel-700">
                    {r.contact.company?.name ?? "未知"}
                    <span className="block text-xs font-normal text-slate-400">{r.contact.email}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.projectName ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{r.materials.join(", ") || "-"}</td>
                  <td className="px-4 py-3">{priorityBadge(r.score?.score ?? null)}</td>
                  <td className="px-4 py-3 text-slate-600">{r.source}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-sm border px-2 py-0.5 text-xs font-bold ${
                      r.status === "new" ? "border-blue-500/30 bg-blue-500/10 text-blue-600"
                      : r.status === "won" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                      : "border-slate-500/30 bg-slate-500/10 text-slate-500"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.createdAt.toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
            >
              上一页
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-slate-500">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
            >
              下一页
            </Link>
          )}
        </div>
      )}
    </Container>
  );
}
