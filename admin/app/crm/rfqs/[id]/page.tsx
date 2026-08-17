import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, Container, SpecTable } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";
import { updateRfqStatus, generateQuote } from "./actions";
import { formatCny, estimateQuote } from "@/lib/quote-engine";

export const metadata = {
  title: "询价详情 | CRM",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function RfqDetailPage({ params }: PageProps) {
  await requireCrmAuth();
  const { id } = await params;

  let rfq = null;
  try {
    rfq = await prisma.rfq.findUnique({
      where: { id },
      include: {
        contact: {
          include: {
            company: true,
            emailLogs: { orderBy: { createdAt: "desc" }, take: 10 },
          },
        },
        score: true,
        items: true,
        quotes: true,
      },
    });
  } catch (e) {
    console.error("RFQ detail query failed:", e);
  }
  if (!rfq) notFound();

  const cavity = rfq.items[0]?.cavity ?? 1;
  const preview = estimateQuote({
    cavityCount: cavity,
    material: rfq.materials[0],
    annualVolume: rfq.annualVolume ?? undefined,
    tolerance: rfq.items[0]?.tolerance ?? undefined,
    surfaceFinish: rfq.items[0]?.surfaceFinish ?? undefined,
  });

  const statusOptions = ["new", "reviewing", "quoted", "won", "lost"];

  return (
    <Container className="py-10">
      <CrmNav />
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-accent-500">{rfq.id}</p>
          <h1 className="text-2xl font-black text-steel-900">
            {rfq.contact.company?.name ?? "未知公司"}
          </h1>
          <p className="text-sm text-slate-500">{rfq.contact.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {rfq.score && (
            <span
              className={`rounded-sm border px-3 py-1 text-sm font-black ${
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
          <form action={updateRfqStatus}>
            <input type="hidden" name="rfqId" value={rfq.id} />
            <select name="status" defaultValue={rfq.status} onChange={(e) => e.target.form?.requestSubmit()} className="rounded-sm border border-slate-300 px-3 py-2 text-sm">
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">需求信息</p>
            <SpecTable
              rows={[
                { label: "项目", value: rfq.projectName ?? "-" },
                { label: "材料", value: rfq.materials.join(", ") || "-" },
                { label: "年需求量", value: rfq.annualVolume?.toLocaleString() ?? "-" },
                { label: "目标价格", value: rfq.targetPrice ? formatCny(rfq.targetPrice) : "-" },
                { label: "交期", value: rfq.deadline?.toLocaleDateString() ?? "-" },
                { label: "AI 摘要", value: rfq.aiSummary ?? "-" },
                { label: "来源", value: rfq.source },
              ]}
            />
          </Card>

          {rfq.items.length > 0 && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">零件</p>
              <div className="space-y-4">
                {rfq.items.map((item) => (
                  <div key={item.id} className="rounded-md border border-slate-100 bg-slate-50 p-4">
                    <p className="font-semibold text-steel-700">{item.partName ?? "未命名零件"}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.cavity} 腔 · {item.material ?? "材料未填"} ·{" "}
                      {item.tolerance ?? "公差未填"} &middot; {item.surfaceFinish ?? "光洁度未填"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {rfq.quotes.length > 0 ? (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">报价</p>
              <div className="space-y-3">
                {rfq.quotes.map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-md border border-slate-100 p-4">
                    <div>
                      <p className="font-black text-steel-900">{formatCny(q.totalPrice)}</p>
                      <p className="text-xs text-slate-500">
                        交期 {q.leadTimeDays} 天 · {q.moldLifeGuarantee} · {q.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <form action={generateQuote} className="rounded-lg border border-dashed border-accent-500/40 bg-accent-500/5 p-6">
              <input type="hidden" name="rfqId" value={rfq.id} />
              <p className="text-sm font-bold text-steel-900">自动报价估算</p>
              <p className="mt-1 text-sm text-slate-600">
                参数化估算：<span className="font-bold text-accent-500">{formatCny(preview.estimatedCost)}</span>{" "}
                （{formatCny(preview.estimateLow)} - {formatCny(preview.estimateHigh)}）· {preview.leadTimeDays} 天交期              </p>
              <button type="submit" className="mt-4 rounded-sm bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600">
                生成正式报价
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          {rfq.score && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">线索评分明细</p>
              <SpecTable
                rows={[
                  { label: "公司匹配度", value: `${rfq.score.fitScore}/35` },
                  { label: "需求质量", value: `${rfq.score.intentScore}/40` },
                  { label: "互动程度", value: `${rfq.score.engagementScore}/25` },
                  { label: "时机", value: `${rfq.score.timingScore}/10` },
                ]}
              />
              {rfq.score.aiNotes ? (
                <p className="mt-4 text-xs text-slate-500">{rfq.score.aiNotes}</p>
              ) : null}
            </Card>
          )}
          {rfq.contact.emailLogs.length > 0 && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">邮件活动</p>
              <ul className="space-y-3">
                {rfq.contact.emailLogs.map((log) => (
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
              <li><a href={`mailto:${rfq.contact.email}`} className="text-accent-500 hover:underline">邮件联系客户</a></li>
              <li><Link href="/crm/rfqs" className="text-accent-500 hover:underline">返回全部询价</Link></li>
            </ul>
          </Card>
        </div>
      </div>
    </Container>
  );
}
