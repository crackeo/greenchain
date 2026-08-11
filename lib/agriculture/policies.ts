const SERIOUS_DISEASE_PATTERNS: Array<{ condition: string; pattern: RegExp }> = [
  { condition: "Citrus canker", pattern: /(?:raised|corky).{0,35}(?:lesion|spot).{0,45}(?:yellow halo)|yellow halo.{0,45}(?:raised|corky)/i },
  { condition: "Citrus greening (HLB)", pattern: /(?:citrus greening|huanglongbing|\bhlb\b|asymmetric(?:al)? blotchy mottl)/i },
  { condition: "Large-cardamom viral disease", pattern: /(?:foorkey|chirke|bushy dwarf|mosaic streak)/i },
  { condition: "Apple fire blight", pattern: /(?:shepherd.?s crook|fire blight|blackened shoots?)/i },
];

export type ReferralDecision = { required: boolean; conditions: string[]; reason: string };

export function diseaseReferralPolicy(notes: string): ReferralDecision {
  const conditions = SERIOUS_DISEASE_PATTERNS.filter((entry) => entry.pattern.test(notes)).map((entry) => entry.condition);
  return conditions.length
    ? { required: true, conditions, reason: `The farmer's description matches warning signs for ${conditions.join(" or ")}. Confirm with NPPC or a Dzongkhag extension officer before treating or moving plant material.` }
    : { required: false, conditions: [], reason: "" };
}

export type SoilRateContext = {
  lab_method?: string | null;
  buffer_ph?: number | null;
  exchangeable_acidity?: number | null;
  target_crop?: string | null;
  material_analysis?: string | null;
};

export function soilRatePolicy(input: SoilRateContext) {
  const hasLimeRequirement = input.buffer_ph != null || input.exchangeable_acidity != null;
  const hasLabMethod = Boolean(input.lab_method?.trim());
  const hasCrop = Boolean(input.target_crop?.trim());
  const hasMaterialAnalysis = Boolean(input.material_analysis?.trim());
  return {
    allow_exact_lime_rate: hasLimeRequirement && hasCrop,
    allow_exact_fertilizer_rate: hasLabMethod && hasCrop,
    allow_exact_manure_rate: hasCrop && hasMaterialAnalysis,
    missing: [
      ...(!hasLimeRequirement ? ["buffer pH or exchangeable acidity"] : []),
      ...(!hasLabMethod ? ["soil laboratory extraction method"] : []),
      ...(!hasCrop ? ["target crop"] : []),
      ...(!hasMaterialAnalysis ? ["manure or amendment nutrient analysis"] : []),
    ],
  };
}

export function containsUnsupportedMarketClaim(text: string) {
  return /(?:Nu\.?|ngultrum|₹|\$)\s?\d|\d+(?:\.\d+)?\s*(?:kg|tonnes?|t)\s*(?:per|\/)(?:acre|ha)/i.test(text);
}
