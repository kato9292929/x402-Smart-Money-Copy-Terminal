import { NextResponse } from "next/server";

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
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  const discovery = {
    endpoints: [
      {
        path: "/api/signals",
        method: "GET",
        description: "Smart Money Signal - 1 query",
        mimeType: "application/json",
        accepts: [
          {
            scheme: "exact",
            price: "$0.05",
            network: "eip155:8453",
            payTo: WALLET_BASE,
          },
          {
            scheme: "exact",
            price: "$0.05",
            network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
            payTo: WALLET_SOLANA,
          },
        ],
      },
      {
        path: "/api/execute",
        method: "POST",
        description: "Copy Trade Execution",
        mimeType: "application/json",
        accepts: [
          {
            scheme: "exact",
            price: "$0.10",
            network: "eip155:8453",
            payTo: WALLET_BASE,
          },
          {
            scheme: "exact",
            price: "$0.10",
            network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
            payTo: WALLET_SOLANA,
          },
        ],
      },
    ],
  };

  return NextResponse.json(discovery, { headers: corsHeaders });
}
