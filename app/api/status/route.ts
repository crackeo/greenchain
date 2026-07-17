import { NextResponse } from "next/server";
import { hasApiKey, activeProvider, activeModel, iotReadings } from "@/lib/claude";

export function GET() {
  return NextResponse.json({
    api_key_configured: hasApiKey(),
    provider: activeProvider(),
    model: activeModel(),
    iot_devices: [...iotReadings.keys()],
  });
}
