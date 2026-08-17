"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  status: string;
  source: string;
  search: string;
  minScore?: number;
  maxScore?: number;
  statuses: string[];
  sources: string[];
};

const inputCls =
  "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-steel-900 focus:border-accent-500 focus:outline-none";
const selectCls =
  "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-steel-900 focus:border-accent-500 focus:outline-none";

export function RfqFilters({ status, source, search, minScore, maxScore, statuses, sources }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = useState(search);

  function applyFilters(updates: Record<string, string>) {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    sp.delete("page");
    router.push(`/crm/rfqs?${sp.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilters({ search: localSearch });
  }

  const statusLabels: Record<string, string> = {
    new: "新询价",
    reviewing: "审核中",
    quoted: "已报价",
    won: "已成交",
    lost: "已流失",
  };

  const sourceLabels: Record<string, string> = {
    quote_form: "报价表单",
    ai_chat: "AI 客服",
    contact_form: "联系表单",
  };

  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
      <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
            搜索
          </label>
          <input
            type="text"
            placeholder="公司名、邮箱或项目名..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
            状态
          </label>
          <select
            value={status}
            onChange={(e) => applyFilters({ status: e.target.value })}
            className={selectCls}
          >
            <option value="">全部</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s] || s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
            来源
          </label>
          <select
            value={source}
            onChange={(e) => applyFilters({ source: e.target.value })}
            className={selectCls}
          >
            <option value="">全部</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {sourceLabels[s] || s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
            最低评分
          </label>
          <input
            type="number"
            placeholder="0"
            value={minScore ?? ""}
            onChange={(e) => applyFilters({ minScore: e.target.value })}
            className={inputCls}
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
            最高评分
          </label>
          <input
            type="number"
            placeholder="100"
            value={maxScore ?? ""}
            onChange={(e) => applyFilters({ maxScore: e.target.value })}
            className={inputCls}
            min="0"
            max="100"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          搜索
        </button>
        {(status || source || search || minScore !== undefined || maxScore !== undefined) && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch("");
              router.push("/crm/rfqs");
            }}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
          >
            清除筛选
          </button>
        )}
      </form>
    </div>
  );
}
