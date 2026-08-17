import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, Container, SpecTable } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";

export const metadata = {
  title: "公司详情 | CRM",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyDetailPage({ params }: PageProps) {
  await requireCrmAuth();
  const { id } = await params;

  let company = null;
  try {
    company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: {
          orderBy: { createdAt: "desc" },
        },
        rfqs: {
          orderBy: { createdAt: "desc" },
          include: {
            score: { select: { score: true } },
            contact: { select: { email: true } },
          },
        },
        emailLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  } catch (e) {
    console.error("Company detail query failed:", e);
  }

  if (!company) notFound();

  return (
    <Container className="py-10">
      <CrmNav />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-accent-500">{company.id}</p>
          <h1 className="text-2xl font-black text-steel-900">{company.name}</h1>
          {company.domain && <p className="text-sm text-slate-500">{company.domain}</p>}
        </div>
        <div className="flex items-center gap-3">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
            >
              访问网站
            </a>
          )}
          <Link
            href="/crm/companies"
            className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
          >
            返回列表
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">公司信息</p>
            <SpecTable
              rows={[
                { label: "公司名称", value: company.name },
                { label: "域名", value: company.domain ?? "-" },
                { label: "行业", value: company.industry ?? "-" },
                { label: "国家", value: company.country ?? "-" },
                { label: "地区", value: company.region ?? "-" },
                { label: "员工规模", value: company.employees ?? "-" },
                { label: "营收范围", value: company.revenueRange ?? "-" },
                { label: "网站", value: company.website ?? "-" },
                { label: "LinkedIn", value: company.linkedinUrl ?? "-" },
                { label: "添加时间", value: company.createdAt.toLocaleDateString() },
              ]}
            />
          </Card>

          {company.contacts.length > 0 && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">联系人 ({company.contacts.length})</p>
              <div className="space-y-3">
                {company.contacts.map((contact) => (
                  <Link
                    key={contact.id}
                    href={`/crm/contacts/${contact.id}`}
                    className="block rounded-md border border-slate-100 p-4 hover:border-accent-500/30 hover:bg-accent-500/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-steel-700">
                          {[contact.firstName, contact.lastName].filter(Boolean).join(" ") || "未知"}
                        </p>
                        <p className="text-xs text-slate-500">{contact.email}</p>
                      </div>
                      <div className="text-right">
                        {contact.jobTitle && <p className="text-xs text-slate-500">{contact.jobTitle}</p>}
                        {contact.phone && <p className="text-xs text-slate-400">{contact.phone}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {company.rfqs.length > 0 && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">询价记录 ({company.rfqs.length})</p>
              <div className="space-y-3">
                {company.rfqs.map((rfq) => (
                  <Link
                    key={rfq.id}
                    href={`/crm/rfqs/${rfq.id}`}
                    className="block rounded-md border border-slate-100 p-4 hover:border-accent-500/30 hover:bg-accent-500/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-steel-700">{rfq.projectName ?? "未命名项目"}</p>
                        <p className="text-xs text-slate-500">
                          {rfq.materials.join(", ") || "材料未填"} · {rfq.contact.email}
                        </p>
                      </div>
                      <div className="text-right">
                        {rfq.score && (
                          <span
                            className={`rounded-sm border px-2 py-0.5 text-xs font-bold ${
                              rfq.score.score >= 70
                                ? "border-red-500/30 bg-red-500/10 text-red-600"
                                : rfq.score.score >= 50
                                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
                                  : "border-slate-500/30 bg-slate-500/10 text-slate-500"
                            }`}
                          >
                            {rfq.score.score}/100
                          </span>
                        )}
                        <p className="mt-1 text-xs text-slate-400">
                          <span className={`rounded-sm border px-2 py-0.5 text-[11px] font-bold ${
                            rfq.status === "new" ? "border-blue-500/30 bg-blue-500/10 text-blue-600"
                            : rfq.status === "won" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                            : "border-slate-500/30 bg-slate-500/10 text-slate-500"
                          }`}>
                            {rfq.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {company.emailLogs.length > 0 && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">邮件活动</p>
              <ul className="space-y-3">
                {company.emailLogs.map((log) => (
                  <li key={log.id} className="text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-steel-700">{log.templateKey}</span>
                      <span
                        className={`shrink-0 rounded-sm border px-2 py-0.5 text-[11px] font-bold ${
                          log.status === "opened"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                            : log.status === "sent"
                              ? "border-slate-500/30 bg-slate-500/10 text-slate-500"
                              : log.status === "failed"
                                ? "border-red-500/30 bg-red-500/10 text-red-600"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {log.status === "opened"
                        ? `已打开 ${log.openedAt?.toLocaleString()}`
                        : log.createdAt.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-6">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">操作</p>
            <ul className="space-y-2 text-sm">
              {company.website && (
                <li>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">
                    访问公司网站
                  </a>
                </li>
              )}
              {company.linkedinUrl && (
                <li>
                  <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">
                    查看 LinkedIn
                  </a>
                </li>
              )}
              <li><Link href="/crm/companies" className="text-accent-500 hover:underline">返回公司列表</Link></li>
            </ul>
          </Card>
        </div>
      </div>
    </Container>
  );
}
