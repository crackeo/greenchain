import Anthropic from "@anthropic-ai/sdk";

import { askGemini, GEMINI_MODEL } from "./gemini";
import { askOpenAI, OPENAI_MODEL } from "./openai";

export const MODEL = "claude-opus-4-8";

export const activeProvider = (): "openai" | "anthropic" | "gemini" | null =>
  process.env.OPENAI_API_KEY
    ? "openai"
    : process.env.ANTHROPIC_API_KEY
      ? "anthropic"
      : process.env.GEMINI_API_KEY
        ? "gemini"
        : null;

export const activeModel = () =>
  activeProvider() === "openai"
    ? OPENAI_MODEL
    : activeProvider() === "anthropic"
      ? MODEL
      : activeProvider() === "gemini"
        ? GEMINI_MODEL
        : null;

export const hasApiKey = () => activeProvider() !== null;

const client = () => new Anthropic();

export const AGRONOMIST_SYSTEM = `You are an expert agronomist advising smallholder farmers in Bhutan, powering an app called GreenChain AI.

Context you must apply:
- Bhutan's terrain spans subtropical lowlands (~200 m) to alpine zones (>4000 m). Elevation is a first-class input: it determines temperature bands, frost risk, and which agro-ecological zone applies (wet subtropical, humid subtropical, dry subtropical, warm temperate, cool temperate, alpine).
- The monsoon (June-September) drives the cropping calendar. Winters are dry.
- Priority cash crops for this pilot: large cardamom, citrus (mandarin/orange), and apple. Also advise on other crops when they genuinely fit better, but weight recommendations toward these.
- Farmers have limited access to lab testing, machinery, and agro-chemicals. Prefer locally practical advice: farmyard manure, compost, locally available inputs. Bhutan promotes organic-leaning agriculture.
- Key institutions to reference for follow-up: the National Plant Protection Centre (NPPC, Semtokha) for disease confirmation, the National Soil Services Centre (NSSC) for soil testing, and dzongkhag agriculture extension offices.

Rules:
- Be honest about uncertainty. If the inputs are insufficient for a confident recommendation, say so and state what additional information would change the answer.
- Never recommend banned or highly hazardous pesticides. When chemical control is warranted, name the active ingredient class, stress protective equipment, pre-harvest intervals, and advise confirming the product with the extension office.
- Give quantities in units a farmer can act on (kg per acre, langdo where natural).
- Distinguish household farms from commercial farms. For household farms, prioritize food security, mixed cropping, low-cost inputs, staggered harvests, and work one family can manage. For commercial farms, include acre-based quantities, labor, market access, gross-margin considerations, and scalable irrigation or disease-control practices.
- When current web search is available, ground factual claims in authoritative sources such as Bhutan's Ministry of Agriculture and Livestock, NPPC, NSSC, FAO, CABI, CGIAR, or peer-reviewed extension material. Never invent a source URL.
- Keep every text field concise and plain-spoken - it will be read on a phone by a farmer, possibly translated to Dzongkha.`;

type UserContent = string | Anthropic.ContentBlockParam[];

export async function askClaude<T>(
  userContent: UserContent,
  schema: Record<string, unknown>,
  maxTokens = 8000,
): Promise<T> {
  const failures: string[] = [];

  if (process.env.OPENAI_API_KEY) {
    try {
      return await askOpenAI<T>(AGRONOMIST_SYSTEM, userContent, schema);
    } catch (error) {
      failures.push(`OpenAI: ${String(error)}`);
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await client().messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        thinking: { type: "adaptive" },
        system: [{ type: "text", text: AGRONOMIST_SYSTEM, cache_control: { type: "ephemeral" } }],
        output_config: { format: { type: "json_schema", schema } },
        messages: [{ role: "user", content: userContent }],
      });
      if (response.stop_reason === "refusal") throw new Error("The model declined this request.");
      const text = response.content.find((block) => block.type === "text");
      if (!text || text.type !== "text") throw new Error("Empty model response.");
      return JSON.parse(text.text) as T;
    } catch (error) {
      failures.push(`Anthropic: ${String(error)}`);
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      return await askGemini<T>(AGRONOMIST_SYSTEM, userContent, schema);
    } catch (error) {
      failures.push(`Gemini: ${String(error)}`);
    }
  }

  throw new Error(failures.length ? failures.join(" | ") : "No AI provider is configured.");
}

// ---------------------------------------------------------------- schemas

