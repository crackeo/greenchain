import { NextRequest, NextResponse } from "next/server";
import { askClaude, hasApiKey, CROP_REC_SCHEMA } from "@/lib/claude";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  if (!hasApiKey()) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }
  const payload = await req.json();
  const prompt =
    "Recommend crops for this farm in Bhutan. Rank 3-5 options, best first.\n\n" +
    `Farm details (fields the farmer left blank are unknown):\n${JSON.stringify(payload, null, 2)}`;
  try {
    return NextResponse.json(await askClaude(prompt, CROP_REC_SCHEMA));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
