import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, Container, SpecTable } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";
import { updateRfqStatus, generateQuote } from "./actions";
import { formatUsd, estimateQuote } from "@/lib/quote-engine";

export const metadata = {
  title: "RFQ Detail | CRM",
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
            {rfq.contact.company?.name ?? "Unknown Company"}
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
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Requirements</p>
            <SpecTable
              rows={[
                { label: "Project", value: rfq.projectName ?? "-" },
                { label: "Materials", value: rfq.materials.join(", ") || "-" },
                { label: "Annual volume", value: rfq.annualVolume?.toLocaleString() ?? "-" },
                { label: "Target price", value: rfq.targetPrice ? formatUsd(rfq.targetPrice) : "-" },
                { label: "Deadline", value: rfq.deadline?.toLocaleDateString() ?? "-" },
                { label: "AI summary", value: rfq.aiSummary ?? "-" },
                { label: "Source", value: rfq.source },
              ]}
            />
          </Card>

          {rfq.items.length > 0 && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Parts</p>
              <div className="space-y-4">
                {rfq.items.map((item) => (
                  <div key={item.id} className="rounded-md border border-slate-100 bg-slate-50 p-4">
                    <p className="font-semibold text-steel-700">{item.partName ?? "Unnamed part"}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.cavity} cavity &middot; {item.material ?? "material n/a"} &middot;{" "}
                      {item.tolerance ?? "tolerance n/a"} &middot; {item.surfaceFinish ?? "finish n/a"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {rfq.quotes.length > 0 ? (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Quotes</p>
              <div className="space-y-3">
                {rfq.quotes.map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-md border border-slate-100 p-4">
                    <div>
                      <p className="font-black text-steel-900">{formatUsd(q.totalPrice)}</p>
                      <p className="text-xs text-slate-500">
                        Lead time {q.leadTimeDays} days &middot; {q.moldLifeGuarantee} &middot; {q.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <form action={generateQuote} className="rounded-lg border border-dashed border-accent-500/40 bg-accent-500/5 p-6">
              <input type="hidden" name="rfqId" value={rfq.id} />
              <p className="text-sm font-bold text-steel-900">Auto-quote estimate</p>
              <p className="mt-1 text-sm text-slate-600">
                Parametric estimate: <span className="font-bold text-accent-500">{formatUsd(preview.estimatedCost)}</span>{" "}
                ({formatUsd(preview.estimateLow)} - {formatUsd(preview.estimateHigh)}) &middot; {preview.leadTimeDays} days lead time
              </p>
              <button type="submit" className="mt-4 rounded-sm bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-600">
                Generate formal quote
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          {rfq.score && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Lead Score Breakdown</p>
              <SpecTable
                rows={[
                  { label: "Company fit", value: `${rfq.score.fitScore}/35` },
                  { label: "Demand quality", value: `${rfq.score.intentScore}/40` },
                  { label: "Engagement", value: `${rfq.score.engagementScore}/25` },
                  { label: "Timing", value: `${rfq.score.timingScore}/10` },
                ]}
              />
              {rfq.score.aiNotes ? (
                <p className="mt-4 text-xs text-slate-500">{rfq.score.aiNotes}</p>
              ) : null}
            </Card>
          )}
          {rfq.contact.emailLogs.length > 0 && (
            <Card className="p-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Email Activity</p>
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
                        ? `Opened ${log.openedAt?.toLocaleString()}`
                        : log.createdAt.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <Card className="p-6">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Actions</p>
            <ul className="space-y-2 text-sm">
              <li><a href={`mailto:${rfq.contact.email}`} className="text-accent-500 hover:underline">Email the contact</a></li>
              <li><Link href="/crm/rfqs" className="text-accent-500 hover:underline">Back to all RFQs</Link></li>
            </ul>
          </Card>
        </div>
      </div>
    </Container>
  );
}