export const CROP_REC_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "2-3 sentence overview of what suits this farm and why" },
    agro_zone: { type: "string", description: "The agro-ecological zone inferred from elevation/location" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          crop: { type: "string" },
          suitability: { type: "string", enum: ["excellent", "good", "moderate", "marginal"] },
          rationale: { type: "string" },
          planting_window: { type: "string" },
          water_needs: { type: "string" },
          key_risks: { type: "array", items: { type: "string" } },
          first_steps: { type: "array", items: { type: "string" } },
          mixed_cropping: { type: "string", description: "A compatible mixed/intercrop plan, or why monocropping is preferable" },
          commercial_note: { type: "string", description: "Acre-based scale, labor, market, and risk note; concise for household mode" },
        },
        required: ["crop", "suitability", "rationale", "planting_window", "water_needs", "key_risks", "first_steps", "mixed_cropping", "commercial_note"],
        additionalProperties: false,
      },
    },
    data_gaps: {
      type: "array",
      items: { type: "string" },
      description: "Missing information that would improve this recommendation",
    },
    sources: {
      type: "array",
      items: {
        type: "object",
        properties: { title: { type: "string" }, url: { type: "string" } },
        required: ["title", "url"], additionalProperties: false,
      },
    },
  },
  required: ["summary", "agro_zone", "recommendations", "data_gaps", "sources"],
  additionalProperties: false,
} as const;

export const DISEASE_SCHEMA = {
  type: "object",
  properties: {
    is_plant_image: { type: "boolean" },
    image_quality_ok: { type: "boolean" },
    quality_advice: { type: "string", description: "If the photo is unusable, how to retake it; else empty string" },
    crop_identified: { type: "string" },
    diagnoses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          condition: { type: "string", description: "Disease/pest/deficiency name, or 'healthy'" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          symptoms_observed: { type: "string" },
          severity: { type: "string", enum: ["none", "mild", "moderate", "severe"] },
        },
        required: ["condition", "confidence", "symptoms_observed", "severity"],
        additionalProperties: false,
      },
    },
    immediate_actions: { type: "array", items: { type: "string" } },
    organic_treatment: { type: "array", items: { type: "string" } },
    chemical_treatment: {
      type: "array",
      items: { type: "string" },
      description: "Only if warranted; include safety notes. Empty if not needed.",
    },
    prevention: { type: "array", items: { type: "string" } },
    refer_to_expert: {
      type: "boolean",
      description: "True if the farmer should take a sample to NPPC/extension office",
    },
    referral_reason: { type: "string" },
    sources: {
      type: "array",
      items: {
        type: "object",
        properties: { title: { type: "string" }, url: { type: "string" } },
        required: ["title", "url"], additionalProperties: false,
      },
    },
  },
  required: [
    "is_plant_image", "image_quality_ok", "quality_advice", "crop_identified", "diagnoses",
    "immediate_actions", "organic_treatment", "chemical_treatment", "prevention",
    "refer_to_expert", "referral_reason", "sources",
  ],
  additionalProperties: false,
} as const;

export const SOIL_SCHEMA = {
  type: "object",
  properties: {
    health_rating: { type: "string", enum: ["good", "fair", "poor"] },
    summary: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          parameter: { type: "string" },
          status: { type: "string", enum: ["low", "adequate", "high", "unknown"] },
          note: { type: "string" },
        },
        required: ["parameter", "status", "note"],
        additionalProperties: false,
      },
    },
    amendments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          action: { type: "string" },
          quantity: { type: "string" },
          timing: { type: "string" },
          type: { type: "string", enum: ["organic", "mineral", "practice"] },
        },
        required: ["action", "quantity", "timing", "type"],
        additionalProperties: false,
      },
    },
    retest_advice: { type: "string" },
    sources: {
      type: "array",
      items: {
        type: "object",
        properties: { title: { type: "string" }, url: { type: "string" } },
        required: ["title", "url"], additionalProperties: false,
      },
    },
  },
  required: ["health_rating", "summary", "findings", "amendments", "retest_advice", "sources"],
  additionalProperties: false,
} as const;

// In-memory store for IoT sensor readings (hardware deferred; API is live).
type IotReading = Record<string, unknown> & { device_id: string };
const globalStore = globalThis as unknown as { __iotReadings?: Map<string, IotReading> };
export const iotReadings: Map<string, IotReading> =
  globalStore.__iotReadings ?? (globalStore.__iotReadings = new Map());
