"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, Droplets, Lightbulb, Scale, Sprout, TriangleAlert } from "lucide-react";
import { Bullets, ErrorBox, FarmModeSwitch, Field, Kicker, Loading, Notice, PageIntro, Pill, Sources, postJson, type FarmMode, type Source } from "@/components/ui";
import { LocationElevation } from "@/components/LocationElevation";

type Recommendation = {
  crop: string; suitability: "excellent" | "good" | "moderate" | "marginal"; rationale: string;
  planting_window: string; water_needs: string; key_risks: string[]; first_steps: string[];
  mixed_cropping: string; commercial_note: string;
};
type CropResponse = { summary: string; agro_zone: string; recommendations: Recommendation[]; data_gaps: string[]; sources: Source[] };

const DZONGKHAGS = ["Bumthang", "Chhukha", "Dagana", "Gasa", "Haa", "Lhuentse", "Mongar", "Paro", "Pemagatshel", "Punakha", "Samdrup Jongkhar", "Samtse", "Sarpang", "Thimphu", "Trashigang", "Trongsa", "Tsirang", "Wangdue Phodrang", "Zhemgang"];

export default function CropsPage() {
  const [mode, setMode] = useState<FarmMode>("household");
  const [form, setForm] = useState({ location: "", gewog: "", elevation: "", area: "", irrigation: "", terrain: "", ph: "", goal: "", market: "", budget: "", labor: "", current: "" });
  const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [result, setResult] = useState<CropResponse | null>(null);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((old) => ({ ...old, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(""); setResult(null);
    try {
      setResult(await postJson<CropResponse>("/api/crop-recommendation", {
        farmer_type: mode, dzongkhag: form.location, gewog_or_village: form.gewog,
        elevation_m: form.elevation ? Number(form.elevation) : null,
        land_area_acres: form.area ? Number(form.area) : null, irrigation: form.irrigation,
        terrain: form.terrain, soil_ph: form.ph ? Number(form.ph) : null,
        primary_goal: form.goal, target_market: form.market, seasonal_budget_ngultrum: form.budget,
        available_workers: form.labor, current_crops_and_notes: form.current,
      }));
    } catch (err) { setError(err instanceof Error ? err.message : "Could not prepare recommendations."); } finally { setLoading(false); }
  }

  return <>
    <PageIntro eyebrow="Crop planner" title={<>Choose crops for <em>your land</em></>} description="Tell us what you know. We use elevation, water, soil, farm size, and your goal to compare practical options." />
    <FarmModeSwitch value={mode} onChange={setMode} />
    <form className="card form-card" onSubmit={submit}>
      <div className="form-section-head"><span>1</span><div><h2>Farm location & land</h2><p>Elevation is especially important in Bhutan.</p></div></div>
      <div className="form-grid">
        <Field label="Dzongkhag"><select value={form.location} onChange={set("location")} required><option value="">Select dzongkhag</option>{DZONGKHAGS.map((x) => <option key={x}>{x}</option>)}</select></Field>
        <LocationElevation place={form.gewog} elevation={form.elevation} onPlace={(gewog) => setForm((old) => ({ ...old, gewog }))} onElevation={(elevation) => setForm((old) => ({ ...old, elevation }))} />
        {mode === "commercial" && <Field label="Land area" hint="Required for acre-based planning"><div className="input-unit"><input aria-label="Land area" inputMode="decimal" type="number" min="0.01" step="0.01" value={form.area} onChange={set("area")} placeholder="1.5" required /><span>acres</span></div></Field>}
        <Field label="Water available"><select value={form.irrigation} onChange={set("irrigation")}><option value="">Not sure</option><option>Rain-fed only</option><option>Seasonal stream or channel</option><option>Reliable year-round channel</option><option>Sprinkler irrigation</option><option>Drip irrigation</option></select></Field>
        {mode === "commercial" && <Field label="Slope or terrain"><select aria-label="Slope or terrain" value={form.terrain} onChange={set("terrain")}><option value="">Not sure</option><option>Flat valley floor</option><option>Gentle terraced slope</option><option>Steep terraced slope</option></select></Field>}
        <Field label="Soil pH" hint="Leave blank if not tested"><input inputMode="decimal" type="number" min="3" max="10" step="0.1" value={form.ph} onChange={set("ph")} placeholder="6.2" /></Field>
        <Field label="Main goal"><select value={form.goal} onChange={set("goal")}><option value="">Choose a goal</option>{mode === "household" ? <><option>Family food and nutrition</option><option>Food plus small cash income</option><option>Reduce food purchases</option></> : <><option>Highest sustainable profit</option><option>Stable year-round cash flow</option><option>Supply a buyer or cooperative</option><option>Export-quality production</option></>}</select></Field>
      </div>
      {mode === "commercial" && <div className="conditional-section"><div className="form-section-head"><span>2</span><div><h2>Commercial planning</h2><p>These details help us judge scale and market risk.</p></div></div><div className="form-grid">
        <Field label="Target market"><select value={form.market} onChange={set("market")}><option value="">Not decided</option><option>Local farm gate</option><option>Weekend or municipal market</option><option>Hotels and institutions</option><option>Cooperative or aggregator</option><option>Export market</option></select></Field>
        <Field label="Seasonal input budget"><div className="input-unit"><input inputMode="numeric" type="number" min="0" value={form.budget} onChange={set("budget")} placeholder="50000" /><span>Nu.</span></div></Field>
        <Field label="Regular workers"><input inputMode="numeric" type="number" min="1" value={form.labor} onChange={set("labor")} placeholder="3" /></Field>
      </div></div>}
      <Field label="Current crops, frost, wildlife, soil or market concerns" wide><textarea value={form.current} onChange={set("current")} placeholder="Example: maize last year, wild boar at night, frost in January, buyer 20 km away" /></Field>
      <div className="form-actions"><button className="btn" disabled={loading}>{loading ? "Preparing plan…" : "Compare suitable crops"}<ArrowRight size={18} /></button><small>Your details are used only to prepare this recommendation.</small></div>
    </form>
    {loading && <Loading msg="Comparing crops for your farm…" />}{error && <ErrorBox msg={error} />}
    {result && <section className="results" aria-live="polite">
      <Notice><b>{result.agro_zone}</b><p>{result.summary}</p></Notice>
      <div className="results-head"><div><span className="eyebrow">Your crop plan</span><h2>Best-fit options, ranked</h2></div><span>{result.recommendations.length} crops compared</span></div>
      {result.recommendations.map((rec, index) => <article className="recommendation" key={rec.crop}>
        <div className="rank">{String(index + 1).padStart(2, "0")}</div><div className="recommendation-body">
          <div className="recommendation-title"><div><span className="eyebrow">Recommendation {index + 1}</span><h3>{rec.crop}</h3></div><Pill value={rec.suitability} /></div>
          <p className="why"><Lightbulb /> <span><b>Why it fits</b>{rec.rationale}</span></p>
          <div className="fact-grid"><div><CalendarDays /><span><b>Planting window</b>{rec.planting_window}</span></div><div><Droplets /><span><b>Water needs</b>{rec.water_needs}</span></div><div><Sprout /><span><b>Mixed cropping</b>{rec.mixed_cropping}</span></div><div><Scale /><span><b>{mode === "commercial" ? "Commercial plan" : "Scale note"}</b>{rec.commercial_note}</span></div></div>
          <div className="detail-grid"><div><Kicker><TriangleAlert size={15} /> Key risks</Kicker><Bullets items={rec.key_risks} /></div><div><Kicker><Sprout size={15} /> First steps</Kicker><Bullets items={rec.first_steps} /></div></div>
        </div>
      </article>)}
      {!!result.data_gaps.length && <section className="card data-gaps"><h3>To make this plan more accurate</h3><Bullets items={result.data_gaps} /></section>}
      <Sources items={result.sources} />
    </section>}
  </>;
}
