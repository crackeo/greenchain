"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { Pill, Loading, ErrorBox, Bullets, Kicker, Field } from "@/components/ui";

type Diagnosis = {
  condition: string;
  confidence: "high" | "medium" | "low";
  symptoms_observed: string;
  severity: "none" | "mild" | "moderate" | "severe";
};

type DiseaseResult = {
  is_plant_image: boolean;
  image_quality_ok: boolean;
  quality_advice: string;
  crop_identified: string;
  diagnoses: Diagnosis[];
  immediate_actions: string[];
  organic_treatment: string[];
  chemical_treatment: string[];
  prevention: string[];
  refer_to_expert: boolean;
  referral_reason: string;
};

export default function DiseasePage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [crop, setCrop] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseResult | null>(null);

  function pickFile(f: File | undefined | null) {
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("crop", crop);
      fd.append("notes", notes);
      const r = await fetch("/api/disease-diagnosis", { method: "POST", body: fd });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(
          j.error === "no_api_key"
            ? "No API key configured — add ANTHROPIC_API_KEY to .env.local and restart."
            : j.error || `Request failed (${r.status})`,
        );
      }
      setResult(j as DiseaseResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="page-title">
        Photograph a <em>sick</em> plant
      </h1>
      <p className="page-sub">
        Take a close, well-lit photo of the affected leaves or fruit. One plant per photo works
        best.
      </p>

      <div className="card">
        <form onSubmit={onSubmit}>
          <div
            className={`drop${preview ? " has-img" : ""}${dragging ? " dragover" : ""}`}
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Selected plant photo" />
            ) : (
              <>📷 Tap to choose a photo (or drag one here)</>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => pickFile(e.target.files?.[0])}
          />

          <div className="grid" style={{ margin: "14px 0" }}>
            <Field label="Crop (if known)">
              <input
                type="text"
                placeholder="e.g. mandarin, cardamom, apple"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              />
            </Field>
            <Field label="What have you noticed?">
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
          </div>

          <button className="btn" type="submit" disabled={!file || loading}>
            Diagnose
          </button>
        </form>
      </div>

      {loading && <Loading msg="Examining the photo…" />}
      {error && <ErrorBox msg={error} />}

      {result &&
        (!result.is_plant_image ? (
          <ErrorBox msg={"This photo doesn't appear to show a plant. " + result.quality_advice} />
        ) : (
          <>
            {!result.image_quality_ok && (
              <div className="warn-box">📷 {result.quality_advice}</div>
            )}

            <div className="summary-box">
              Crop identified: <b>{result.crop_identified}</b>
            </div>

            {result.refer_to_expert && (
              <div className="warn-box">
                🚨 Take a sample to NPPC / your extension office: {result.referral_reason}
              </div>
            )}

            {result.diagnoses.map((d, i) => (
              <div className="result-item" key={i}>
                <h3>
                  {d.condition}{" "}
                  <Pill value={d.confidence} label={`${d.confidence} confidence`} />{" "}
                  <Pill value={d.severity} />
                </h3>
                <p>{d.symptoms_observed}</p>
              </div>
            ))}

            <div className="card">
              {result.immediate_actions.length > 0 && (
                <>
                  <Kicker>Do now</Kicker>
                  <Bullets items={result.immediate_actions} />
                </>
              )}
              {result.organic_treatment.length > 0 && (
                <>
                  <Kicker>Organic treatment</Kicker>
                  <Bullets items={result.organic_treatment} />
                </>
              )}
              {result.chemical_treatment.length > 0 && (
                <>
                  <Kicker>Chemical treatment (confirm with extension office)</Kicker>
                  <Bullets items={result.chemical_treatment} />
                </>
              )}
              {result.prevention.length > 0 && (
                <>
                  <Kicker>Prevention</Kicker>
                  <Bullets items={result.prevention} />
                </>
              )}
            </div>
          </>
        ))}
    </>
  );
}
