"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, LoaderCircle, Store, UserRound } from "lucide-react";

export type FarmMode = "household" | "commercial";
export type Source = { title: string; url: string };

const TONE: Record<string, string> = {
  excellent: "tone-good", good: "tone-good", high: "tone-good", adequate: "tone-good", organic: "tone-good",
  moderate: "tone-warn", medium: "tone-warn", fair: "tone-warn", mild: "tone-warn", unknown: "tone-warn", mineral: "tone-warn",
  marginal: "tone-bad", low: "tone-bad", poor: "tone-bad", severe: "tone-bad",
  none: "tone-neutral", practice: "tone-neutral",
};

export function Pill({ value, label }: { value: string; label?: string }) {
  return <span className={`pill ${TONE[value] ?? "tone-neutral"}`}>{label ?? value}</span>;
}

export function FarmModeSwitch({ value, onChange }: { value: FarmMode; onChange: (mode: FarmMode) => void }) {
  return (
    <fieldset className="mode-switch">
      <legend>How do you farm?</legend>
      <button type="button" className={value === "household" ? "selected" : ""} onClick={() => onChange("household")} aria-pressed={value === "household"}>
        <UserRound aria-hidden="true" /><span><b>Household farm</b><small>Food, mixed crops, low-cost steps</small></span>
      </button>
      <button type="button" className={value === "commercial" ? "selected" : ""} onClick={() => onChange("commercial")} aria-pressed={value === "commercial"}>
        <Store aria-hidden="true" /><span><b>Commercial farm</b><small>Acres, yield, labor and market</small></span>
      </button>
    </fieldset>
  );
}

export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children?: ReactNode }) {
  return <header className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{children}</header>;
}

export function Loading({ msg }: { msg: string }) {
  return <div className="feedback loading" role="status"><LoaderCircle className="spinner" aria-hidden="true" /><div><b>{msg}</b><small>We are checking your details and preparing practical advice.</small></div></div>;
}

export function ErrorBox({ msg }: { msg: string }) {
  return <div className="feedback error-box" role="alert"><AlertTriangle aria-hidden="true" /><span>{msg}</span></div>;
}

export function Notice({ children, urgent = false }: { children: ReactNode; urgent?: boolean }) {
  const Icon = urgent ? AlertTriangle : CheckCircle2;
  return <div className={`feedback ${urgent ? "urgent" : "notice"}`}><Icon aria-hidden="true" /><div>{children}</div></div>;
}

export function Bullets({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return <ul className="action-list">{items.map((item, i) => <li key={`${item}-${i}`}><CheckCircle2 aria-hidden="true" /> <span>{item}</span></li>)}</ul>;
}

export function Kicker({ children }: { children: ReactNode }) { return <h4 className="kicker">{children}</h4>; }

export function Field({ label, hint, children, wide = false }: { label: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return <div className={`field${wide ? " wide" : ""}`}><label>{label}</label>{children}{hint && <small className="field-hint">{hint}</small>}</div>;
}

export function Sources({ items }: { items?: Source[] }) {
  if (!items?.length) return null;
  const safe = items.filter((item) => /^https?:\/\//.test(item.url));
  if (!safe.length) return null;
  return <section className="sources"><h3>Sources checked</h3><p>Use these links to verify technical details.</p><div>{safe.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div></section>;
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error === "no_api_key" ? "AI is not configured yet. Add an API key on the server." : data.error || `Request failed (${response.status})`);
  return data as T;
}
