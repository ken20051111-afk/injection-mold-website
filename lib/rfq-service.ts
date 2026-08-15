import { prisma } from "./db";
import { scoreLead, priorityFromScore, actionFromScore } from "./scoring";
import { sendRfqAlert, sendRfqConfirmation } from "./email";
import { notifySalesTeam } from "./notify";
import { getSite } from "./settings";
import type { QuoteFormValues } from "./validation";

export async function upsertCompany(input: { name: string; domain?: string; country?: string }) {
  const domain = input.domain ?? normalizeDomain(input.name);
  if (!domain) return null;
  return prisma.company.upsert({
    where: { domain },
    update: { name: input.name, country: input.country },
    create: {
      name: input.name,
      domain,
      country: input.country,
      region: guessRegion(input.country),
    },
  });
}

export async function upsertContact(input: {
  email: string;
  fullName: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  country?: string;
  source?: string;
  consent: boolean;
}) {
  const nameParts = input.fullName.trim().split(/\s+/);
  const company = input.company
    ? await upsertCompany({ name: input.company, country: input.country })
    : null;
  return prisma.contact.upsert({
    where: { email: input.email.toLowerCase() },
    update: {
      companyId: company?.id,
      jobTitle: input.jobTitle,
      phone: input.phone,
      source: input.source ?? "quote_form",
      consentGdpr: input.consent,
    },
    create: {
      email: input.email.toLowerCase(),
      companyId: company?.id,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" ") || undefined,
      jobTitle: input.jobTitle,
      phone: input.phone,
      source: input.source ?? "quote_form",
      consentGdpr: input.consent,
    },
  });
}

