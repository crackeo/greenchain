import type Anthropic from "@anthropic-ai/sdk";
import { askClaude, CROP_REC_SCHEMA, DISEASE_SCHEMA, SOIL_SCHEMA } from "@/lib/claude";
import { classifyAgroEcologicalZone, POLICY_VERSION } from "./aez";
import { corpus } from "./corpus";
import { diseaseReferralPolicy, soilRatePolicy } from "./policies";
import { formatEvidence, retrieveEvidence } from "./retrieval";

type Source = { title: string; url: string };
type AnyResult = Record<string, any>;

const sources = (evidence: ReturnType<typeof retrieveEvidence>): Source[] =>
  evidence.map(({ title, url }) => ({ title, url }));

const evidenceRules = (evidence: ReturnType<typeof retrieveEvidence>) => `\n\nOFFICIAL EVIDENCE PACK:\n${formatEvidence(evidence)}\n\nUse only this evidence for factual agricultural claims. Do not invent prices, yields, dosages, dates, or sources. If the evidence is insufficient, state the gap plainly.`;

export async function adviseCrops(payload: Record<string, unknown>) {
  const elevation = Number(payload.elevation_m);
  if (!Number.isFinite(elevation)) throw new Error("A verified or manually entered elevation is required.");
  const zone = classifyAgroEcologicalZone(elevation);
  const evidence = retrieveEvidence({ task: "crop", geography: String(payload.location ?? "Bhutan"), query: JSON.stringify(payload), limit: 6 });
  const result = await askClaude<AnyResult>(
    `Recommend 3-5 crops for this Bhutan farm, ranked best first. The deterministic agro-ecological zone is ${zone}; do not recalculate it. Unknown fields must remain unknown.\nFarm details:\n${JSON.stringify(payload, null, 2)}${evidenceRules(evidence)}`,
    CROP_REC_SCHEMA,
  );
  result.agro_zone = zone;
  result.sources = sources(evidence);
  result.advice_metadata = { corpus_version: corpus.version, policy_version: POLICY_VERSION, evidence_status: evidence.length ? "grounded" : "insufficient", retrieved_source_ids: evidence.map((item) => item.id) };
  return result;
}

export async function diagnosePlant(content: Anthropic.ContentBlockParam[], crop: string, notes: string) {
  const referral = diseaseReferralPolicy(`${crop} ${notes}`);
  const evidence = retrieveEvidence({ task: "disease", crop, query: notes || crop || "plant disease", limit: 6 });
  content.push({ type: "text", text: evidenceRules(evidence) });
  const result = await askClaude<AnyResult>(content, DISEASE_SCHEMA);
  if (referral.required) {
    result.refer_to_expert = true;
    result.referral_reason = referral.reason;
    const diagnoses = Array.isArray(result.diagnoses) ? result.diagnoses : [];
    for (const condition of referral.conditions) {
      if (!diagnoses.some((item: AnyResult) => String(item.condition).toLowerCase().includes(condition.toLowerCase()))) {
        diagnoses.unshift({ condition: `Suspected ${condition}`, confidence: "medium", symptoms_observed: notes, severity: "moderate" });
      }
    }
    result.diagnoses = diagnoses;
  }
  result.sources = sources(evidence);
  result.advice_metadata = { corpus_version: corpus.version, policy_version: POLICY_VERSION, evidence_status: evidence.length ? "grounded" : "insufficient", retrieved_source_ids: evidence.map((item) => item.id) };
  return result;
}

export async function assessSoil(payload: Record<string, unknown>) {
  const ratePolicy = soilRatePolicy({
    lab_method: String(payload.lab_method ?? ""),
    buffer_ph: typeof payload.buffer_ph === "number" ? payload.buffer_ph : null,
    exchangeable_acidity: typeof payload.exchangeable_acidity === "number" ? payload.exchangeable_acidity : null,
    target_crop: String(payload.target_crop ?? ""),
    material_analysis: String(payload.material_analysis ?? ""),
  });
  const evidence = retrieveEvidence({ task: "soil", crop: String(payload.target_crop ?? ""), geography: String(payload.location ?? "Bhutan"), query: JSON.stringify(payload), limit: 6 });
  const result = await askClaude<AnyResult>(
    `Assess this Bhutan farm soil. Exact lime, fertilizer, or manure rates are forbidden unless explicitly allowed below. Rate policy: ${JSON.stringify(ratePolicy)}. Give qualitative next steps and name the missing test instead.\nSoil data:\n${JSON.stringify(payload, null, 2)}${evidenceRules(evidence)}`,
    SOIL_SCHEMA,
  );
  if (Array.isArray(result.amendments)) {
    result.amendments = result.amendments.map((item: AnyResult) => {
      const action = String(item.action ?? "").toLowerCase();
      const allowed = action.includes("lime") ? ratePolicy.allow_exact_lime_rate : action.includes("manure") || action.includes("compost") ? ratePolicy.allow_exact_manure_rate : ratePolicy.allow_exact_fertilizer_rate;
      return allowed ? item : { ...item, quantity: "Confirm the amount with NSSC or your extension officer after the required soil/material test." };
    });
  }
  result.sources = sources(evidence);
  result.advice_metadata = { corpus_version: corpus.version, policy_version: POLICY_VERSION, evidence_status: evidence.length ? "grounded" : "insufficient", retrieved_source_ids: evidence.map((item) => item.id) };
  return result;
}
