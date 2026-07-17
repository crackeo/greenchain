"use client";

import { useState } from "react";
import { Pill, Loading, ErrorBox, Bullets, Kicker, Field, postJson } from "@/components/ui";

type Suitability = "excellent" | "good" | "moderate" | "marginal";

interface Recommendation {
  crop: string;
  suitability: Suitability;
  rationale: string;
  planting_window: string;
  water_needs: string;
  key_risks: string[];
  first_steps: string[];
}

interface CropResponse {
  summary: string;
  agro_zone: string;
  recommendations: Recommendation[];
  data_gaps: string[];
}

const IRRIGATION_OPTIONS = [
  "Rain-fed only",
  "Stream / channel irrigation",
  "Sprinkler or drip",
  "Reliable year-round water",
];

const TERRAIN_OPTIONS = [
  "Flat / valley floor",
  "Gentle slope / terraced",
  "Steep slope",
];

export default function CropsPage() {
  const [location, setLocation] = useState("");
  const [elevation, setElevation] = useState("");
  const [landArea, setLandArea] = useState("");
  const [irrigation, setIrrigation] = useState("");
  const [terrain, setTerrain] = useState("");
  const [soilPh, setSoilPh] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CropResponse | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await postJson<CropResponse>("/api/crop-recommendation", {
        location,
        elevation_m: elevation ? Number(elevation) : null,
        land_area_acres: landArea ? Number(landArea) : null,
        irrigation,
        terrain,
        soil_ph: soilPh ? Number(soilPh) : null,
        notes,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="page-title">
        Which crops suit <em>your</em> land?
      </h1>
      <p className="page-sub">
        Fill in what you know — leave the rest blank. Elevation matters most in Bhutan.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <Field label="Dzongkhag / place">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Punakha"
              />
            </Field>
            <Field label="Elevation (m)">
              <input
                type="number"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
                placeholder="e.g. 1250"
              />
            </Field>
            <Field label="Land area (acres)">
              <input
                type="number"
                step={0.1}
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                placeholder="e.g. 1.5"
              />
            </Field>
            <Field label="Irrigation">
              <select value={irrigation} onChange={(e) => setIrrigation(e.target.value)}>
                <option value="">Unknown</option>
                {IRRIGATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Slope / terrain">
              <select value={terrain} onChange={(e) => setTerrain(e.target.value)}>
                <option value="">Unknown</option>
                {TERRAIN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Soil pH (if tested)">
              <input
                type="number"
                step={0.1}
                value={soilPh}
                onChange={(e) => setSoilPh(e.target.value)}
                placeholder="e.g. 6.2"
              />
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Anything else (current crops, frost, wildlife problems…)">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. grew potatoes last year, wild boar visit at night"
                />
              </Field>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn" type="submit" disabled={loading}>
              Get recommendations
            </button>
          </div>
        </form>
      </div>

      {loading && <Loading msg="Analysing your farm conditions…" />}
      {error && <ErrorBox msg={error} />}

      {result && (
        <>
          <div className="summary-box">
            <b>{result.agro_zone}</b> {result.summary}
          </div>

          {result.recommendations.map((rec) => (
            <div className="result-item" key={rec.crop}>
              <h3>
                {rec.crop} <Pill value={rec.suitability} />
              </h3>
              <p>{rec.rationale}</p>
              <Kicker>Planting window</Kicker>
              <p>{rec.planting_window}</p>
              <Kicker>Water needs</Kicker>
              <p>{rec.water_needs}</p>
              <Kicker>Risks</Kicker>
              <Bullets items={rec.key_risks} />
              <Kicker>First steps</Kicker>
              <Bullets items={rec.first_steps} />
            </div>
          ))}

          {result.data_gaps.length > 0 && (
            <div className="card">
              <h2>To improve this advice</h2>
              <Bullets items={result.data_gaps} />
            </div>
          )}
        </>
      )}
    </>
  );
}
