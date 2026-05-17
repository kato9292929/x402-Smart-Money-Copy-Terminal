import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import type { Address } from "viem";

export const runtime = "nodejs";

interface ExecuteBody {
  token: string;
  chain: "base" | "polygon" | "solana";
  amountUsd: number;
}

const payTo = (
  process.env.WALLET_ADDRESS ?? "0x0000000000000000000000000000000000000000"
) as Address;

async function handler(request: NextRequest): Promise<NextResponse> {
  try {
    const body: ExecuteBody = await request.json();
    const { token, chain, amountUsd } = body;

    if (!token || !chain || !amountUsd) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const mockTxHash = `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`;

    return NextResponse.json({
      txHash: mockTxHash,
      status: "success",
      executedAt: new Date().toISOString(),
      token,
      chain,
      amountUsd,
    });
  } catch {
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}

export const POST = withX402(handler, payTo, {
  price: "$0.10",
  network: "base",
  config: { description: "Copy Trade Execution" },
});
