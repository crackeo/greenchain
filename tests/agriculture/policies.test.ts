import { describe, expect, it } from "vitest";
import { diseaseReferralPolicy, soilRatePolicy } from "@/lib/agriculture/policies";

describe("disease referral policy", () => {
  it("forces referral for citrus-canker warning signs", () => {
    const result = diseaseReferralPolicy("Raised brown corky spots with yellow halos appeared after rain.");
    expect(result.required).toBe(true);
    expect(result.conditions).toContain("Citrus canker");
  });

  it("forces referral for HLB warning signs", () => {
    expect(diseaseReferralPolicy("Asymmetrical blotchy mottling and HLB suspected").required).toBe(true);
  });

  it("does not force referral for generic insect damage", () => {
    expect(diseaseReferralPolicy("A few leaves have small chewing holes").required).toBe(false);
  });
});

describe("soil rate policy", () => {
  it("withholds an exact lime rate when only pH is known", () => {
    expect(soilRatePolicy({ target_crop: "large cardamom" }).allow_exact_lime_rate).toBe(false);
  });

  it("allows a lime calculation only with crop and lime-requirement data", () => {
    expect(soilRatePolicy({ target_crop: "maize", buffer_ph: 6.4 }).allow_exact_lime_rate).toBe(true);
  });

  it("requires a laboratory method for exact fertilizer rates", () => {
    expect(soilRatePolicy({ target_crop: "maize" }).allow_exact_fertilizer_rate).toBe(false);
    expect(soilRatePolicy({ target_crop: "maize", lab_method: "Mehlich 3" }).allow_exact_fertilizer_rate).toBe(true);
  });
});
