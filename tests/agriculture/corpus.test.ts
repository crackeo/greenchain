import { describe, expect, it } from "vitest";
import { corpus, validateCorpus } from "@/lib/agriculture/corpus";
import { retrieveEvidence } from "@/lib/agriculture/retrieval";

describe("official evidence corpus", () => {
  it("has unique, direct, validated sources", () => {
    expect(validateCorpus(corpus)).toBe(corpus);
    expect(new Set(corpus.passages.map((item) => item.id)).size).toBe(corpus.passages.length);
  });

  it("retrieves the official Bhutan AEZ source for elevation questions", () => {
    const result = retrieveEvidence({ task: "crop", geography: "Punakha", query: "elevation agro ecological zone 1250" });
    expect(result.map((item) => item.id)).toContain("fao-bhutan-aez");
  });

  it("retrieves canker evidence for warning symptoms", () => {
    const result = retrieveEvidence({ task: "disease", crop: "mandarin citrus", query: "raised corky lesions yellow halo" });
    expect(result[0]?.id).toBe("usda-citrus-canker");
  });
});

it("keeps soil evidence free of unrelated disease-only passages", () => {
  const evidence = retrieveEvidence({ task: "soil", crop: "mandarin", query: "acidic soil pH" });
  expect(evidence.map((item) => item.id)).not.toContain("usda-citrus-canker");
});
