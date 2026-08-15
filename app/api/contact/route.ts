import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { upsertContact } from "@/lib/rfq-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
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
        materials: ["General inquiry"],
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
        materials: ["General inquiry"],
        score: 20,
        action: "nurture",
      });
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("Contact submission failed:", e);
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }
}
