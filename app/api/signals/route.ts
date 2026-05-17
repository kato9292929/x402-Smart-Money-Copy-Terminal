import { NextRequest, NextResponse } from "next/server";
import { fetchSmartMoneySignals } from "@/lib/nansen";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chain = (searchParams.get("chain") || "base") as "base" | "polygon" | "solana";

  if (!["base", "polygon", "solana"].includes(chain)) {
    return NextResponse.json({ error: "Invalid chain" }, { status: 400 });
  }

  try {
    const signals = await fetchSmartMoneySignals(chain);
    return NextResponse.json({ signals });
  } catch {
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 });
  }
}
