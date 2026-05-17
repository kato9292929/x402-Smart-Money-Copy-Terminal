"use client";

import { useState } from "react";
import { SignalData } from "@/lib/nansen";
import { PaymentModal } from "./PaymentModal";

const MOCK_SIGNALS: SignalData[] = [
  { token: "ETH",  chain: "base",    netFlowUsd: 2850000, smartWallets: 34, uniqueWallets: 89, signal: "BUY" },
  { token: "SOL",  chain: "solana",  netFlowUsd: 1920000, smartWallets: 28, uniqueWallets: 67, signal: "BUY" },
  { token: "AVAX", chain: "base",    netFlowUsd: 890000,  smartWallets: 15, uniqueWallets: 42, signal: "WATCH" },
  { token: "ARB",  chain: "base",    netFlowUsd: 450000,  smartWallets: 8,  uniqueWallets: 23, signal: "WATCH" },
  { token: "JTO",  chain: "solana",  netFlowUsd: 320000,  smartWallets: 6,  uniqueWallets: 18, signal: "NONE" },
];

function SignalBadge({ signal }: { signal: SignalData["signal"] }) {
  const classes = {
    BUY: "signal-buy",
    WATCH: "signal-watch",
    NONE: "signal-none",
  };
  const labels = {
    BUY: "STRONG BUY",
    WATCH: "WATCH",
    NONE: "NO SIGNAL",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs rounded font-mono ${classes[signal]}`}>
      {labels[signal]}
    </span>
  );
}

export function SignalTable() {
  const [selectedSignal, setSelectedSignal] = useState<SignalData | null>(null);

  async function handleExecute(chain: string, paymentMethod: string) {
    if (!selectedSignal) return;
    // paymentMethod is passed to the API for routing
    void paymentMethod;
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: selectedSignal.token,
          chain,
          amountUsd: 100,
        }),
      });
      const data = await res.json();
      if (data.txHash) {
        alert(`執行完了! TX: ${data.txHash}`);
      }
    } catch {
      alert("執行に失敗しました。");
    }
    setSelectedSignal(null);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="border-b border-[#222] text-[#666] uppercase text-xs tracking-wider">
              <th className="py-3 px-4 text-left">TOKEN</th>
              <th className="py-3 px-4 text-left">CHAIN</th>
              <th className="py-3 px-4 text-right">SMART WALLETS</th>
              <th className="py-3 px-4 text-right">NET FLOW</th>
              <th className="py-3 px-4 text-center">SIGNAL</th>
              <th className="py-3 px-4 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SIGNALS.map((signal, i) => (
              <tr
                key={i}
                className="border-b border-[#111] table-row-hover transition-colors"
              >
                <td className="py-3 px-4 text-[#00ff88] font-bold">{signal.token}</td>
                <td className="py-3 px-4 text-[#e0e0e0] uppercase text-xs">{signal.chain}</td>
                <td className="py-3 px-4 text-right text-[#e0e0e0]">{signal.smartWallets}</td>
                <td className="py-3 px-4 text-right text-[#00ff88]">
                  ${signal.netFlowUsd.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <SignalBadge signal={signal.signal} />
                </td>
                <td className="py-3 px-4 text-center">
                  {signal.signal === "BUY" ? (
                    <button
                      onClick={() => setSelectedSignal(signal)}
                      className="px-3 py-1.5 text-xs bg-[#00ff88] text-black font-bold rounded hover:bg-[#00cc6a] transition-all uppercase tracking-wider glow-green"
                    >
                      Execute Copy
                    </button>
                  ) : (
                    <span className="text-[#333] text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaymentModal
        signal={selectedSignal}
        onClose={() => setSelectedSignal(null)}
        onExecute={handleExecute}
      />
    </>
  );
}
