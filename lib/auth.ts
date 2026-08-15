import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireCrmAuth() {
  const store = await cookies();
  const token = store.get("crm_token")?.value;
  if (!token || token !== process.env.CRM_PASSWORD) {
    redirect("/crm/login");
  }
}
