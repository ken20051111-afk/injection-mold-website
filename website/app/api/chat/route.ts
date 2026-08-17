import { NextRequest, NextResponse } from "next/server";
import { chatSchema } from "@/lib/validation";
import { systemPrompt } from "@/lib/prompts";
import { retrieveContext, contextToPrompt } from "@/lib/knowledge";
import { chatComplete } from "@/lib/openai";
import { processAiRfq, type AiExtractedRfq } from "@/lib/rfq-service";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

function parseRfqToken(reply: string): { clean: string; payload?: string } {
  const idx = reply.indexOf("@@RFQ@@");
  if (idx === -1) return { clean: reply };
  const after = reply.slice(idx + "@@RFQ@@".length);
  const start = after.indexOf("{");
  let depth = 0;
  let end = -1;
  for (let i = start; i < after.length; i++) {
    if (after[i] === "{") depth++;
    if (after[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (start === -1 || end === -1) return { clean: reply };
  const payload = after.slice(start, end);
  const clean = `${reply.slice(0, idx)}${after.slice(end)}`.trim();
  return { clean, payload };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const { message, email, conversationId } = parsed.data;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply:
        "Thanks for your message. For an immediate quote, please complete the form at /quote - our engineers reply within 24 hours.",
    });
  }

  try {
    let convo;
    if (conversationId) {
      convo = await prisma.chatConversation.findUnique({ where: { id: conversationId } });
    }
    if (!convo) {
      convo = await prisma.chatConversation.create({
        data: {
          channel: "website",
          status: "open",
        },
      });
    }

    const history = await prisma.chatMessage.findMany({
      where: { conversationId: convo.id },
      orderBy: { createdAt: "asc" },
      take: 12,
      select: { role: true, content: true },
    });

    await prisma.chatMessage.create({
      data: { conversationId: convo.id, role: "user", content: message },
    });

    const context = await retrieveContext(message, 5);
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: `${systemPrompt}\n\nKnowledge base:\n${contextToPrompt(context)}` },
      ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: message },
    ];

    const completion = await chatComplete(messages);
    let reply = completion.choices[0]?.message?.content ?? "I'm sorry, I could not process that. Please email sales@moldcraftprecision.com.";

    const { clean, payload } = parseRfqToken(reply);
    reply = clean || reply;

    if (payload) {
      try {
        const extracted = JSON.parse(payload) as AiExtractedRfq;
        const rfqResult = await processAiRfq(extracted, {
          email,
          rawMessage: message,
          conversationId: convo.id,
        });
        reply = `${reply}\n\n(Request ${rfqResult.rfqId} has been created and our team will follow up.)`;
        await prisma.chatConversation.update({
          where: { id: convo.id },
          data: { status: "pending_human", intent: "quote_request" },
        });
      } catch (e) {
        console.error("AI RFQ creation failed:", e);
      }
    }

    await prisma.chatMessage.create({
      data: { conversationId: convo.id, role: "assistant", content: reply },
    });

    return NextResponse.json({ reply, conversationId: convo.id });
  } catch (e) {
    console.error("Chat failed:", e);
    return NextResponse.json(
      { reply: "Our assistant is busy right now. Please email sales@moldcraftprecision.com or use the quote form." },
      { status: 200 },
    );
  }
}