export async function processQuoteRequest(values: QuoteFormValues) {
  const contact = await upsertContact({
    email: values.email,
    fullName: values.fullName,
    company: values.company,
    jobTitle: values.jobTitle,
    phone: values.phone,
    country: values.country,
    source: "quote_form",
    consent: values.consent,
  });

  const breakdown = scoreLead({
    country: values.country,
    materials: values.materials,
    cavityTarget: values.cavityTarget,
    annualVolume: values.annualVolume,
    drawingsAvailable: values.drawingsAvailable,
    targetPrice: values.targetPrice,
    deadline: values.deadline,
    messageLength: values.details?.length,
    emailProvided: true,
    phoneProvided: Boolean(values.phone),
    intentTags: ["quote_request", "specific_requirements"],
  });

  const rfq = await prisma.rfq.create({
    data: {
      contactId: contact.id,
      source: "quote_form",
      status: "new",
      priority: priorityFromScore(breakdown.score),
      projectName: values.projectName,
      annualVolume: values.annualVolume,
      targetPrice: values.targetPrice,
      deadline: values.deadline ? new Date(values.deadline) : null,
      materials: values.materials,
      rawContent: values as unknown as object,
      aiSummary: [
        `${values.materials.length ? `Materials: ${values.materials.join(", ")}.` : ""}`,
        values.annualVolume ? `Annual volume: ${values.annualVolume}.` : "",
        values.cavityTarget ? `Cavity target: ${values.cavityTarget}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
      aiConfidence: 0.8,
    },
  });

  const parts = (values.details ?? "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 2)
    .slice(0, 5);

  if (parts.length > 0) {
    await prisma.rfqItem.create({
      data: {
        rfqId: rfq.id,
        partName: parts[0].slice(0, 120),
        material: values.materials[0],
        tolerance: values.tolerance,
        surfaceFinish: values.surfaceFinish,
        annualVolume: values.annualVolume,
        cavity: values.cavityTarget ?? 1,
        drawingsAvailable: values.drawingsAvailable,
        moldPriceEstimate: values.targetPrice,
      },
    });
  }

  await prisma.leadScore.create({
    data: {
      contactId: contact.id,
      companyId: contact.companyId,
      rfqId: rfq.id,
      score: breakdown.score,
      fitScore: breakdown.fitScore,
      intentScore: breakdown.intentScore,
      engagementScore: breakdown.engagementScore,
      timingScore: breakdown.timingScore,
      aiNotes: breakdown.notes.join("; "),
    },
  });

  const action = actionFromScore(breakdown.score);
  const salesEmails = (await getSite()).salesTeamEmails.join(", ");

  await logAndSend("rfq_alert", salesEmails, contact.id, contact.companyId, (emailLogId) =>
    sendRfqAlert(
      {
        rfqId: rfq.id,
        name: values.fullName,
        company: values.company,
        country: values.country,
        materials: values.materials,
        annualVolume: values.annualVolume,
        cavityTarget: values.cavityTarget,
        drawingsAvailable: values.drawingsAvailable,
        deadline: values.deadline,
        targetPrice: values.targetPrice,
        details: values.details,
        score: breakdown.score,
        action,
      },
      emailLogId,
    ),
  );

  await logAndSend("rfq_confirmation", contact.email, contact.id, contact.companyId, (emailLogId) =>
    sendRfqConfirmation(
      { to: contact.email, name: values.fullName, rfqId: rfq.id },
      emailLogId,
    ),
  );

  await notifySalesTeam({
    rfqId: rfq.id,
    company: values.company,
    contact: values.fullName,
    email: values.email,
    country: values.country,
    materials: values.materials,
    annualVolume: values.annualVolume,
    cavityTarget: values.cavityTarget,
    drawingsAvailable: values.drawingsAvailable,
    deadline: values.deadline,
    score: breakdown.score,
    action,
  });

  return { rfqId: rfq.id, score: breakdown.score, action };
}

async function logAndSend(
  templateKey: string,
  toEmail: string,
  contactId: string,
  companyId: string | null,
  send: (emailLogId: string) => Promise<boolean>,
) {
  let log;
  try {
    log = await prisma.emailLog.create({
      data: { contactId, companyId, templateKey, toEmail, status: "queued" },
    });
  } catch (e) {
    console.error(`Email log create failed (${templateKey}):`, e);
    return;
  }
  try {
    const sent = await send(log.id);
    if (sent) {
      await prisma.emailLog.update({ where: { id: log.id }, data: { status: "sent" } });
    }
  } catch (e) {
    console.error(`Email ${templateKey} failed:`, e);
    await prisma.emailLog.update({ where: { id: log.id }, data: { status: "failed" } }).catch(() => {});
  }
}

export type AiExtractedRfq = {
  project_name?: string | null;
  materials?: string[] | null;
  part_dimensions?: string | null;
  annual_volume?: number | null;
  cavity_target?: number | null;
  tolerance?: string | null;
  surface_finish?: string | null;
  target_mold_life?: string | null;
  deadline?: string | null;
  target_price_usd?: number | null;
  drawings_available?: boolean | null;
  part_description?: string | null;
  industry?: string | null;
  intent_tags?: string[] | null;
};

export async function processAiRfq(
  extracted: AiExtractedRfq,
  opts: { email?: string; name?: string; rawMessage: string; conversationId?: string },
) {
  const email = opts.email?.toLowerCase();
  let contact;
  if (email) {
    contact = await upsertContact({
      email,
      fullName: opts.name ?? "Chat Visitor",
      source: "ai_chat",
      consent: true,
    });
  } else {
    contact = await prisma.contact.upsert({
      where: { email: `guest-${opts.conversationId ?? "anon"}@guest.local` },
      update: { source: "ai_chat" },
      create: {
        email: `guest-${opts.conversationId ?? "anon"}@guest.local`,
        firstName: "Chat",
        lastName: "Visitor",
        source: "ai_chat",
        consentGdpr: true,
      },
    });
  }

  const tags = extracted.intent_tags ?? ["quote_request"];
  const breakdown = scoreLead({
    country: undefined,
    industry: extracted.industry ?? undefined,
    materials: extracted.materials ?? undefined,
    cavityTarget: extracted.cavity_target ?? undefined,
    annualVolume: extracted.annual_volume ?? undefined,
    drawingsAvailable: extracted.drawings_available ?? false,
    targetPrice: extracted.target_price_usd ?? undefined,
    deadline: extracted.deadline ?? undefined,
    messageLength: opts.rawMessage.length,
    emailProvided: Boolean(email),
    intentTags: tags,
  });

  const rfq = await prisma.rfq.create({
    data: {
      contactId: contact.id,
      source: "ai_chat",
      status: "new",
      priority: priorityFromScore(breakdown.score),
      projectName: extracted.project_name,
      annualVolume: extracted.annual_volume ?? null,
      targetPrice: extracted.target_price_usd ?? null,
      deadline: extracted.deadline ? new Date(extracted.deadline) : null,
      materials: extracted.materials ?? [],
      rawContent: { chatMessage: opts.rawMessage.slice(0, 4000) } as object,
      aiSummary: extracted.part_description ?? extracted.project_name,
      aiConfidence: 0.9,
    },
  });

  await prisma.leadScore.create({
    data: {
      contactId: contact.id,
      companyId: contact.companyId,
      rfqId: rfq.id,
      score: breakdown.score,
      fitScore: breakdown.fitScore,
      intentScore: breakdown.intentScore,
      engagementScore: breakdown.engagementScore,
      timingScore: breakdown.timingScore,
      aiNotes: breakdown.notes.join("; "),
    },
  });

  const action = actionFromScore(breakdown.score);
  const salesEmails = (await getSite()).salesTeamEmails.join(", ");

  await logAndSend("rfq_alert", salesEmails, contact.id, contact.companyId, (emailLogId) =>
    sendRfqAlert(
      {
        rfqId: rfq.id,
        name: opts.name ?? "Chat Visitor",
        company: "Unknown",
        country: "",
        materials: extracted.materials ?? [],
        annualVolume: extracted.annual_volume ?? undefined,
        cavityTarget: extracted.cavity_target ?? undefined,
        drawingsAvailable: extracted.drawings_available ?? false,
        deadline: extracted.deadline ?? undefined,
        targetPrice: extracted.target_price_usd ?? undefined,
        details: opts.rawMessage,
        score: breakdown.score,
        action,
      },
      emailLogId,
    ),
  );

  await notifySalesTeam({
    rfqId: rfq.id,
    company: "Unknown (AI chat)",
    contact: opts.name ?? "Chat Visitor",
    email: email ?? undefined,
    country: "",
    materials: extracted.materials ?? [],
    annualVolume: extracted.annual_volume ?? undefined,
    cavityTarget: extracted.cavity_target ?? undefined,
    drawingsAvailable: extracted.drawings_available ?? false,
    deadline: extracted.deadline ?? undefined,
    score: breakdown.score,
    action,
  });

  return { rfqId: rfq.id, score: breakdown.score, action };
}

function normalizeDomain(name: string): string | null {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug ? `${slug}.com` : null;
}

function guessRegion(country?: string): string | null {
  const map: Record<string, string> = {
    us: "North America",
    ca: "North America",
    de: "Europe",
    gb: "Europe",
    fr: "Europe",
    nl: "Europe",
    se: "Europe",
    dk: "Europe",
    no: "Europe",
    ch: "Europe",
    it: "Europe",
    es: "Europe",
    be: "Europe",
    at: "Europe",
    ie: "Europe",
    pl: "Europe",
    cz: "Europe",
    fi: "Europe",
    jp: "Asia",
    kr: "Asia",
    cn: "Asia",
    au: "Oceania",
  };
  const key = (country ?? "").toLowerCase();
  if (map[key]) return map[key];
  return null;
}
