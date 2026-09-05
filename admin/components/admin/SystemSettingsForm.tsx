"use client";

import { useState } from "react";
import { saveSystemSettings } from "@/app/admin/actions";
import type { SiteConfig } from "@/lib/settings";

type Props = {
  site: SiteConfig;
};

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-steel-900 focus:border-accent-500 focus:outline-none";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500";

function Field({
  label,
  name,
  value,
  type = "text",
  hint,
  onChange,
}: {
  label: string;
  name: string;
  value: string | number;
  type?: "text" | "number";
  hint?: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        className={inputCls}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function SystemSettingsForm({ site }: Props) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const [k, v] of Object.entries(site)) {
      init[k] = Array.isArray(v) ? v.join("\n") : String(v);
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  function set(name: string, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onHeroFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setHeroFile(file);
    if (heroPreview) URL.revokeObjectURL(heroPreview);
    setHeroPreview(file ? URL.createObjectURL(file) : null);
  }

  const currentHeroSrc = (() => {
    if (heroPreview) return heroPreview;
    const v = form.heroImage ?? "";
    if (!v) return "";
    return v.startsWith("/") && site.domain ? `${site.domain}${v}` : v;
  })();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    const fd = new FormData();
    for (const [k, v] of Object.entries(form)) fd.set(k, v);
    if (heroFile) fd.set("heroImage", heroFile);
    fd.set("heroImageOld", form.heroImage ?? "");
    const res = await saveSystemSettings(fd);
    setResult({
      ok: res.ok,
      message: res.ok
        ? "Saved. The public site will reflect these within 60 seconds."
        : (res.error ?? "Save failed"),
    });
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {result && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            result.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "border-red-500/30 bg-red-500/10 text-red-600"
          }`}
        >
          {result.message}
        </div>
      )}

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">品牌与标识</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="品牌名" name="brand" value={form.brand ?? ""} onChange={set} />
          <Field label="公司全称" name="legalName" value={form.legalName ?? ""} onChange={set} />
          <Field label="标语" name="tagline" value={form.tagline ?? ""} onChange={set} />
          <Field
            label="Domain"
            name="domain"
            value={form.domain ?? ""}
            hint="用于站点地图、规范 URL、追踪像素与通知链接。"
            onChange={set}
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">首页横幅图片</h2>
        <p className="mt-1 text-sm text-slate-500">
          显示在首页「精密注塑模具，准期交付，次次如一」右侧，支持 jpg / png / webp / gif / avif，最大 4MB。
        </p>
        <div className="mt-3">
          <label htmlFor="heroImage" className={labelCls}>
            上传图片
          </label>
          <input
            id="heroImage"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={onHeroFileChange}
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-sm file:border-0 file:bg-accent-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-600"
          />
          <div className="mt-3 flex items-start gap-4">
            {currentHeroSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentHeroSrc} alt="首页横幅预览" className="h-40 w-full max-w-md rounded-md border border-slate-200 bg-slate-50 object-cover" />
            ) : (
              <p className="text-xs text-slate-400">尚未上传图片，首页横幅保持现状。</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">联系方式</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="地址" name="address" value={form.address ?? ""} onChange={set} />
          <Field label="电话" name="phone" value={form.phone ?? ""} onChange={set} />
          <Field
            label="Main email"
            name="email"
            value={form.email ?? ""}
            hint="网站上显示的公开展示邮箱。"
            onChange={set}
          />
          <div>
            <label htmlFor="salesTeamEmails" className={labelCls}>
              销售团队邮箱（每行一个）
            </label>
            <textarea
              id="salesTeamEmails"
              className={inputCls}
              rows={3}
              value={form.salesTeamEmails ?? ""}
              onChange={(e) => set("salesTeamEmails", e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-400">新询价提醒邮件的收件人。</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">工厂信息</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field label="成立年份" name="founded" type="number" value={form.founded ?? ""} onChange={set} />
          <Field label="设备数量" name="machines" type="number" value={form.machines ?? ""} onChange={set} />
          <Field label="工程师数量" name="engineers" type="number" value={form.engineers ?? ""} onChange={set} />
          <Field label="年产模具数" name="annualMolds" type="number" value={form.annualMolds ?? ""} onChange={set} />
          <Field label="出口国家数" name="exportsCountries" type="number" value={form.exportsCountries ?? ""} onChange={set} />
          <Field label="交期（周）" name="leadTimeWeeks" type="number" value={form.leadTimeWeeks ?? ""} onChange={set} />
          <Field
            label="On-time delivery (%)"
            name="deliveryRate"
            type="number"
            value={form.deliveryRate ?? ""}
            onChange={set}
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">多语言设置</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field
            label="默认语言"
            name="defaultLocale"
            value={form.defaultLocale ?? "zh"}
            hint="网站默认显示语言，例如 zh 或 en"
            onChange={set}
          />
          <div>
            <label htmlFor="locales" className={labelCls}>
              支持的语言（每行一个）
            </label>
            <textarea
              id="locales"
              className={inputCls}
              rows={3}
              value={form.locales ?? ""}
              onChange={(e) => set("locales", e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-400">支持的语言代码列表，如 zh, en, ja</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">认证</h2>
        <div className="mt-3">
          <label htmlFor="certifications" className={labelCls}>
            每行一个
          </label>
          <textarea
            id="certifications"
            className={inputCls}
            rows={3}
            value={form.certifications ?? ""}
            onChange={(e) => set("certifications", e.target.value)}
          />
        </div>
      </section>

      <div className="border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存设置"}
        </button>
      </div>
    </form>
  );
}
