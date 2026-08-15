import Link from "next/link";

const links = [
  { href: "/crm", label: "Dashboard" },
  { href: "/crm/rfqs", label: "RFQs" },
  { href: "/admin", label: "Content Admin" },
];

export function CrmNav() {
  return (
    <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent-500">Internal CRM</p>
        <h1 className="text-2xl font-black text-steel-900">MoldCraft Lead Management</h1>
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
