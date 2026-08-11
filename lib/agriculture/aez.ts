import type { AgroEcologicalZone } from "./contracts";

export const POLICY_VERSION = "2026-08-12.1";

export function classifyAgroEcologicalZone(elevationM: number): AgroEcologicalZone {
  if (!Number.isFinite(elevationM) || elevationM < 0 || elevationM > 6000) {
    throw new Error("Elevation must be between 0 and 6,000 metres.");
  }
  if (elevationM < 600) return "Wet Subtropical";
  if (elevationM < 1200) return "Humid Subtropical";
  if (elevationM < 1800) return "Dry Subtropical";
  if (elevationM < 2600) return "Warm Temperate";
  if (elevationM < 3600) return "Cool Temperate";
  return "Alpine";
}
