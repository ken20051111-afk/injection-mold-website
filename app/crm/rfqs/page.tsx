import Link from "next/link";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";

export const metadata = {
  title: "All RFQs | CRM",
  robots: { index: false, follow: false },
};

function priorityBadge(score: number | null) {
  if (score === null) return null;
  const level = score >= 70 ? "bg-red-500/10 text-red-600 border-red-500/30" : score >= 50 ? "bg-amber-500/10 text-amber-600 border-amber-500/30" : "bg-slate-500/10 text-slate-500 border-slate-500/30";
  return <span className={`rounded-sm border px-2 py-0.5 text-xs font-bold ${level}`}>{score}/100</span>;
}

export default async function RfqsPage() {
  await requireCrmAuth();

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

  try {
    rfqs = await prisma.rfq.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
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
    });
  } catch (e) {
    console.error("RFQ list query failed:", e);
  }

  return (
    <Container className="py-10">
      <CrmNav />
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-white">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Materials</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {rfqs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  No RFQs yet. Submit one from /quote to test the pipeline.
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
                    {r.contact.company?.name ?? "Unknown"}
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
    </Container>
  );
}
