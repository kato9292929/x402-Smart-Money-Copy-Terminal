export interface SignalData {
  token: string;
  chain: "base" | "polygon" | "solana";
  netFlowUsd: number;
  smartWallets: number;
  uniqueWallets: number;
  signal: "BUY" | "WATCH" | "NONE";
}

const NANSEN_BASE_URL = "https://api.nansen.ai";

export async function fetchSmartMoneySignals(chain: "base" | "polygon" | "solana"): Promise<SignalData[]> {
  const apiKey = process.env.NANSEN_API_KEY;

  if (!apiKey) {
    return getMockSignals(chain);
  }

  try {
    const res = await fetch(
      `${NANSEN_BASE_URL}/v2/smart-money/token-flows?chain=${chain}`,
      {
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return getMockSignals(chain);
    }

    const data = await res.json();

    return data
      .filter((item: { smartWallets: number; netFlow: number; uniqueWallets: number }) =>
        item.smartWallets > 5 &&
        item.netFlow > 5000 &&
        item.uniqueWallets > 20
      )
      .map((item: { token: string; netFlow: number; smartWallets: number; uniqueWallets: number }) => ({
        token: item.token,
        chain,
        netFlowUsd: item.netFlow,
        smartWallets: item.smartWallets,
        uniqueWallets: item.uniqueWallets,
        signal: item.smartWallets > 20 ? "BUY" : item.smartWallets > 10 ? "WATCH" : "NONE",
      }));
  } catch {
    return getMockSignals(chain);
  }
}

function getMockSignals(chain: "base" | "polygon" | "solana"): SignalData[] {
  const allMock: SignalData[] = [
    { token: "ETH", chain: "base", netFlowUsd: 2850000, smartWallets: 34, uniqueWallets: 89, signal: "BUY" },
    { token: "SOL", chain: "solana", netFlowUsd: 1920000, smartWallets: 28, uniqueWallets: 67, signal: "BUY" },
    { token: "AVAX", chain: "base", netFlowUsd: 890000, smartWallets: 15, uniqueWallets: 42, signal: "WATCH" },
    { token: "ARB", chain: "base", netFlowUsd: 450000, smartWallets: 8, uniqueWallets: 23, signal: "WATCH" },
    { token: "JTO", chain: "solana", netFlowUsd: 320000, smartWallets: 6, uniqueWallets: 18, signal: "NONE" },
  ];

  if (chain === "base" || chain === "polygon") {
    return allMock.filter(s => s.chain === "base");
  }
  return allMock.filter(s => s.chain === "solana");
}
