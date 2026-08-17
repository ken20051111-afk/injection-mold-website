import Link from "next/link";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";
import { CompanyFilters } from "@/components/crm/CompanyFilters";

export const metadata = {
  title: "公司管理 | CRM",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 20;

type PageProps = {
  searchParams: Promise<{
    search?: string;
    industry?: string;
    country?: string;
    page?: string;
  }>;
};

export default async function CompaniesPage({ searchParams }: PageProps) {
  await requireCrmAuth();
  const params = await searchParams;
  const search = params.search || "";
  const industry = params.industry || "";
  const country = params.country || "";
  const page = Math.max(1, parseInt(params.page || "1"));

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { domain: { contains: search, mode: "insensitive" } },
    ];
  }
  if (industry) where.industry = { contains: industry, mode: "insensitive" };
  if (country) where.country = { contains: country, mode: "insensitive" };

  let companies: {
    id: string;
    name: string;
    domain: string | null;
    industry: string | null;
    country: string | null;
    website: string | null;
    createdAt: Date;
    _count: { contacts: number; rfqs: number };
  }[] = [];
  let totalCount = 0;

  try {
    [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          name: true,
          domain: true,
          industry: true,
          country: true,
          website: true,
          createdAt: true,
          _count: { select: { contacts: true, rfqs: true } },
        },
      }),
      prisma.company.count({ where }),
    ]);
  } catch (e) {
    console.error("Companies list query failed:", e);
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function buildUrl(overrides: Record<string, string>) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (industry) sp.set("industry", industry);
    if (country) sp.set("country", country);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    return `/crm/companies?${sp.toString()}`;
  }

  return (
    <Container className="py-10">
      <CrmNav />

      <CompanyFilters search={search} industry={industry} country={country} />

      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>共 {totalCount} 家公司</span>
        <span>
          第 {page} / {totalPages || 1} 页
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">公司名称</th>
              <th className="px-4 py-3">行业</th>
              <th className="px-4 py-3">国家</th>
              <th className="px-4 py-3">联系人</th>
              <th className="px-4 py-3">询价数</th>
              <th className="px-4 py-3">网站</th>
              <th className="px-4 py-3">添加时间</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  暂无公司数据。
                </td>
              </tr>
            ) : (
              companies.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/crm/companies/${c.id}`} className="font-semibold text-steel-700 hover:text-accent-500 hover:underline">
                      {c.name}
                    </Link>
                    {c.domain && <span className="block text-xs text-slate-400">{c.domain}</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.industry ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.country ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{c._count.contacts}</td>
                  <td className="px-4 py-3 text-slate-600">{c._count.rfqs}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">
                        访问
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.createdAt.toLocaleDateString()}</td>
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
