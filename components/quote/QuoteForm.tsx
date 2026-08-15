"use client";

import { useState } from "react";
import type { QuoteFormValues } from "@/lib/validation";
import { quoteFormSchema } from "@/lib/validation";

const countryOptions = [
  "United States", "Germany", "United Kingdom", "France", "Netherlands", "Sweden",
  "Denmark", "Norway", "Switzerland", "Austria", "Belgium", "Italy", "Spain",
  "Canada", "Australia", "Japan", "South Korea", "Other",
];

const materialOptions = [
  "ABS", "PC", "PC/ABS", "PP", "PA6 / PA66", "POM", "PBT", "PET", "PMMA",
  "TPU", "TPE", "PEEK", "PPSU", "LSR", "Other",
];

const toleranceOptions = ["+/- 0.005 mm (precision)", "+/- 0.02 mm", "+/- 0.05 mm", "+/- 0.10 mm", "Not sure"];
const finishOptions = ["SPI A1", "SPI A3", "SPI B1", "SPI C1", "SPI D1", "VDI texture", "Not sure"];
const moldLifeOptions = ["Prototype (< 100k)", "100k - 500k shots", "500k - 1M shots", "1M+ shots"];

const initialValues: QuoteFormValues = {
  fullName: "",
  email: "",
  company: "",
  jobTitle: "",
  country: "",
  phone: "",
  projectName: "",
  materials: [],
  partDimensions: "",
  annualVolume: undefined,
  cavityTarget: undefined,
  tolerance: "",
  surfaceFinish: "",
  targetMoldLife: "",
  deadline: "",
  targetPrice: undefined,
  drawingsAvailable: false,
  details: "",
  consent: false,
};

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, required, error, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-steel-700">
        {label} {required ? <span className="text-accent-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

const inputCls =
  "w-full rounded-sm border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent-500";

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<QuoteFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  function update<K extends keyof QuoteFormValues>(key: K, value: QuoteFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validateStep(next: number): boolean {
    const parsed = quoteFormSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]);
        if (!errs[field]) errs[field] = issue.message;
      }
      const stepFields: Record<number, string[]> = {
        0: ["fullName", "email", "company", "country"],
        1: ["materials", "annualVolume", "cavityTarget", "targetPrice", "deadline"],
        2: ["consent"],
      };
      const visible = stepFields[next] ?? [];
      const visibleErrors: Record<string, string> = {};
      for (const f of visible) if (errs[f]) visibleErrors[f] = errs[f];
      setErrors(visibleErrors);
      return Object.keys(visibleErrors).length === 0;
    }
    setErrors({});
    return true;
  }

  async function handleSubmit() {
    if (!validateStep(2)) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { rfqId?: string; error?: string };
      if (!res.ok || !data.rfqId) {
        throw new Error(data.error ?? "Submission failed");
      }
      setDone(data.rfqId);
    } catch (e) {
      setErrors({ form: e instanceof Error ? e.message : "Submission failed" });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <p className="text-5xl">&#9989;</p>
        <h2 className="mt-4 text-2xl font-bold text-steel-900">Request received!</h2>
        <p className="mt-2 text-slate-600">
          Your reference number is <span className="font-bold text-accent-500">{done}</span>. Our
          engineers will reply within 2 business days.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(initialValues);
            setStep(0);
            setDone(null);
          }}
          className="mt-6 text-sm font-semibold text-accent-500 hover:text-accent-600"
        >
          Submit another request
        </button>
      </div>
    );
  }

  const stepTitles = ["Your details", "Part & production", "Drawings & confirm"];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <ol className="mb-8 flex items-center gap-2">
        {stepTitles.map((title, i) => (
          <li key={title} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i <= step ? "bg-accent-500 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {i + 1}
            </button>
            <span className={`hidden text-xs font-semibold sm:block ${i === step ? "text-steel-900" : "text-slate-400"}`}>
              {title}
            </span>
            {i < stepTitles.length - 1 && <span className="h-px w-6 bg-slate-300" />}
          </li>
        ))}
      </ol>

      {errors.form ? (
        <div className="mb-5 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {errors.form}
        </div>
      ) : null}

      {step === 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" required error={errors.fullName}>
            <input className={inputCls} value={values.fullName} onChange={(e) => update("fullName", e.target.value)} />
          </Field>
          <Field label="Work email" required error={errors.email}>
            <input type="email" className={inputCls} value={values.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="Company" required error={errors.company}>
            <input className={inputCls} value={values.company} onChange={(e) => update("company", e.target.value)} />
          </Field>
          <Field label="Job title">
            <input className={inputCls} value={values.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />
          </Field>
          <Field label="Country" required error={errors.country}>
            <select className={inputCls} value={values.country} onChange={(e) => update("country", e.target.value)}>
              <option value="">Select country</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Phone">
            <input className={inputCls} value={values.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Project name">
            <input className={inputCls} value={values.projectName} onChange={(e) => update("projectName", e.target.value)} />
          </Field>
          <Field label="Target plastic material" required error={errors.materials}>
            <select
              multiple
              className={`${inputCls} h-32`}
              value={values.materials}
              onChange={(e) => update("materials", Array.from(e.target.selectedOptions, (o) => o.value))}
            >
              {materialOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">Hold Ctrl/Cmd to select multiple</p>
          </Field>
          <Field label="Part dimensions (L x W x H mm)">
            <input className={inputCls} placeholder="e.g. 200 x 150 x 100" value={values.partDimensions} onChange={(e) => update("partDimensions", e.target.value)} />
          </Field>
          <Field label="Annual volume (parts/year)">
            <input type="number" min={1} className={inputCls} placeholder="e.g. 500,000" value={values.annualVolume ?? ""} onChange={(e) => update("annualVolume", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="Target cavity count">
            <input type="number" min={1} max={128} className={inputCls} placeholder="e.g. 8" value={values.cavityTarget ?? ""} onChange={(e) => update("cavityTarget", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="Tolerance">
            <select className={inputCls} value={values.tolerance} onChange={(e) => update("tolerance", e.target.value)}>
              <option value="">Select tolerance</option>
              {toleranceOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Surface finish">
            <select className={inputCls} value={values.surfaceFinish} onChange={(e) => update("surfaceFinish", e.target.value)}>
              <option value="">Select finish</option>
              {finishOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Field label="Target mold life">
            <select className={inputCls} value={values.targetMoldLife} onChange={(e) => update("targetMoldLife", e.target.value)}>
              <option value="">Select mold life</option>
              {moldLifeOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="Required delivery date">
            <input type="date" className={inputCls} value={values.deadline} onChange={(e) => update("deadline", e.target.value)} />
          </Field>
          <Field label="Target mold price (USD)">
            <input type="number" min={0} className={inputCls} placeholder="e.g. 30000" value={values.targetPrice ?? ""} onChange={(e) => update("targetPrice", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-steel-700">Do you have 2D/3D drawings?</p>
            <div className="flex gap-6">
              {[true, false].map((val) => (
                <label key={String(val)} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={values.drawingsAvailable === val}
                    onChange={() => update("drawingsAvailable", val)}
                    className="accent-accent-500"
                  />
                  {val ? "Yes" : "Not yet"}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              After submitting, reply to the confirmation email with your STEP/PDF files.
            </p>
          </div>
          <Field label="Part description & additional details">
            <textarea
              rows={5}
              className={inputCls}
              placeholder="Function, environment, existing problems, quantity per shipment, anything that helps us engineer the right mold..."
              value={values.details}
              onChange={(e) => update("details", e.target.value)}
            />
          </Field>
          <Field label="Privacy consent" required error={errors.consent}>
            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={values.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="mt-0.5 accent-accent-500"
              />
              I agree to be contacted about my quote request and accept the privacy policy.
            </label>
          </Field>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="text-sm font-semibold text-slate-500 hover:text-steel-900">
            &larr; Back
          </button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <button
            type="button"
            onClick={() => validateStep(step) && setStep((s) => s + 1)}
            className="rounded-sm bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Continue &rarr;
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-sm bg-accent-500 px-8 py-3 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Quote Request"}
          </button>
        )}
      </div>
    </div>
  );
}
