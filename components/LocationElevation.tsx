"use client";
import { useState } from "react";
import { LocateFixed } from "lucide-react";
import { Field } from "@/components/ui";

export function LocationElevation({ place, elevation, onPlace, onElevation }: { place: string; elevation: string; onPlace: (value: string) => void; onElevation: (value: string) => void }) {
  const [status, setStatus] = useState("");
  function detect() {
    if (!navigator.geolocation) return setStatus("Location is not supported. Enter elevation manually.");
    setStatus("Finding your farm elevation…");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try { const response = await fetch(`/api/location/elevation?latitude=${coords.latitude}&longitude=${coords.longitude}`); const data = await response.json(); if (!response.ok) throw new Error(data.error); onElevation(String(data.elevation_m)); setStatus(`Detected from your location (${data.provider}). You can correct it below.`); }
      catch (error) { setStatus(error instanceof Error ? error.message : "Could not detect elevation. Enter it manually."); }
    }, () => setStatus("Location permission was not granted. Enter elevation manually."), { enableHighAccuracy: true, timeout: 10000 });
  }
  return <><Field label="Gewog or village"><input aria-label="Gewog or village" value={place} onChange={(e) => onPlace(e.target.value)} placeholder="e.g. Kikhorthang" /></Field><Field label="Elevation" hint="Detected automatically; you may correct it"><div className="elevation-control"><div className="input-unit"><input aria-label="Elevation" required inputMode="numeric" type="number" min="0" max="6000" value={elevation} onChange={(e) => onElevation(e.target.value)} placeholder="Tap detect" /><span>m</span></div><button type="button" className="btn btn-small" onClick={detect}><LocateFixed size={16} /> Detect</button></div>{status && <small className="field-status">{status}</small>}</Field></>;
}
