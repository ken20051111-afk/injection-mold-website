import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, Container, SpecTable } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";

export const metadata = {
  title: "联系人详情 | CRM",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContactDetailPage({ params }: PageProps) {
  await requireCrmAuth();
  const { id } = await params;

  let contact = null;
  try {
    contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        rfqs: {
          orderBy: { createdAt: "desc" },
          include: {
            score: { select: { score: true } },
            items: { select: { partName: true, cavity: true, material: true } },
          },
        },
        emailLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  } catch (e) {
    console.error("Contact detail query failed:", e);
  }

  if (!contact) notFound();

  return (
    <Container className="py-10">
      <CrmNav />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-accent-500">{contact.id}</p>
          <h1 className="text-2xl font-black text-steel-900">
            {[contact.firstName, contact.lastName].filter(Boolean).join(" ") || "未知联系人"}
          </h1>
          <p className="text-sm text-slate-500">{contact.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="rounded-sm bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            发送邮件
          </a>
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
            >
              拨打电话
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">基本信息</p>
            <SpecTable
              rows={[
                { label: "邮箱", value: contact.email },
                { label: "姓名", value: [contact.firstName, contact.lastName].filter(Boolean).join(" ") || "-" },
                { label: "职位", value: contact.jobTitle ?? "-" },
                { label: "电话", value: contact.phone ?? "-" },
                { label: "来源", value: contact.source ?? "-" },
                { label: "公司", value: contact.company?.name ?? "-" },
                { label: "GDPR 同意", value: contact.consentGdpr ? "是" : "否" },
                { label: "添加时间", value: contact.createdAt.toLocaleDateString() },
              ]}
            />
          </Card>

          {contact.rfqs.length > 0 && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">关联询价 ({contact.rfqs.length})</p>
              <div className="space-y-3">
                {contact.rfqs.map((rfq) => (
                  <Link
                    key={rfq.id}
                    href={`/crm/rfqs/${rfq.id}`}
                    className="block rounded-md border border-slate-100 p-4 hover:border-accent-500/30 hover:bg-accent-500/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-steel-700">{rfq.projectName ?? "未命名项目"}</p>
                        <p className="text-xs text-slate-500">
                          {rfq.materials.join(", ") || "材料未填"} · {rfq.items.length} 个零件
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
          {contact.emailLogs.length > 0 && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">邮件活动</p>
              <ul className="space-y-3">
                {contact.emailLogs.map((log) => (
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

          {contact.company && (
            <Card className="p-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">公司信息</p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-steel-700">{contact.company.name}</p>
                {contact.company.industry && <p className="text-slate-500">行业: {contact.company.industry}</p>}
                {contact.company.country && <p className="text-slate-500">国家: {contact.company.country}</p>}
                {contact.company.website && (
                  <p>
                    <a href={contact.company.website} target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">
                      公司网站
                    </a>
                  </p>
                )}
                <Link href={`/crm/companies?search=${encodeURIComponent(contact.company.name)}`} className="text-accent-500 hover:underline">
                  查看公司详情
                </Link>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">操作</p>
            <ul className="space-y-2 text-sm">
              <li><a href={`mailto:${contact.email}`} className="text-accent-500 hover:underline">邮件联系</a></li>
              <li><Link href="/crm/contacts" className="text-accent-500 hover:underline">返回联系人列表</Link></li>
            </ul>
          </Card>
        </div>
      </div>
    </Container>
  );
}
