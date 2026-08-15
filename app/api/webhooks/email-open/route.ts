import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

export async function GET(request: NextRequest) {
  const emailId = request.nextUrl.searchParams.get("emailId");
  if (emailId) {
    try {
      await prisma.emailLog.updateMany({
        where: { id: emailId, status: { not: "opened" } },
        data: { status: "opened", openedAt: new Date() },
      });
    } catch (e) {
      console.error("Email open tracking failed:", e);
    }
  }
  return new NextResponse(TRANSPARENT_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
    },
  });
}
