import { NextRequest, NextResponse } from "next/server";
import { hasApiKey } from "@/lib/claude";
import { adviseCrops } from "@/lib/agriculture/advisory";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  if (!hasApiKey()) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }
  const payload = await req.json();
  try {
    return NextResponse.json(await adviseCrops(payload));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
