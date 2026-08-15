import { buildMetadata } from "@/lib/seo";
import { CrmLoginForm } from "@/components/crm/CrmLoginForm";

export async function generateMetadata() {
  return buildMetadata({
    title: "CRM Login",
    description: "Internal CRM login.",
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
