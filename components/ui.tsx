import type { ReactNode } from "react";

/** Maps API status words to pill tones so all modules color-code identically. */
const TONE: Record<string, string> = {
  excellent: "tone-good", good: "tone-good", high: "tone-good", adequate: "tone-good",
  moderate: "tone-warn", medium: "tone-warn", fair: "tone-warn", mild: "tone-warn", unknown: "tone-warn",
  marginal: "tone-bad", low: "tone-bad", poor: "tone-bad", severe: "tone-bad",
  none: "tone-neutral", organic: "tone-good", mineral: "tone-warn", practice: "tone-neutral",
};

export function Pill({ value, label }: { value: string; label?: string }) {
  return <span className={`pill ${TONE[value] ?? "tone-neutral"}`}>{label ?? value}</span>;
}

export function Loading({ msg }: { msg: string }) {
  return (
    <div className="loading">
      <div className="spinner" />
      {msg}
    </div>
  );
}

export function ErrorBox({ msg }: { msg: string }) {
  return <div className="error-box">⚠️ {msg}</div>;
}

export function Bullets({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <ul>
      {items.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <div className="kicker">{children}</div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

/** POST JSON helper shared by all module pages. */
export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(
      j.error === "no_api_key"
        ? "No API key configured — add ANTHROPIC_API_KEY to .env.local and restart."
        : j.error || `Request failed (${r.status})`,
    );
  }
  return j as T;
}
