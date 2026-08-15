"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

const groups: { title: string; links: NavLink[] }[] = [
  {
    title: "Overview",
    links: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    title: "Content",
    links: [
      { href: "/admin/capability", label: "Capabilities" },
      { href: "/admin/industry", label: "Industries" },
      { href: "/admin/caseStudy", label: "Case Studies" },
      { href: "/admin/post", label: "Blog" },
    ],
  },
  {
    title: "Intelligence",
    links: [{ href: "/admin/knowledge", label: "AI Knowledge" }],
  },
  {
    title: "System",
    links: [{ href: "/admin/system", label: "Settings" }],
  },
  {
    title: "Sales",
    links: [{ href: "/crm", label: "CRM / RFQ" }],
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent-500 font-black text-white">
          MC
        </span>
        <div>
          <p className="text-sm font-bold text-steel-900">MoldCraft Admin</p>
          <p className="text-xs text-slate-400">Site management</p>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {group.title}
          </p>
          <div className="space-y-1">
            {group.links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-sm px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-steel-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-steel-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-auto border-t border-slate-200 pt-4">
        <Link
          href="/"
          target="_blank"
          className="block rounded-sm border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
        >
          View site &rarr;
        </Link>
      </div>
    </div>
  );
}
