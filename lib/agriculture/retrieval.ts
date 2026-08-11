import { corpus } from "./corpus";
import type { AdviceTask, EvidencePassage } from "./contracts";

const words = (value: string) => new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? []);
const overlap = (a: Set<string>, b: Set<string>) => [...a].filter((word) => b.has(word)).length;

export function retrieveEvidence(input: {
  task: AdviceTask;
  geography?: string;
  crop?: string;
  query: string;
  limit?: number;
}): EvidencePassage[] {
  const queryWords = words(`${input.task} ${input.query} ${input.crop ?? ""} ${input.geography ?? ""}`);
  const geography = input.geography?.toLowerCase();
  const crop = input.crop?.toLowerCase();
  const taskTerms: Record<AdviceTask, RegExp> = {
    crop: /crop|agro-ecological|elevation|climate|production|local production/,
    disease: /disease|pest|referral|plant health|differential diagnosis/,
    soil: /soil|lime|fertilizer|manure|nutrient|organic matter/,
  };
  return corpus.passages
    .filter((passage) => taskTerms[input.task].test(passage.topics.join(" ").toLowerCase()))
    .map((passage) => {
      const searchable = words(`${passage.title} ${passage.text} ${passage.topics.join(" ")} ${passage.crops.join(" ")} ${passage.geographies.join(" ")}`);
      let score = overlap(queryWords, searchable);
      if (geography && passage.geographies.some((item) => geography.includes(item.toLowerCase()) || item.toLowerCase().includes(geography))) score += 5;
      if (crop && passage.crops.some((item) => crop.includes(item.toLowerCase()) || item.toLowerCase().includes(crop))) score += 5;
      if (passage.crops.includes("all")) score += 1;
      return { passage, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.passage.id.localeCompare(b.passage.id))
    .slice(0, Math.min(input.limit ?? 8, 8))
    .map((entry) => entry.passage);
}

export function formatEvidence(passages: EvidencePassage[]) {
  return passages.map((item) => `[${item.id}] ${item.publisher}; ${item.title}; ${item.section}\n${item.text}\nURL: ${item.url}`).join("\n\n").slice(0, 12000);
}
