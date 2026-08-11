import rawCorpus from "@/data/agriculture/corpus.json";
import type { EvidenceCorpus, EvidencePassage } from "./contracts";

const URL = /^https:\/\//;

export function validateCorpus(value: unknown): EvidenceCorpus {
  if (!value || typeof value !== "object") throw new Error("Agriculture corpus must be an object.");
  const candidate = value as Partial<EvidenceCorpus>;
  if (!candidate.version || !candidate.review_status || !Array.isArray(candidate.passages)) {
    throw new Error("Agriculture corpus metadata is incomplete.");
  }
  const ids = new Set<string>();
  for (const item of candidate.passages) {
    const passage = item as Partial<EvidencePassage>;
    if (!passage.id || ids.has(passage.id)) throw new Error(`Invalid or duplicate source id: ${passage.id ?? "missing"}`);
    if (!passage.title || !passage.publisher || !passage.section || !passage.text || !URL.test(passage.url ?? "")) {
      throw new Error(`Source ${passage.id} is missing direct provenance.`);
    }
    if (!Array.isArray(passage.geographies) || !Array.isArray(passage.crops) || !Array.isArray(passage.topics)) {
      throw new Error(`Source ${passage.id} is missing retrieval tags.`);
    }
    ids.add(passage.id);
  }
  return candidate as EvidenceCorpus;
}

export const corpus = validateCorpus(rawCorpus);
export const passageById = new Map(corpus.passages.map((passage) => [passage.id, passage]));
