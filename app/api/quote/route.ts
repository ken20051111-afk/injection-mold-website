import { NextRequest, NextResponse } from "next/server";
import { quoteFormSchema } from "@/lib/validation";
import { processQuoteRequest } from "@/lib/rfq-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = quoteFormSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      field: i.path[0],
      message: i.message,
    }));
    return NextResponse.json({ error: "Validation failed", issues }, { status: 400 });
  }

  try {
    const result = await processQuoteRequest(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.error("Quote submission failed:", e);
    return NextResponse.json(
      { error: "Could not save your request. Please email us directly." },
      { status: 500 },
    );
  }
}
