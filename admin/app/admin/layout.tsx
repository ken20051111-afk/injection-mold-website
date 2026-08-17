import { requireCrmAuth } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

const mobileLinks = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/capability", label: "核心能力" },
  { href: "/admin/industry", label: "行业" },
  { href: "/admin/caseStudy", label: "案例" },
  { href: "/admin/post", label: "博客" },
  { href: "/admin/knowledge", label: "知识库" },
  { href: "/admin/system", label: "设置" },
  { href: "/crm", label: "CRM" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireCrmAuth();
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between sm:hidden">
          <span className="text-sm font-bold text-steel-900">勇鑫塑胶 后台</span>
          <a href="/" target="_blank" className="text-xs font-semibold text-accent-500">
            查看网站
          </a>
        </div>
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {mobileLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-sm border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex gap-8">
          <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] w-52 shrink-0 sm:block">
            <AdminNav />
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
