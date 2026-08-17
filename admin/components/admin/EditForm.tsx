"use client";

import { useState } from "react";
import { saveContent } from "@/app/admin/actions";

type FieldType = "text" | "textarea" | "number" | "newlines" | "pairs" | "faqs";

type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
};

type FormProps = {
  type: string;
  originalSlug: string;
  initial: Record<string, unknown>;
};

const fieldsByType: Record<string, FieldDef[]> = {
  capability: [
    { key: "slug", label: "URL 别名", type: "text", hint: "例如 precision-molds" },
    { key: "name", label: "名称", type: "text" },
    { key: "keyword", label: "目标关键词", type: "text" },
    { key: "shortDescription", label: "简介", type: "textarea" },
    { key: "description", label: "完整描述", type: "textarea" },
    { key: "applications", label: "典型应用", type: "newlines", hint: "每行一条" },
    { key: "specs", label: "关键技术规格", type: "pairs" },
    { key: "faqs", label: "常见问题", type: "faqs" },
  ],
  industry: [
    { key: "slug", label: "URL 别名", type: "text", hint: "例如 automotive" },
    { key: "name", label: "名称", type: "text" },
    { key: "keyword", label: "目标关键词", type: "text" },
    { key: "shortDescription", label: "简介", type: "textarea" },
    { key: "description", label: "完整描述", type: "textarea" },
    { key: "typicalParts", label: "典型零件", type: "newlines", hint: "每行一条" },
    { key: "standards", label: "合规与标准", type: "newlines", hint: "每行一条" },
    { key: "materials", label: "材料", type: "newlines", hint: "每行一条" },
  ],
  caseStudy: [
    { key: "slug", label: "URL 别名", type: "text", hint: "例如 automotive-dash-connector" },
    { key: "title", label: "标题", type: "text" },
    { key: "industry", label: "行业", type: "text", hint: "例如 automotive" },
    { key: "challenge", label: "项目挑战", type: "textarea" },
    { key: "solution", label: "解决方案", type: "textarea" },
    { key: "results", label: "交付成果", type: "pairs" },
    { key: "moldSpecs", label: "模具规格", type: "pairs" },
  ],
  post: [
    { key: "slug", label: "URL 别名", type: "text", hint: "例如 injection-mold-cost-guide" },
    { key: "title", label: "标题", type: "text" },
    { key: "category", label: "分类", type: "text" },
    { key: "keyword", label: "目标关键词", type: "text" },
    { key: "readMinutes", label: "阅读时长（分钟）", type: "number" },
    { key: "excerpt", label: "摘要", type: "textarea" },
    { key: "body", label: "文章正文", type: "newlines", hint: "每段一行" },
    { key: "faqs", label: "常见问题", type: "faqs" },
  ],
};

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-steel-900 focus:border-accent-500 focus:outline-none";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500";

type Pair = { label: string; value: string };
type Faq = { question: string; answer: string };

export function EditForm({ type, originalSlug, initial }: FormProps) {
  const [form, setForm] = useState<Record<string, unknown>>({ published: true, ...initial });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const fields = fieldsByType[type] ?? [];

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setPairs(key: string, rows: Pair[]) {
    set(key, rows);
  }

  function setFaqs(key: string, rows: Faq[]) {
    set(key, rows);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    const fd = new FormData();
    fd.set("type", type);
    fd.set("originalSlug", originalSlug);
    fd.set("slug", String(form.slug ?? ""));
    fd.set("data", JSON.stringify(form));
    const res = await saveContent(fd);
    setResult({
      ok: res.ok,
      message: res.ok ? "已保存。公开网站将在 60 秒内刷新。" : (res.error ?? "保存失败"),
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

      <div className="grid gap-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className={labelCls}>{field.label}</label>
            {field.type === "text" && (
              <input
                className={inputCls}
                value={String(form[field.key] ?? "")}
                onChange={(e) => set(field.key, e.target.value)}
              />
            )}
            {field.type === "number" && (
              <input
                type="number"
                className={inputCls}
                value={Number(form[field.key] ?? 5)}
                onChange={(e) => set(field.key, parseInt(e.target.value, 10) || 0)}
              />
            )}
            {field.type === "textarea" && (
              <textarea
                className={inputCls}
                rows={4}
                value={String(form[field.key] ?? "")}
                onChange={(e) => set(field.key, e.target.value)}
              />
            )}
            {field.type === "newlines" && (
              <textarea
                className={inputCls}
                rows={4}
                value={(form[field.key] as string[] | undefined)?.join("\n") ?? ""}
                onChange={(e) => set(field.key, e.target.value.split("\n"))}
                placeholder="每行一项"
              />
            )}
            {field.type === "pairs" && (
              <PairEditor
                rows={(form[field.key] as Pair[] | undefined) ?? []}
                onChange={(rows) => setPairs(field.key, rows)}
              />
            )}
            {field.type === "faqs" && (
              <FaqEditor
                rows={(form[field.key] as Faq[] | undefined) ?? []}
                onChange={(rows) => setFaqs(field.key, rows)}
              />
            )}
            {field.hint && <p className="mt-1 text-xs text-slate-400">{field.hint}</p>}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={Boolean(form.published)}
          onChange={(e) => set("published", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-accent-500 focus:ring-accent-500"
        />
        <label htmlFor="published" className="text-sm font-semibold text-steel-700">
          已发布（在公开网站上可见）
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
        {String(form.slug) && originalSlug === String(form.slug) && (
          <a
            href={`/${type === "capability" ? "capabilities" : type === "industry" ? "industries" : type === "caseStudy" ? "case-studies" : "resources/blog"}/${String(form.slug)}`}
            target="_blank"
            className="rounded-sm border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
          >
            Preview
          </a>
        )}
      </div>
    </form>
  );
}

function PairEditor({ rows, onChange }: { rows: Pair[]; onChange: (rows: Pair[]) => void }) {
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={inputCls}
            placeholder="名称"
            value={row.label}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))
            }
          />
          <input
            className={inputCls}
            placeholder="数值"
            value={row.value}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))
            }
          />
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            className="shrink-0 rounded-sm border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, { label: "", value: "" }])}
        className="rounded-sm border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
      >
        + 添加一行
      </button>
    </div>
  );
}

function FaqEditor({ rows, onChange }: { rows: Faq[]; onChange: (rows: Faq[]) => void }) {
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="rounded-md border border-slate-200 p-3">
          <input
            className={inputCls}
            placeholder="问题"
            value={row.question}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, question: e.target.value } : r)))
            }
          />
          <textarea
            className={`${inputCls} mt-2`}
            rows={2}
            placeholder="答案"
            value={row.answer}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, answer: e.target.value } : r)))
            }
          />
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            className="mt-2 rounded-sm border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Remove FAQ
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, { question: "", answer: "" }])}
        className="rounded-sm border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-accent-500 hover:text-accent-500"
      >
        + 添加常见问题
      </button>
    </div>
  );
}
