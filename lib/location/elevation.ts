import type { ElevationResult } from "@/lib/agriculture/contracts";

export async function lookupElevation(latitude: number, longitude: number): Promise<ElevationResult> {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new Error("Invalid coordinates.");
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const url = new URL("https://api.open-meteo.com/v1/elevation"); url.searchParams.set("latitude", String(latitude)); url.searchParams.set("longitude", String(longitude));
    const response = await fetch(url, { signal: controller.signal, next: { revalidate: 86400 } });
    if (!response.ok) throw new Error("Elevation service is unavailable.");
    const data = await response.json(); const elevation = Array.isArray(data.elevation) ? Number(data.elevation[0]) : Number(data.elevation);
    if (!Number.isFinite(elevation)) throw new Error("No elevation was returned for this location.");
    return { elevation_m: Math.round(elevation), resolution_m: 90, provider: "Open-Meteo elevation API", latitude, longitude, source: "coordinates" };
  } finally { clearTimeout(timer); }
}
