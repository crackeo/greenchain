"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { Camera, CheckCircle2, ImagePlus, RotateCcw, ScanLine, ShieldAlert, Upload } from "lucide-react";
import { Bullets, ErrorBox, Field, Kicker, Loading, Notice, PageIntro, Pill, Sources, type Source } from "@/components/ui";

type Diagnosis = { condition: string; confidence: "high" | "medium" | "low"; symptoms_observed: string; severity: "none" | "mild" | "moderate" | "severe" };
type DiseaseResult = { is_plant_image: boolean; image_quality_ok: boolean; quality_advice: string; crop_identified: string; diagnoses: Diagnosis[]; immediate_actions: string[]; organic_treatment: string[]; chemical_treatment: string[]; prevention: string[]; refer_to_expert: boolean; referral_reason: string; sources: Source[] };

export default function DiseasePage() {
  const cameraInput = useRef<HTMLInputElement>(null); const libraryInput = useRef<HTMLInputElement>(null); const [file, setFile] = useState<File | null>(null); const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false); const [crop, setCrop] = useState(""); const [notes, setNotes] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [result, setResult] = useState<DiseaseResult | null>(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  function choose(next?: File | null) { if (!next) return; if (!next.type.startsWith("image/")) { setError("Please choose a JPG, PNG, HEIC, or WebP plant photo."); return; } if (preview) URL.revokeObjectURL(preview); setFile(next); setPreview(URL.createObjectURL(next)); setError(""); setResult(null); }
  function drop(e: DragEvent) { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files?.[0]); }
  async function submit(e: FormEvent) { e.preventDefault(); if (!file) return; setLoading(true); setError(""); setResult(null); try { const body = new FormData(); body.append("image", file); body.append("crop", crop); body.append("notes", notes); const response = await fetch("/api/disease-diagnosis", { method: "POST", body }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`); setResult(data); } catch (err) { setError(err instanceof Error ? err.message : "Could not examine the photo."); } finally { setLoading(false); } }
  function reset() { setFile(null); if (preview) URL.revokeObjectURL(preview); setPreview(""); setResult(null); setError(""); }

  return <>
    <PageIntro eyebrow="Plant doctor" title={<>Check what is <em>hurting your plant</em></>} description="Upload one clear photo of the affected leaf, fruit, stem, or whole plant. The result includes confidence, immediate action, and when to call an expert." />
    <div className="photo-tips"><span><Camera /> Use daylight</span><span><ScanLine /> Fill the frame</span><span><CheckCircle2 /> One plant per photo</span></div>
    <form className="card form-card" onSubmit={submit}>
      <div className={`dropzone${dragging ? " dragging" : ""}${preview ? " with-preview" : ""}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={drop}>
        {preview ? <><img src={preview} alt="Selected plant to diagnose" /><span className="change-photo"><ImagePlus /> Change photo</span></> : <><span className="upload-icon"><Upload /></span><b>Tap to take or choose a photo</b><small>JPG, PNG, HEIC or WebP · up to 8 MB</small></>}
      </div>
      <div className="photo-choice-row"><button type="button" className="btn" onClick={() => cameraInput.current?.click()}><Camera size={18} /> Take photo</button><button type="button" className="btn secondary" onClick={() => libraryInput.current?.click()}><ImagePlus size={18} /> Choose photo</button></div>
      <input ref={cameraInput} className="sr-only" type="file" accept="image/*" capture="environment" onChange={(e) => choose(e.target.files?.[0])} />
      <input ref={libraryInput} className="sr-only" type="file" accept="image/*" onChange={(e) => choose(e.target.files?.[0])} />
      <div className="form-grid compact"><Field label="Crop name" hint="Optional—AI will also inspect the image"><input value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="e.g. mandarin, cardamom, apple" /></Field><Field label="What did you notice?" hint="When it started and whether it is spreading"><input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Yellow spots spreading for 2 weeks" /></Field></div>
      <div className="form-actions"><button className="btn" disabled={!file || loading}><ScanLine size={18} />{loading ? "Examining photo…" : "Check plant health"}</button>{file && <button className="btn ghost" type="button" onClick={reset}><RotateCcw size={18} /> Start over</button>}</div>
    </form>
    {loading && <Loading msg="Examining visible symptoms…" />}{error && <ErrorBox msg={error} />}
    {result && (!result.is_plant_image ? <ErrorBox msg={`This does not appear to be a usable plant photo. ${result.quality_advice}`} /> : <section className="results" aria-live="polite">
      {!result.image_quality_ok && <Notice urgent><b>Retake the photo for a safer diagnosis</b><p>{result.quality_advice}</p></Notice>}
      <Notice><b>Plant identified: {result.crop_identified}</b><p>Compare the symptoms below with more than one plant before treating the whole field.</p></Notice>
      {result.refer_to_expert && <Notice urgent><b>Extension officer or NPPC review recommended</b><p>{result.referral_reason}</p></Notice>}
      <div className="results-head"><div><span className="eyebrow">Image assessment</span><h2>Likely causes</h2></div></div>
      {result.diagnoses.map((item, i) => <article className="diagnosis-card" key={`${item.condition}-${i}`}><div><span className="eyebrow">Possibility {i + 1}</span><h3>{item.condition}</h3><p>{item.symptoms_observed}</p></div><div className="diagnosis-pills"><Pill value={item.confidence} label={`${item.confidence} confidence`} /><Pill value={item.severity} label={`${item.severity} severity`} /></div></article>)}
      <div className="treatment-grid"><section className="treatment now"><Kicker><ShieldAlert /> Do this now</Kicker><Bullets items={result.immediate_actions} /></section><section className="treatment"><Kicker>Organic and low-risk options</Kicker><Bullets items={result.organic_treatment} /></section><section className="treatment"><Kicker>Chemical options</Kicker><p className="section-note">Confirm registration, label rate, PPE, and pre-harvest interval with an extension officer.</p><Bullets items={result.chemical_treatment} /></section><section className="treatment"><Kicker>Prevent it next time</Kicker><Bullets items={result.prevention} /></section></div>
      <Sources items={result.sources} />
    </section>)}
  </>;
}
