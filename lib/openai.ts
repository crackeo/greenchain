import OpenAI from "openai";
import type Anthropic from "@anthropic-ai/sdk";

export const OPENAI_MODEL = "gpt-5-mini";

type UserContent = string | Anthropic.ContentBlockParam[];
type OpenAIInputPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; detail: "high"; image_url: string };

function inputContent(content: UserContent): OpenAIInputPart[] {
  if (typeof content === "string") {
    return [{ type: "input_text" as const, text: content }];
  }

  const parts: OpenAIInputPart[] = [];
  for (const block of content) {
    if (block.type === "text") {
      parts.push({ type: "input_text", text: block.text });
    }
    if (block.type === "image" && block.source.type === "base64") {
      parts.push({
        type: "input_image",
        detail: "high",
        image_url: `data:${block.source.media_type};base64,${block.source.data}`,
      });
    }
  }
  return parts;
}

export async function askOpenAI<T>(
  system: string,
  userContent: UserContent,
  schema: Record<string, unknown>,
): Promise<T> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: OPENAI_MODEL,
    instructions: system,
    input: [{ role: "user", content: inputContent(userContent) }],
    tools: [{ type: "web_search_preview", search_context_size: "medium" }],
    text: {
      format: {
        type: "json_schema",
        name: "greenchain_advice",
        strict: true,
        schema,
      },
    },
  });

  if (!response.output_text) throw new Error("Empty OpenAI response.");
  return JSON.parse(response.output_text) as T;
}
