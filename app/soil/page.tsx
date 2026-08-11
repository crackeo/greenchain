"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CalendarClock, FlaskConical, Leaf, Scale, TestTube2 } from "lucide-react";
import { ErrorBox, FarmModeSwitch, Field, Kicker, Loading, Notice, PageIntro, Pill, Sources, postJson, type FarmMode, type Source } from "@/components/ui";
import { LocationElevation } from "@/components/LocationElevation";

type SoilResponse = { health_rating: "good" | "fair" | "poor"; summary: string; findings: { parameter: string; status: "low" | "adequate" | "high" | "unknown"; note: string }[]; amendments: { action: string; quantity: string; timing: string; type: "organic" | "mineral" | "practice" }[]; retest_advice: string; sources: Source[] };

export default function SoilPage() {
  const [mode, setMode] = useState<FarmMode>("household"); const [devices, setDevices] = useState<string[]>([]);
  const [form, setForm] = useState({ device: "", crop: "", location: "", elevation: "", ph: "", n: "", p: "", k: "", om: "", texture: "", drainage: "", notes: "" });
  const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [result, setResult] = useState<SoilResponse | null>(null);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((old) => ({ ...old, [key]: e.target.value }));
  useEffect(() => { fetch("/api/status").then((r) => r.ok ? r.json() : null).then((data) => Array.isArray(data?.iot_devices) && setDevices(data.iot_devices)).catch(() => undefined); }, []);
  async function submit(e: React.FormEvent) { e.preventDefault(); setLoading(true); setError(""); setResult(null); try { setResult(await postJson<SoilResponse>("/api/soil-health", { farmer_type: mode, target_crop: form.crop, location: form.location, elevation_m: Number(form.elevation), ph: form.ph ? Number(form.ph) : null, nitrogen_kg_ha: form.n ? Number(form.n) : null, phosphorus_kg_ha: form.p ? Number(form.p) : null, potassium_kg_ha: form.k ? Number(form.k) : null, organic_matter_pct: form.om ? Number(form.om) : null, texture: form.texture, drainage: form.drainage, notes: form.notes, data_source: form.device ? "iot_sensor" : "manual_entry", iot_device: form.device })); } catch (err) { setError(err instanceof Error ? err.message : "Could not assess this soil."); } finally { setLoading(false); } }

  return <>
    <PageIntro eyebrow="Soil health" title={<>Turn soil numbers into a <em>clear action plan</em></>} description="Enter only the values you have from an NSSC report, soil health card, or connected sensor. We explain what each result means and what to do per acre." />
    <FarmModeSwitch value={mode} onChange={setMode} />
    <form className="card form-card" onSubmit={submit}>
      <div className="form-section-head"><span>1</span><div><h2>Farm and crop</h2><p>This helps judge your soil against the right crop needs.</p></div></div>
      <div className="form-grid">
        {devices.length > 0 && <Field label="Connected sensor"><select value={form.device} onChange={set("device")}><option value="">Manual soil report</option>{devices.map((id) => <option key={id}>{id}</option>)}</select></Field>}
        <Field label="Target crop"><input value={form.crop} onChange={set("crop")} placeholder="e.g. large cardamom" /></Field>
        <LocationElevation place={form.location} elevation={form.elevation} onPlace={(location) => setForm((old) => ({ ...old, location }))} onElevation={(elevation) => setForm((old) => ({ ...old, elevation }))} />
        <Field label="Soil texture"><select value={form.texture} onChange={set("texture")}><option value="">Not sure</option><option>Sandy</option><option>Loamy</option><option>Clayey</option><option>Silty</option></select></Field>
        <Field label="Drainage"><select value={form.drainage} onChange={set("drainage")}><option value="">Not sure</option><option>Drains quickly</option><option>Moist but not waterlogged</option><option>Water stands after rain</option></select></Field>
      </div>
      <div className="form-section-head"><span>2</span><div><h2>Soil test values</h2><p>Leave any missing value blank. Do not guess.</p></div></div>
      <div className="soil-metrics">
        <Field label="pH" hint="Acidity / alkalinity"><input inputMode="decimal" type="number" min="3" max="10" step="0.1" value={form.ph} onChange={set("ph")} placeholder="6.2" /></Field>
        <Field label="Nitrogen (N)"><div className="input-unit"><input inputMode="decimal" type="number" min="0" value={form.n} onChange={set("n")} /><span>kg/ha</span></div></Field>
        <Field label="Phosphorus (P)"><div className="input-unit"><input inputMode="decimal" type="number" min="0" value={form.p} onChange={set("p")} /><span>kg/ha</span></div></Field>
        <Field label="Potassium (K)"><div className="input-unit"><input inputMode="decimal" type="number" min="0" value={form.k} onChange={set("k")} /><span>kg/ha</span></div></Field>
        <Field label="Organic matter"><div className="input-unit"><input inputMode="decimal" type="number" min="0" max="100" step="0.1" value={form.om} onChange={set("om")} /><span>%</span></div></Field>
      </div>
      <Field label="Field history or visible problems" wide><textarea value={form.notes} onChange={set("notes")} placeholder="Example: paddy for 10 years, yellow leaves, water stands after monsoon rain" /></Field>
      <div className="form-actions"><button className="btn" disabled={loading}><TestTube2 size={18} />{loading ? "Assessing soil…" : "Create soil plan"}<ArrowRight size={18} /></button></div>
    </form>
    {loading && <Loading msg="Comparing soil values with crop needs…" />}{error && <ErrorBox msg={error} />}
    {result && <section className="results" aria-live="polite">
      <Notice><div className="rating-line"><span>Overall soil health</span><Pill value={result.health_rating} /></div><p>{result.summary}</p></Notice>
      <div className="results-head"><div><span className="eyebrow">What the test means</span><h2>Nutrient findings</h2></div></div>
      <div className="finding-grid">{result.findings.map((item) => <article className="finding-card" key={item.parameter}><div><FlaskConical /><Pill value={item.status} /></div><h3>{item.parameter}</h3><p>{item.note}</p></article>)}</div>
      <div className="results-head"><div><span className="eyebrow">Your action plan</span><h2>Soil amendments, in order</h2></div><span>{mode === "commercial" ? "Quantities scaled by acre" : "Start small and observe"}</span></div>
      <div className="amendment-list">{result.amendments.map((item, i) => <article className="amendment" key={`${item.action}-${i}`}><span className="rank">{i + 1}</span><div><div className="recommendation-title"><h3>{item.action}</h3><Pill value={item.type} /></div><div className="amendment-facts"><span><Scale /> <b>How much</b>{item.quantity}</span><span><CalendarClock /> <b>When</b>{item.timing}</span></div></div></article>)}</div>
      <section className="card retest"><Leaf /><div><Kicker>When to test again</Kicker><p>{result.retest_advice}</p></div></section>
      <Sources items={result.sources} />
    </section>}
  </>;
}
