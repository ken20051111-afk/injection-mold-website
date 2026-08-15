import { getSite, getIntegrationStatus } from "@/lib/settings";
import { Card } from "@/components/ui";
import { SystemSettingsForm } from "@/components/admin/SystemSettingsForm";

export default async function SystemAdminPage() {
  const [site, integrations] = await Promise.all([getSite(), Promise.resolve(getIntegrationStatus())]);

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Site Settings</p>
        <p className="mt-1 text-sm text-slate-600">
          Brand, contact and factory facts are stored in the database and applied site-wide within
          60 seconds. Leave defaults until you are ready to rebrand.
        </p>
        <div className="mt-6">
          <SystemSettingsForm site={site} />
        </div>
      </Card>

      <Card className="p-6">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Integration Status</p>
        <p className="mt-1 text-sm text-slate-600">
          Read-only diagnostics from environment variables. Missing items simply disable that feature.
        </p>
        <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2 font-semibold">Integration</th>
                <th className="px-4 py-2 font-semibold">Env var</th>
                <th className="px-4 py-2 font-semibold">Purpose</th>
                <th className="px-4 py-2 font-semibold">Status</th>
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
                        Configured
                      </span>
                    ) : (
                      <span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                        Not set
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
