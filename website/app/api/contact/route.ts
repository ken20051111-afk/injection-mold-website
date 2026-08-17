import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { upsertContact } from "@/lib/rfq-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体不是有效的 JSON" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "数据校验失败" }, { status: 400 });
  }

  try {
    const contact = await upsertContact({
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      company: parsed.data.company,
      country: parsed.data.country,
      source: "contact_form",
      consent: parsed.data.consent,
    });
    await import("@/lib/email").then(async ({ sendRfqAlert }) => {
      await sendRfqAlert({
        rfqId: `contact-${contact.id}`,
        name: parsed.data.fullName,
        company: parsed.data.company,
        country: parsed.data.country ?? "",
        materials: ["一般咨询"],
        details: parsed.data.message,
        score: 20,
        action: "nurture",
      });
    });
    await import("@/lib/notify").then(async ({ notifySalesTeam }) => {
      await notifySalesTeam({
        rfqId: `contact-${contact.id}`,
        company: parsed.data.company,
        contact: parsed.data.fullName,
        email: parsed.data.email,
        country: parsed.data.country,
        materials: ["一般咨询"],
        score: 20,
        action: "nurture",
      });
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("Contact submission failed:", e);
    return NextResponse.json({ error: "无法保存您的留言。" }, { status: 500 });
  }
}
