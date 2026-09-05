import { getHeroImage } from "@/lib/heroImage";

export const dynamic = "force-dynamic";

export async function GET() {
  const hero = await getHeroImage();
  if (!hero) {
    return new Response("Not Found", { status: 404 });
  }
  const body = Buffer.from(hero.data, "base64");
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": hero.mimeType,
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=300",
    },
  });
}