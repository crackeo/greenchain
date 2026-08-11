import { NextRequest, NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { hasApiKey } from "@/lib/claude";
import { diagnosePlant } from "@/lib/agriculture/advisory";

export const maxDuration = 300;

const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type AllowedMedia = (typeof ALLOWED)[number];

export async function POST(req: NextRequest) {
  if (!hasApiKey()) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }
  const form = await req.formData();
  const image = form.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ error: "image file required" }, { status: 422 });
  }
  if (image.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 8 MB)." }, { status: 413 });
  }
  const crop = String(form.get("crop") ?? "");
  const notes = String(form.get("notes") ?? "");
  const mediaType: AllowedMedia = (ALLOWED as readonly string[]).includes(image.type)
    ? (image.type as AllowedMedia)
    : "image/jpeg";
  const data = Buffer.from(await image.arrayBuffer()).toString("base64");

  const content: Anthropic.ContentBlockParam[] = [
    { type: "image", source: { type: "base64", media_type: mediaType, data } },
    {
      type: "text",
      text:
        "A Bhutanese farmer photographed this plant because something looks wrong. " +
        `Farmer says the crop is: ${crop || "not specified"}. ` +
        `Farmer's notes: ${notes || "none"}.\n` +
        "Diagnose what you can actually see. If the photo does not show a plant or is too " +
        "blurry/far away to judge, say so via the quality fields instead of guessing. " +
        "Set refer_to_expert=true whenever confidence is low or the condition threatens the " +
        "whole orchard/field (e.g. citrus greening/HLB suspicion must always be referred).",
    },
  ];
  try {
    return NextResponse.json(await diagnosePlant(content, crop, notes));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
