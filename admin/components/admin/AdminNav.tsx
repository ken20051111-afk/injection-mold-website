"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

const groups: { title: string; links: NavLink[] }[] = [
  {
    title: "概览",
    links: [{ href: "/admin", label: "仪表盘" }],
  },
  {
    title: "内容",
    links: [
      { href: "/admin/capability", label: "核心能力" },
      { href: "/admin/industry", label: "行业" },
      { href: "/admin/caseStudy", label: "案例研究" },
      { href: "/admin/post", label: "博客" },
    ],
  },
  {
    title: "智能",
    links: [{ href: "/admin/knowledge", label: "AI 知识库" }],
  },
  {
    title: "系统",
    links: [{ href: "/admin/system", label: "设置" }],
  },
  {
    title: "销售",
    links: [
      { href: "/crm", label: "CRM 仪表盘" },
      { href: "/crm/rfqs", label: "询价单" },
      { href: "/crm/contacts", label: "联系人" },
      { href: "/crm/companies", label: "公司" },
    ],
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
          <p className="text-sm font-bold text-steel-900">勇鑫塑胶 后台</p>
          <p className="text-xs text-slate-400">网站管理</p>
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
          查看网站 &rarr;
        </Link>
      </div>
    </div>
  );
}
