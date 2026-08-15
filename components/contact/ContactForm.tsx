"use client";

import { useState } from "react";
import { contactFormSchema } from "@/lib/validation";

const inputCls =
  "w-full rounded-sm border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent-500";

export function ContactForm() {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    company: "",
    country: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update(key: string, value: string | boolean) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit() {
    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]);
        if (!errs[field]) errs[field] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setDone(true);
    } catch {
      setErrors({ form: "Failed to send. Please email us directly." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <p className="text-5xl">&#9993;</p>
        <h2 className="mt-4 text-xl font-bold text-steel-900">Message sent</h2>
        <p className="mt-2 text-sm text-slate-600">We will reply within one business day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {errors.form ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">{errors.form}</div>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-steel-700">Full name *</label>
          <input className={inputCls} value={values.fullName} onChange={(e) => update("fullName", e.target.value)} />
          {errors.fullName ? <p className="mt-1 text-xs text-red-600">{errors.fullName}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-steel-700">Work email *</label>
          <input type="email" className={inputCls} value={values.email} onChange={(e) => update("email", e.target.value)} />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-steel-700">Company *</label>
          <input className={inputCls} value={values.company} onChange={(e) => update("company", e.target.value)} />
          {errors.company ? <p className="mt-1 text-xs text-red-600">{errors.company}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-steel-700">Country</label>
          <input className={inputCls} value={values.country} onChange={(e) => update("country", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-steel-700">Message *</label>
        <textarea rows={6} className={inputCls} value={values.message} onChange={(e) => update("message", e.target.value)} />
        {errors.message ? <p className="mt-1 text-xs text-red-600">{errors.message}</p> : null}
      </div>
      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-0.5 accent-accent-500"
        />
        I agree to be contacted and accept the privacy policy. *
      </label>
      {errors.consent ? <p className="text-xs text-red-600">{errors.consent}</p> : null}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="rounded-sm bg-accent-500 px-8 py-3 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}
