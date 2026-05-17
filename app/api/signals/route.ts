import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import type { Address } from "viem";
import { fetchSmartMoneySignals } from "@/lib/nansen";

export const runtime = "nodejs";

const payTo = (
  process.env.WALLET_ADDRESS ?? "0x0000000000000000000000000000000000000000"
) as Address;

async function handler(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const chain = (searchParams.get("chain") || "base") as
    | "base"
    | "polygon"
    | "solana";

  if (!["base", "polygon", "solana"].includes(chain)) {
    return NextResponse.json({ error: "Invalid chain" }, { status: 400 });
  }

  try {
    const signals = await fetchSmartMoneySignals(chain);
    return NextResponse.json({ signals });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch signals" },
      { status: 500 }
    );
  }
}

export const GET = withX402(handler, payTo, {
  price: "$0.05",
  network: "base",
  config: { description: "Smart Money Signal - 1 query" },
});
