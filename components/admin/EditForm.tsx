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
    { key: "slug", label: "URL Slug", type: "text", hint: "e.g. precision-molds" },
    { key: "name", label: "Name", type: "text" },
    { key: "keyword", label: "Target Keyword", type: "text" },
    { key: "shortDescription", label: "Short Description", type: "textarea" },
    { key: "description", label: "Full Description", type: "textarea" },
    { key: "applications", label: "Typical Applications", type: "newlines", hint: "One per line" },
    { key: "specs", label: "Key Specifications", type: "pairs" },
    { key: "faqs", label: "FAQs", type: "faqs" },
  ],
  industry: [
    { key: "slug", label: "URL Slug", type: "text", hint: "e.g. automotive" },
    { key: "name", label: "Name", type: "text" },
    { key: "keyword", label: "Target Keyword", type: "text" },
    { key: "shortDescription", label: "Short Description", type: "textarea" },
    { key: "description", label: "Full Description", type: "textarea" },
    { key: "typicalParts", label: "Typical Parts", type: "newlines", hint: "One per line" },
    { key: "standards", label: "Compliance & Standards", type: "newlines", hint: "One per line" },
    { key: "materials", label: "Materials", type: "newlines", hint: "One per line" },
  ],
  caseStudy: [
    { key: "slug", label: "URL Slug", type: "text", hint: "e.g. automotive-dash-connector" },
    { key: "title", label: "Title", type: "text" },
    { key: "industry", label: "Industry", type: "text", hint: "e.g. automotive" },
    { key: "challenge", label: "The Challenge", type: "textarea" },
    { key: "solution", label: "The Solution", type: "textarea" },
    { key: "results", label: "Results Delivered", type: "pairs" },
    { key: "moldSpecs", label: "Mold Specifications", type: "pairs" },
  ],
  post: [
    { key: "slug", label: "URL Slug", type: "text", hint: "e.g. injection-mold-cost-guide" },
    { key: "title", label: "Title", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "keyword", label: "Target Keyword", type: "text" },
    { key: "readMinutes", label: "Read Time (minutes)", type: "number" },
    { key: "excerpt", label: "Excerpt", type: "textarea" },
    { key: "body", label: "Article Body", type: "newlines", hint: "One paragraph per line" },
    { key: "faqs", label: "FAQs", type: "faqs" },
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
      message: res.ok ? "Saved. The public site will refresh within 60 seconds." : (res.error ?? "Save failed"),
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
                placeholder="One item per line"
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
          Published (visible on the public site)
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
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
            placeholder="Label"
            value={row.label}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))
            }
          />
          <input
            className={inputCls}
            placeholder="Value"
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
        + Add row
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
            placeholder="Question"
            value={row.question}
            onChange={(e) =>
              onChange(rows.map((r, j) => (j === i ? { ...r, question: e.target.value } : r)))
            }
          />
          <textarea
            className={`${inputCls} mt-2`}
            rows={2}
            placeholder="Answer"
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
        + Add FAQ
      </button>
    </div>
  );
}
