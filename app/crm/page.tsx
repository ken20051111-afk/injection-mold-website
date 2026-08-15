import Link from "next/link";
import { requireCrmAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui";
import { CrmNav } from "@/components/crm/CrmNav";

export const metadata = {
  title: "CRM Dashboard",
  robots: { index: false, follow: false },
};

export default async function CrmDashboardPage() {
  await requireCrmAuth();

  let stats = { new: 0, quoted: 0, won: 0, total: 0 };

  try {
    const [newCount, quotedCount, wonCount, total] = await Promise.all([
      prisma.rfq.count({ where: { status: "new" } }),
      prisma.rfq.count({ where: { status: "quoted" } }),
      prisma.rfq.count({ where: { status: "won" } }),
      prisma.rfq.count(),
    ]);
    stats = { new: newCount, quoted: quotedCount, won: wonCount, total };
  } catch (e) {
    console.error("CRM dashboard query failed:", e);
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

  const cards = [
    { label: "New RFQs", value: stats.new },
    { label: "Quoted", value: stats.quoted },
    { label: "Won", value: stats.won },
    { label: "Total RFQs", value: stats.total },
  ];

  return (
    <Container className="py-10">
      <CrmNav />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-black text-steel-900">{c.value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-lg font-bold text-steel-900">Priority RFQs (score &ge; 50)</h2>
      {urgent.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
          No priority RFQs yet. New quote requests will appear here automatically.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-steel-900 text-white">
              <tr>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received</th>
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
                  <td className="px-4 py-3 font-semibold text-steel-700">{r.contact.company?.name ?? "Unknown"}</td>
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
