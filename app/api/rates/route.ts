import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    base: "TRY",
    timestamp: new Date().toISOString(),
    rates: {
      USD: 36.45,
      EUR: 39.80,
      GBP: 47.10,
      ALTIN_GRAM: 3120.40,
      GUMUS_GRAM: 38.90,
    },
  });
}
