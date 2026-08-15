"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/lib/nav";

export function Header({ nav, brand }: { nav: NavItem[]; brand: string }) {
  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-steel-700/40 bg-steel-900/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpenMobile(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent-500 font-black text-white">
            MC
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            {brand.replace(" ", "")}
            <span className="text-accent-400">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="rounded-sm px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
                {openDropdown === item.href && (
                  <div className="absolute left-0 top-full w-64 rounded-sm border border-slate-200 bg-white py-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-accent-500"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/quote"
            className="hidden rounded-sm bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 sm:inline-flex"
          >
            Request a Quote
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-slate-300 lg:hidden"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {openMobile ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {openMobile && (
        <div className="border-t border-steel-700/40 bg-steel-900 px-4 pb-6 pt-2 lg:hidden">
          {nav.map((item) => (
            <div key={item.href} className="border-b border-steel-800 py-1 last:border-0">
              <Link
                href={item.href}
                className="block py-2 text-sm font-semibold text-white"
                onClick={() => setOpenMobile(false)}
              >
                {item.label}
              </Link>
              {item.children &&
                item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block py-1.5 pl-4 text-sm text-slate-400"
                    onClick={() => setOpenMobile(false)}
                  >
                    {child.label}
                  </Link>
                ))}
            </div>
          ))}
          <Link
            href="/quote"
            className="mt-4 block rounded-sm bg-accent-500 px-5 py-3 text-center text-sm font-semibold text-white"
            onClick={() => setOpenMobile(false)}
          >
            Request a Quote
          </Link>
        </div>
      )}
    </header>
  );
}
