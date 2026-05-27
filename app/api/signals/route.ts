import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { x402Server } from "@/lib/x402";
import { fetchSmartMoneySignals } from "@/lib/nansen";

export const runtime = "nodejs";

const WALLET_BASE =
  process.env.WALLET_ADDRESS_BASE ||
  process.env.WALLET_ADDRESS ||
  "0xC67d94504696960bA0f2e7C3FeE703950734c00A";

const WALLET_SOLANA =
  process.env.WALLET_ADDRESS_SOLANA ||
  "4s8XQC2WzRfgH8Xiep7ybnCW11VKRCMwxQF6jknx3VPf";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-PAYMENT, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

async function handler(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const chain = (searchParams.get("chain") || "base") as
    | "base"
    | "polygon"
    | "solana";

  if (!["base", "polygon", "solana"].includes(chain)) {
    return NextResponse.json(
      { error: "Invalid chain" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const signals = await fetchSmartMoneySignals(chain);
    return NextResponse.json({ signals }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch signals", detail: String(err) },
      { status: 502, headers: corsHeaders }
    );
  }
}

export const GET = withX402(
  handler,
  {
    accepts: [
      {
        scheme: "exact" as const,
        price: "$0.05",
        network: "eip155:8453",
        payTo: WALLET_BASE,
      },
      {
        scheme: "exact" as const,
        price: "$0.05",
        network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        payTo: WALLET_SOLANA,
      },
    ],
    description: "Smart Money Signal - 1 query",
    mimeType: "application/json",
  },
  x402Server
);
