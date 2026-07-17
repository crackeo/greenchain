import { NextRequest, NextResponse } from "next/server";
import { iotReadings } from "@/lib/claude";

/** Ingestion endpoint for future soil sensors (NPK/pH/moisture probe + gateway).
 *  Expected: {"device_id": "...", "ph": 6.1, "n": 40, "p": 12, "k": 110,
 *             "moisture_pct": 31, "temperature_c": 18.4, "timestamp": "..."} */
export async function POST(req: NextRequest) {
  const payload = await req.json();
  if (!payload?.device_id) {
    return NextResponse.json({ error: "device_id required" }, { status: 422 });
  }
  iotReadings.set(payload.device_id, payload);
  return NextResponse.json({ stored: true, device_id: payload.device_id });
}
