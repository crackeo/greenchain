import { NextRequest, NextResponse } from "next/server";
import { askClaude, hasApiKey, SOIL_SCHEMA, iotReadings } from "@/lib/claude";

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
  const prompt =
    "Assess this soil for a farm in Bhutan and produce a practical amendment plan. " +
    "Judge nutrient levels against the needs of the target crop if given, otherwise " +
    "against general horticultural standards for the stated region/elevation.\n\n" +
    `Soil data:\n${JSON.stringify(payload, null, 2)}`;
  try {
    return NextResponse.json(await askClaude(prompt, SOIL_SCHEMA));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
