import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { x402Server } from "@/lib/x402";

export const runtime = "nodejs";

const WALLET_BASE =
  process.env.WALLET_ADDRESS_BASE ||
  process.env.WALLET_ADDRESS ||
  "0xC67d94504696960bA0f2e7C3FeE703950734c00A";

const WALLET_SOLANA =
  process.env.WALLET_ADDRESS_SOLANA ||
  "4s8XQC2WzRfgH8Xiep7ybnCW11VKRCMwxQF6jknx3VPf";

interface ExecuteBody {
  token: string;
  chain: "base" | "polygon" | "solana";
  amountUsd: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-PAYMENT, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

async function handler(request: NextRequest): Promise<NextResponse> {
  try {
    const body: ExecuteBody = await request.json();
    const { token, chain, amountUsd } = body;

    if (!token || !chain || !amountUsd) {
      return NextResponse.json(
        { error: "Missing required fields", detail: "token, chain, amountUsd are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Mock execution — replace with Coinbase AgentKit / Jupiter API in production
    const mockTxHash = `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`;

    return NextResponse.json(
      {
        txHash: mockTxHash,
        status: "success",
        executedAt: new Date().toISOString(),
        token,
        chain,
        amountUsd,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Execution failed", detail: String(err) },
      { status: 502, headers: corsHeaders }
    );
  }
}

export const POST = withX402(
  handler,
  {
    accepts: [
      {
        scheme: "exact" as const,
        price: "$0.10",
        network: "eip155:8453",
        payTo: WALLET_BASE,
      },
      {
        scheme: "exact" as const,
        price: "$0.10",
        network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        payTo: WALLET_SOLANA,
      },
    ],
    description: "Copy Trade Execution",
    mimeType: "application/json",
  },
  x402Server
);
