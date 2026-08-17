import { NextRequest, NextResponse } from "next/server";
import { quoteFormSchema } from "@/lib/validation";
import { processQuoteRequest } from "@/lib/rfq-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体不是有效的 JSON" }, { status: 400 });
  }

  const parsed = quoteFormSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      field: i.path[0],
      message: i.message,
    }));
    return NextResponse.json({ error: "数据校验失败", issues }, { status: 400 });
  }

  try {
    const result = await processQuoteRequest(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.error("Quote submission failed:", e);
    return NextResponse.json(
      { error: "无法保存您的请求，请直接发邮件联系我们。" },
      { status: 500 },
    );
  }
}
