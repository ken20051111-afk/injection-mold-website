import { buildMetadata } from "@/lib/seo";
import { CrmLoginForm } from "@/components/crm/CrmLoginForm";

export async function generateMetadata() {
  return buildMetadata({
    title: "CRM 登录",
    description: "内部 CRM 登录。",
    path: "/crm/login",
    noindex: true,
  });
}

export default function CrmLoginPage() {
  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-10">
      <CrmLoginForm />
    </div>
  );
}
