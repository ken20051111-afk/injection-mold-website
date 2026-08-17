"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CrmLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/crm/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "登录失败");
        setLoading(false);
        return;
      }
      router.push("/crm");
      router.refresh();
    } catch {
      setError("登录失败");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-24 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-bold text-steel-900">CRM 登录</h1>
      <p className="mt-1 text-sm text-slate-500">请输入 .env 中的 CRM 密码</p>
      {error ? (
        <p className="mt-4 rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>
      ) : null}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="CRM 密码"
        className="mt-4 w-full rounded-sm border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-accent-500"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full rounded-sm bg-accent-500 px-4 py-3 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
      >
        {loading ? "登录中..." : "登录"}
      </button>
    </div>
  );
}
