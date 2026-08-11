import { describe, expect, it } from "vitest";
import { classifyAgroEcologicalZone } from "@/lib/agriculture/aez";

describe("Bhutan agro-ecological zones", () => {
  it.each([
    [599, "Wet Subtropical"], [600, "Humid Subtropical"], [1199, "Humid Subtropical"],
    [1200, "Dry Subtropical"], [1250, "Dry Subtropical"], [1799, "Dry Subtropical"],
    [1800, "Warm Temperate"], [2599, "Warm Temperate"], [2600, "Cool Temperate"],
    [3599, "Cool Temperate"], [3600, "Alpine"],
  ])("classifies %sm", (elevation, expected) => {
    expect(classifyAgroEcologicalZone(elevation as number)).toBe(expected);
  });

  it("rejects impossible values", () => {
    expect(() => classifyAgroEcologicalZone(-1)).toThrow();
    expect(() => classifyAgroEcologicalZone(Number.NaN)).toThrow();
  });
});
