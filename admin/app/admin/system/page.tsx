import { getSite, getIntegrationStatus } from "@/lib/settings";
import { Card } from "@/components/ui";
import { SystemSettingsForm } from "@/components/admin/SystemSettingsForm";

export default async function SystemAdminPage() {
  const [site, integrations] = await Promise.all([getSite(), Promise.resolve(getIntegrationStatus())]);

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">站点设置</p>
        <p className="mt-1 text-sm text-slate-600">
          品牌、联系方式与工厂信息存储在数据库中，60 秒内在全站生效。在准备好换品牌前可保留默认值。
        </p>
        <div className="mt-6">
          <SystemSettingsForm site={site} />
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">集成状态</p>
        <p className="mt-1 text-sm text-slate-600">
          来自环境变量的只读诊断信息。缺失项会直接停用对应功能。
        </p>
        <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2 font-semibold">集成项</th>
                <th className="px-4 py-2 font-semibold">环境变量</th>
                <th className="px-4 py-2 font-semibold">用途</th>
                <th className="px-4 py-2 font-semibold">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {integrations.map((row) => (
                <tr key={row.envKey}>
                  <td className="px-4 py-2 font-semibold text-steel-900">{row.label}</td>
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">{row.envKey}</td>
                  <td className="px-4 py-2 text-slate-500">{row.detail}</td>
                  <td className="px-4 py-2">
                    {row.configured ? (
                      <span className="rounded-sm bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-700">
                        已配置
                      </span>
                    ) : (
                      <span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                        未设置
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
