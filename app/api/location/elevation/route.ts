import { NextRequest, NextResponse } from "next/server";
import { lookupElevation } from "@/lib/location/elevation";

export async function GET(req: NextRequest) {
  try { return NextResponse.json(await lookupElevation(Number(req.nextUrl.searchParams.get("latitude")), Number(req.nextUrl.searchParams.get("longitude")))); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not find elevation." }, { status: 422 }); }
}
