import type Anthropic from "@anthropic-ai/sdk";

/** Gemini fallback provider (free tier via Google AI Studio).
 *  Same contract as askClaude: takes text or Anthropic-style content blocks
 *  plus a JSON schema, returns the parsed object. */

export const GEMINI_MODEL = "gemini-flash-latest";

const ENDPOINT = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;

type Part = { text: string } | { inlineData: { mimeType: string; data: string } };

function toParts(content: string | Anthropic.ContentBlockParam[]): Part[] {
  if (typeof content === "string") return [{ text: content }];
  return content.map((b): Part => {
    if (b.type === "text") return { text: b.text };
    if (b.type === "image" && b.source.type === "base64") {
      return { inlineData: { mimeType: b.source.media_type, data: b.source.data } };
    }
    throw new Error(`Unsupported content block for Gemini: ${b.type}`);
  });
}

export async function askGemini<T>(
  system: string,
  userContent: string | Anthropic.ContentBlockParam[],
  schema: Record<string, unknown>,
): Promise<T> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const parts = toParts(userContent);
  // Embed the schema in the prompt + force JSON mime type. This is more
  // portable than responseSchema (whose accepted dialect varies) and we
  // parse defensively below.
  parts.push({
    text:
      "\nRespond with ONLY a single JSON object (no markdown fences, no commentary) " +
      "that conforms exactly to this JSON Schema:\n" +
      JSON.stringify(schema),
  });

  const res = await fetch(ENDPOINT(key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 8192 },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) throw new Error(`Empty Gemini response: ${JSON.stringify(data).slice(0, 300)}`);
  // Defensive parse: strip accidental code fences, find the outer object.
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`Gemini returned non-JSON: ${cleaned.slice(0, 200)}`);
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}
