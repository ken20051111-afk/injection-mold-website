"use client";

import { useState } from "react";
import type { QuoteFormValues } from "@/lib/validation";
import { quoteFormSchema } from "@/lib/validation";

const countryOptions = [
  "中国大陆", "中国香港", "中国台湾", "美国", "德国", "英国", "法国", "荷兰", "瑞典",
  "丹麦", "挪威", "瑞士", "奥地利", "比利时", "意大利", "西班牙",
  "加拿大", "澳大利亚", "日本", "韩国", "其他",
];

const materialOptions = [
  "ABS", "PC", "PC/ABS", "PP", "PA6 / PA66", "POM", "PBT", "PET", "PMMA",
  "TPU", "TPE", "PEEK", "PPSU", "LSR", "其他",
];

const toleranceOptions = ["± 0.005 mm（精密）", "± 0.02 mm", "± 0.05 mm", "± 0.10 mm", "不确定"];
const finishOptions = ["SPI A1", "SPI A3", "SPI B1", "SPI C1", "SPI D1", "VDI 纹面", "不确定"];
const moldLifeOptions = ["试制（< 10 万次）", "10万 - 50万次", "50万 - 100万次", "100万次以上"];

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
        throw new Error(data.error ?? "提交失败，请稍后再试");
      }
      setDone(data.rfqId);
    } catch (e) {
      setErrors({ form: e instanceof Error ? e.message : "提交失败，请稍后再试" });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
        <p className="text-5xl">&#9989;</p>
        <h2 className="mt-4 text-2xl font-bold text-steel-900">已收到您的报价请求！</h2>
        <p className="mt-2 text-slate-600">
          您的询价编号为 <span className="font-bold text-accent-500">{done}</span>。我们的工程师将在 2 个工作日内回复您。
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
          再提交一个请求
        </button>
      </div>
    );
  }

  const stepTitles = ["您的信息", "零件与产能", "图纸与确认"];

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
          <Field label="姓名" required error={errors.fullName}>
            <input className={inputCls} value={values.fullName} onChange={(e) => update("fullName", e.target.value)} />
          </Field>
          <Field label="工作邮箱" required error={errors.email}>
            <input type="email" className={inputCls} value={values.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="公司名称" required error={errors.company}>
            <input className={inputCls} value={values.company} onChange={(e) => update("company", e.target.value)} />
          </Field>
          <Field label="职位">
            <input className={inputCls} value={values.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />
          </Field>
          <Field label="国家/地区" required error={errors.country}>
            <select className={inputCls} value={values.country} onChange={(e) => update("country", e.target.value)}>
              <option value="">请选择国家/地区</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="电话">
            <input className={inputCls} value={values.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="项目名称">
            <input className={inputCls} value={values.projectName} onChange={(e) => update("projectName", e.target.value)} />
          </Field>
          <Field label="目标塑胶材料" required error={errors.materials}>
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
            <p className="mt-1 text-xs text-slate-400">按住 Ctrl/Cmd 可多选</p>
          </Field>
          <Field label="零件尺寸（长 x 宽 x 高, mm）">
            <input className={inputCls} placeholder="例如 200 x 150 x 100" value={values.partDimensions} onChange={(e) => update("partDimensions", e.target.value)} />
          </Field>
          <Field label="年需求量（件/年）">
            <input type="number" min={1} className={inputCls} placeholder="例如 500,000" value={values.annualVolume ?? ""} onChange={(e) => update("annualVolume", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="目标腔数">
            <input type="number" min={1} max={128} className={inputCls} placeholder="例如 8" value={values.cavityTarget ?? ""} onChange={(e) => update("cavityTarget", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="公差要求">
            <select className={inputCls} value={values.tolerance} onChange={(e) => update("tolerance", e.target.value)}>
              <option value="">请选择公差</option>
              {toleranceOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="表面光洁度">
            <select className={inputCls} value={values.surfaceFinish} onChange={(e) => update("surfaceFinish", e.target.value)}>
              <option value="">请选择光洁度</option>
              {finishOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Field label="目标模具寿命">
            <select className={inputCls} value={values.targetMoldLife} onChange={(e) => update("targetMoldLife", e.target.value)}>
              <option value="">请选择模具寿命</option>
              {moldLifeOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="期望交付日期">
            <input type="date" className={inputCls} value={values.deadline} onChange={(e) => update("deadline", e.target.value)} />
          </Field>
          <Field label="目标模具价格（人民币）">
            <input type="number" min={0} className={inputCls} placeholder="例如 300000" value={values.targetPrice ?? ""} onChange={(e) => update("targetPrice", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-steel-700">您有 2D/3D 图纸吗？</p>
            <div className="flex gap-6">
              {[true, false].map((val) => (
                <label key={String(val)} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={values.drawingsAvailable === val}
                    onChange={() => update("drawingsAvailable", val)}
                    className="accent-accent-500"
                  />
                  {val ? "有" : "暂时没有"}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              提交后，您可以在确认邮件中回复附上 STEP/PDF 文件。
            </p>
          </div>
          <Field label="零件描述与补充说明">
            <textarea
              rows={5}
              className={inputCls}
              placeholder="功能用途、使用环境、现存问题、单次采购数量等，任何有助于我们设计合适模具的信息..."
              value={values.details}
              onChange={(e) => update("details", e.target.value)}
            />
          </Field>
          <Field label="隐私同意" required error={errors.consent}>
            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={values.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="mt-0.5 accent-accent-500"
              />
              我同意就我的报价请求被联系，并接受隐私政策。
            </label>
          </Field>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="text-sm font-semibold text-slate-500 hover:text-steel-900">
            &larr; 上一页
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
            下一页 &rarr;
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-sm bg-accent-500 px-8 py-3 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
          >
            {submitting ? "提交中..." : "提交报价请求"}
          </button>
        )}
      </div>
    </div>
  );
}
