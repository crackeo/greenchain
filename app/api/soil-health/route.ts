import { NextRequest, NextResponse } from "next/server";
import { hasApiKey, iotReadings } from "@/lib/claude";
import { assessSoil } from "@/lib/agriculture/advisory";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  if (!hasApiKey()) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }
  const payload = await req.json();
  // If the farmer selected an IoT device, merge its latest reading.
  const device = payload.iot_device as string | undefined;
  delete payload.iot_device;
  if (device && iotReadings.has(device)) {
    payload.sensor_reading = iotReadings.get(device);
    payload.data_source = "iot_sensor";
  }
  try {
    return NextResponse.json(await assessSoil(payload));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
