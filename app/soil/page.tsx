"use client";

import { useEffect, useState } from "react";
import { Pill, Loading, ErrorBox, Kicker, Field, postJson } from "@/components/ui";

type HealthRating = "good" | "fair" | "poor";
type FindingStatus = "low" | "adequate" | "high" | "unknown";
type AmendmentType = "organic" | "mineral" | "practice";

interface Finding {
  parameter: string;
  status: FindingStatus;
  note: string;
}

interface Amendment {
  action: string;
  quantity: string;
  timing: string;
  type: AmendmentType;
}

interface SoilResponse {
  health_rating: HealthRating;
  summary: string;
  findings: Finding[];
  amendments: Amendment[];
  retest_advice: string;
}

const TEXTURE_OPTIONS = ["Sandy", "Loamy", "Clayey", "Silty"];

export default function SoilPage() {
  const [targetCrop, setTargetCrop] = useState("");
  const [location, setLocation] = useState("");
  const [ph, setPh] = useState("");
  const [nitrogen, setNitrogen] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [potassium, setPotassium] = useState("");
  const [organicMatter, setOrganicMatter] = useState("");
  const [texture, setTexture] = useState("");
  const [notes, setNotes] = useState("");

  const [iotDevices, setIotDevices] = useState<string[]>([]);
  const [iotDevice, setIotDevice] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SoilResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && Array.isArray(j?.iot_devices)) {
          setIotDevices(j.iot_devices);
        }
      })
      .catch(() => {
        /* status is optional — manual entry still works */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await postJson<SoilResponse>("/api/soil-health", {
        target_crop: targetCrop,
        location,
        ph: ph ? Number(ph) : null,
        nitrogen_kg_ha: nitrogen ? Number(nitrogen) : null,
        phosphorus_kg_ha: phosphorus ? Number(phosphorus) : null,
        potassium_kg_ha: potassium ? Number(potassium) : null,
        organic_matter_pct: organicMatter ? Number(organicMatter) : null,
        texture,
        notes,
        data_source: "manual_entry",
        iot_device: iotDevice,
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
        Soil health <em>check</em>
      </h1>
      <p className="page-sub">
        Enter values from a soil test report (NSSC / soil health card). IoT sensor readings will
        pre-fill automatically once a device is connected.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid">
            {iotDevices.length > 0 && (
              <Field label="IoT device">
                <select value={iotDevice} onChange={(e) => setIotDevice(e.target.value)}>
                  <option value="">None — manual entry</option>
                  {iotDevices.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="Target crop">
              <input
                type="text"
                value={targetCrop}
                onChange={(e) => setTargetCrop(e.target.value)}
                placeholder="e.g. cardamom"
              />
            </Field>
            <Field label="Place / elevation">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Samtse, 600 m"
              />
            </Field>
            <Field label="pH">
              <input
                type="number"
                step={0.1}
                value={ph}
                onChange={(e) => setPh(e.target.value)}
              />
            </Field>
            <Field label="Nitrogen N kg/ha">
              <input
                type="number"
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
              />
            </Field>
            <Field label="Phosphorus P kg/ha">
              <input
                type="number"
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
              />
            </Field>
            <Field label="Potassium K kg/ha">
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
              />
            </Field>
            <Field label="Organic matter %">
              <input
                type="number"
                step={0.1}
                value={organicMatter}
                onChange={(e) => setOrganicMatter(e.target.value)}
              />
            </Field>
            <Field label="Texture">
              <select value={texture} onChange={(e) => setTexture(e.target.value)}>
                <option value="">Unknown</option>
                {TEXTURE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Notes">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. field was under paddy for 10 years; water stagnates after rain"
                />
              </Field>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn" type="submit" disabled={loading}>
              Analyse soil
            </button>
          </div>
        </form>
      </div>

      {loading && <Loading msg="Assessing soil health…" />}
      {error && <ErrorBox msg={error} />}

      {result && (
        <>
          <div className="summary-box">
            Soil health: <Pill value={result.health_rating} />
            <br />
            {result.summary}
          </div>

          {result.findings.map((f) => (
            <div className="result-item" key={f.parameter}>
              <h3>
                {f.parameter} <Pill value={f.status} />
              </h3>
              <p>{f.note}</p>
            </div>
          ))}

          <div className="card">
            <h2>Amendment plan</h2>
            {result.amendments.map((a, i) => (
              <div className="result-item accent-amber" key={i}>
                <h3>
                  {a.action} <Pill value={a.type} />
                </h3>
                <p>
                  <b>How much:</b> {a.quantity}
                </p>
                <p>
                  <b>When:</b> {a.timing}
                </p>
              </div>
            ))}
            <Kicker>Re-testing</Kicker>
            <p>{result.retest_advice}</p>
          </div>
        </>
      )}
    </>
  );
}
