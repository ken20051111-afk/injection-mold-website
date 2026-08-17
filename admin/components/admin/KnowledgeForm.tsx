"use client";

import { useState } from "react";
import { saveKnowledge } from "@/app/admin/actions";

type Props = {
  originalId: string;
  initial: { category: string; title: string; content: string; sourceUrl: string };
};

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-steel-900 focus:border-accent-500 focus:outline-none";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500";

export function KnowledgeForm({ originalId, initial }: Props) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    const fd = new FormData();
    fd.set("originalId", originalId);
    fd.set("category", form.category);
    fd.set("title", form.title);
    fd.set("content", form.content);
    fd.set("sourceUrl", form.sourceUrl);
    const res = await saveKnowledge(fd);
    setResult({
      ok: res.ok,
      message: res.ok
        ? "已保存。聊天助手将在下一条消息中使用该文档（已重新生成向量）。"
        : (res.error ?? "保存失败"),
    });
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {result && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            result.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "border-red-500/30 bg-red-500/10 text-red-600"
          }`}
        >
          {result.message}
        </div>
      )}

      <div>
        <label className={labelCls}>分类</label>
        <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {["general", "company", "capability", "process", "materials", "pricing", "shipping"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>标题</label>
        <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>内容</label>
        <textarea
          className={inputCls}
          rows={8}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="AI 助手应当掌握的事实..."
        />
      </div>

      <div>
        <label className={labelCls}>来源 URL（可选）</label>
        <input
          className={inputCls}
          value={form.sourceUrl}
          onChange={(e) => set("sourceUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-sm bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
      >
        {saving ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
