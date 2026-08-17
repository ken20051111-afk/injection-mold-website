import Link from "next/link";
import type { NavItem } from "@/lib/nav";
import type { SiteConfig } from "@/lib/settings";

export function Footer({ nav, site }: { nav: NavItem[]; site: SiteConfig }) {
  return (
    <footer className="bg-steel-900 text-slate-400">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">
              {site.brand.replace(" ", "")}
              <span className="text-accent-400">.</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              {site.tagline}。自 {site.founded} 年成立以来，每年为 {site.exportsCountries}+ 个国家/地区的客户
              制造 {site.annualMolds}+ 套模具。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {site.certifications.map((c) => (
                <span key={c} className="rounded-sm border border-slate-700 px-2 py-1 text-[11px] font-semibold text-slate-300">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">快速导航</p>
            <ul className="space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-accent-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">热门内容</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/capabilities/precision-molds" className="hover:text-accent-400">精密模具</Link></li>
              <li><Link href="/capabilities/multi-cavity-molds" className="hover:text-accent-400">多腔模具</Link></li>
              <li><Link href="/resources/quoting-guide" className="hover:text-accent-400">模具报价指南</Link></li>
              <li><Link href="/resources/blog/injection-mold-cost-guide" className="hover:text-accent-400">注塑模具价格</Link></li>
              <li><Link href="/about" className="hover:text-accent-400">走进我们工厂</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">联系方式</p>
            <ul className="space-y-2 text-sm">
              <li>{site.address}</li>
              <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-accent-400">{site.phone}</a></li>
              <li><a href={`mailto:${site.email}`} className="hover:text-accent-400">{site.email}</a></li>
            </ul>
            <Link
              href="/quote"
              className="mt-5 inline-flex rounded-sm bg-accent-500 px-5 py-3 text-sm font-semibold text-white hover:bg-accent-600"
            >
              免费获取报价
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {site.legalName}. 版权所有。</p>
          <p>ISO 9001:2015 &middot; IATF 16949 &middot; 已认证</p>
        </div>
      </div>
    </footer>
  );
}
