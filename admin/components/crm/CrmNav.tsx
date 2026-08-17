import Link from "next/link";

const links = [
  { href: "/crm", label: "仪表盘" },
  { href: "/crm/rfqs", label: "询价单" },
  { href: "/crm/contacts", label: "联系人" },
  { href: "/crm/companies", label: "公司" },
  { href: "/admin", label: "内容后台" },
];

export function CrmNav() {
  return (
    <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent-500">内部 CRM</p>
        <h1 className="text-2xl font-black text-steel-900">勇鑫塑胶 线索管理</h1>
      </div>
      <nav className="flex gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-sm border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
