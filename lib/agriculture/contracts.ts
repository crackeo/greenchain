export type AdviceTask = "crop" | "disease" | "soil";

export type EvidencePassage = {
  id: string;
  publisher: string;
  title: string;
  url: string;
  section: string;
  published: string;
  geographies: string[];
  crops: string[];
  topics: string[];
  text: string;
};

export type EvidenceCorpus = {
  version: string;
  review_status: string;
  passages: EvidencePassage[];
};

export type ClaimCitation = {
  source_id: string;
  title: string;
  publisher: string;
  url: string;
  section: string;
  supports: string[];
};

export type AdviceMetadata = {
  corpus_version: string;
  policy_version: string;
  evidence_status: "grounded" | "insufficient";
  retrieved_source_ids: string[];
};

export type AgroEcologicalZone =
  | "Wet Subtropical"
  | "Humid Subtropical"
  | "Dry Subtropical"
  | "Warm Temperate"
  | "Cool Temperate"
  | "Alpine";

export type ElevationResult = {
  elevation_m: number;
  resolution_m: number | null;
  provider: string;
  latitude: number;
  longitude: number;
  source: "coordinates" | "village" | "manual";
};
