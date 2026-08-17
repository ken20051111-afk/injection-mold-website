import Link from "next/link";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";
import { ContactFilters } from "@/components/crm/ContactFilters";

export const metadata = {
  title: "联系人管理 | CRM",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 20;

type PageProps = {
  searchParams: Promise<{
    search?: string;
    company?: string;
    page?: string;
  }>;
};

export default async function ContactsPage({ searchParams }: PageProps) {
  await requireCrmAuth();
  const params = await searchParams;
  const search = params.search || "";
  const company = params.company || "";
  const page = Math.max(1, parseInt(params.page || "1"));

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }
  if (company) {
    where.company = { name: { contains: company, mode: "insensitive" } };
  }

  let contacts: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    jobTitle: string | null;
    phone: string | null;
    source: string | null;
    createdAt: Date;
    company: { name: string } | null;
    _count: { rfqs: number };
  }[] = [];
  let totalCount = 0;

  try {
    [contacts, totalCount] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          jobTitle: true,
          phone: true,
          source: true,
          createdAt: true,
          company: { select: { name: true } },
          _count: { select: { rfqs: true } },
        },
      }),
      prisma.contact.count({ where }),
    ]);
  } catch (e) {
    console.error("Contacts list query failed:", e);
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function buildUrl(overrides: Record<string, string>) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (company) sp.set("company", company);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    return `/crm/contacts?${sp.toString()}`;
  }

  return (
    <Container className="py-10">
      <CrmNav />

      <ContactFilters search={search} company={company} />

      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>共 {totalCount} 个联系人</span>
        <span>
          第 {page} / {totalPages || 1} 页
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">姓名</th>
              <th className="px-4 py-3">邮箱</th>
              <th className="px-4 py-3">公司</th>
              <th className="px-4 py-3">职位</th>
              <th className="px-4 py-3">电话</th>
              <th className="px-4 py-3">来源</th>
              <th className="px-4 py-3">询价数</th>
              <th className="px-4 py-3">添加时间</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  暂无联系人。
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/crm/contacts/${c.id}`} className="font-semibold text-steel-700 hover:text-accent-500 hover:underline">
                      {[c.firstName, c.lastName].filter(Boolean).join(" ") || "未知"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.company ? (
                      <Link href={`/crm/companies?search=${encodeURIComponent(c.company.name)}`} className="hover:text-accent-500 hover:underline">
                        {c.company.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.jobTitle ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.phone ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.source ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{c._count.rfqs}</td>
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
