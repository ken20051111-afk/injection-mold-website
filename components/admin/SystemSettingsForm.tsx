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

  function set(name: string, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    const fd = new FormData();
    for (const [k, v] of Object.entries(form)) fd.set(k, v);
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
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Brand & Identity</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Brand" name="brand" value={form.brand ?? ""} onChange={set} />
          <Field label="Legal name" name="legalName" value={form.legalName ?? ""} onChange={set} />
          <Field label="Tagline" name="tagline" value={form.tagline ?? ""} onChange={set} />
          <Field
            label="Domain"
            name="domain"
            value={form.domain ?? ""}
            hint="Used for sitemap, canonical URLs, tracking pixels and notification links."
            onChange={set}
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Contact</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Address" name="address" value={form.address ?? ""} onChange={set} />
          <Field label="Phone" name="phone" value={form.phone ?? ""} onChange={set} />
          <Field
            label="Main email"
            name="email"
            value={form.email ?? ""}
            hint="Public contact email shown on the site."
            onChange={set}
          />
          <div>
            <label htmlFor="salesTeamEmails" className={labelCls}>
              Sales team emails (one per line)
            </label>
            <textarea
              id="salesTeamEmails"
              className={inputCls}
              rows={3}
              value={form.salesTeamEmails ?? ""}
              onChange={(e) => set("salesTeamEmails", e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-400">Recipients of new-RFQ alert emails.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Factory Facts</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field label="Founded" name="founded" type="number" value={form.founded ?? ""} onChange={set} />
          <Field label="Machines" name="machines" type="number" value={form.machines ?? ""} onChange={set} />
          <Field label="Engineers" name="engineers" type="number" value={form.engineers ?? ""} onChange={set} />
          <Field label="Molds / year" name="annualMolds" type="number" value={form.annualMolds ?? ""} onChange={set} />
          <Field label="Export countries" name="exportsCountries" type="number" value={form.exportsCountries ?? ""} onChange={set} />
          <Field label="Lead time (weeks)" name="leadTimeWeeks" type="number" value={form.leadTimeWeeks ?? ""} onChange={set} />
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
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Certifications</h2>
        <div className="mt-3">
          <label htmlFor="certifications" className={labelCls}>
            One per line
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
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
