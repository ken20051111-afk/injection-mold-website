"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  search: string;
  company: string;
};

const inputCls =
  "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-steel-900 focus:border-accent-500 focus:outline-none";

export function ContactFilters({ search, company }: Props) {
  const router = useRouter();
  useSearchParams();

  const [localSearch, setLocalSearch] = useState(search);
  const [localCompany, setLocalCompany] = useState(company);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (localSearch) sp.set("search", localSearch);
    if (localCompany) sp.set("company", localCompany);
    router.push(`/crm/contacts?${sp.toString()}`);
  }

  function handleClear() {
    setLocalSearch("");
    setLocalCompany("");
    router.push("/crm/contacts");
  }

  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
      <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
            搜索
          </label>
          <input
            type="text"
            placeholder="姓名、邮箱..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
            公司名称
          </label>
          <input
            type="text"
            placeholder="公司名称..."
            value={localCompany}
            onChange={(e) => setLocalCompany(e.target.value)}
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          搜索
        </button>
        {(search || company) && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
          >
            清除筛选
          </button>
        )}
      </form>
    </div>
  );
}
