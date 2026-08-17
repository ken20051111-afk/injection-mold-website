"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { estimateQuote } from "@/lib/quote-engine";

export async function updateRfqStatus(formData: FormData) {
  const store = await cookies();
  if (store.get("crm_token")?.value !== process.env.CRM_PASSWORD) {
    throw new Error("Unauthorized");
  }
  const rfqId = formData.get("rfqId") as string;
  const status = formData.get("status") as string;
  await prisma.rfq.update({ where: { id: rfqId }, data: { status } });
  revalidatePath(`/crm/rfqs/${rfqId}`);
  revalidatePath("/crm");
  revalidatePath("/crm/rfqs");
}

export async function generateQuote(formData: FormData) {
  const store = await cookies();
  if (store.get("crm_token")?.value !== process.env.CRM_PASSWORD) {
    throw new Error("Unauthorized");
  }
  const rfqId = formData.get("rfqId") as string;

  const rfq = await prisma.rfq.findUnique({
    where: { id: rfqId },
    include: { items: true },
  });
  if (!rfq) throw new Error("RFQ not found");

  const cavity = rfq.items[0]?.cavity ?? 1;
  const estimate = estimateQuote({
    cavityCount: cavity,
    material: rfq.materials[0],
    annualVolume: rfq.annualVolume ?? undefined,
    tolerance: rfq.items[0]?.tolerance ?? undefined,
    surfaceFinish: rfq.items[0]?.surfaceFinish ?? undefined,
  });

  await prisma.$transaction([
    prisma.quote.create({
      data: {
        rfqId,
        totalPrice: estimate.estimatedCost,
        leadTimeDays: estimate.leadTimeDays,
        moldLifeGuarantee: rfq.items[0]?.moldLife ?? "500k shots",
        status: "draft",
      },
    }),
    prisma.rfq.update({ where: { id: rfqId }, data: { status: "quoted" } }),
  ]);

  revalidatePath(`/crm/rfqs/${rfqId}`);
  revalidatePath("/crm");
  revalidatePath("/crm/rfqs");
}
