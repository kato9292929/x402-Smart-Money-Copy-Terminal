"use client";

import { useState, useEffect } from "react";
import { SignalData } from "@/lib/nansen";
import { usdToJpyc, formatJpyc } from "@/lib/jpyc";

interface PaymentModalProps {
  signal: SignalData | null;
  onClose: () => void;
  onExecute: (chain: string, paymentMethod: string) => void;
}

type ChainOption = "base" | "polygon" | "solana";
type PaymentMethod = "USDC" | "JPYC";

const CHAIN_PAYMENT_OPTIONS: Record<ChainOption, PaymentMethod[]> = {
  base: ["USDC", "JPYC"],
  polygon: ["USDC", "JPYC"],
  solana: ["USDC"],
};

export function PaymentModal({ signal, onClose, onExecute }: PaymentModalProps) {
  const [selectedChain, setSelectedChain] = useState<ChainOption>("base");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("USDC");
  const [showSolanaBanner, setShowSolanaBanner] = useState(false);
  const [jpycAmount, setJpycAmount] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    usdToJpyc(0.05).then(setJpycAmount);
  }, []);

  // Suppress unused variable warning — options are used for future extensibility
  void CHAIN_PAYMENT_OPTIONS;

  if (!signal) return null;

  function onChainSelect(chain: ChainOption) {
    setSelectedChain(chain);
    if (chain === "solana") {
      setPaymentMethod("USDC");
      setShowSolanaBanner(true);
    } else {
      setShowSolanaBanner(false);
    }
  }

  async function handleExecute() {
    setIsExecuting(true);
    try {
      await onExecute(selectedChain, paymentMethod);
    } finally {
      setIsExecuting(false);
    }
  }

  const isJpycDisabled = selectedChain === "solana";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-[#111] border border-[#333] rounded-lg p-6 terminal-border glow-green">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#00ff88] text-xl font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>
            執行を承認する
          </h2>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#e0e0e0] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Token Details */}
        <div className="bg-[#0a0a0a] border border-[#222] rounded p-4 mb-6 font-mono">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-[#666]">TOKEN</span>
            <span className="text-[#00ff88] text-right">{signal.token}</span>
            <span className="text-[#666]">CHAIN</span>
            <span className="text-[#e0e0e0] text-right uppercase">{signal.chain}</span>
            <span className="text-[#666]">NET FLOW</span>
            <span className="text-[#00ff88] text-right">${signal.netFlowUsd.toLocaleString()}</span>
            <span className="text-[#666]">SMART WALLETS</span>
            <span className="text-[#e0e0e0] text-right">{signal.smartWallets}</span>
          </div>
        </div>

        {/* Chain Selector */}
        <div className="mb-4">
          <p className="text-[#666] text-xs uppercase tracking-wider mb-2">チェーン選択</p>
          <div className="flex gap-2">
            {(["base", "polygon", "solana"] as ChainOption[]).map((chain) => (
              <button
                key={chain}
                onClick={() => onChainSelect(chain)}
                className={`flex-1 py-2 px-3 text-sm font-mono uppercase tracking-wider rounded transition-all ${
                  selectedChain === chain
                    ? "bg-[#00ff88] text-black font-bold"
                    : "bg-[#1a1a1a] text-[#666] border border-[#333] hover:border-[#00ff88] hover:text-[#00ff88]"
                }`}
              >
                {chain}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-4">
          <p className="text-[#666] text-xs uppercase tracking-wider mb-2">決済方法</p>
          <div className="flex gap-2">
            {(["USDC", "JPYC"] as PaymentMethod[]).map((method) => {
              const isDisabled = method === "JPYC" && isJpycDisabled;
              const isSelected = paymentMethod === method;
              return (
                <button
                  key={method}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setPaymentMethod(method)}
                  className={`flex-1 py-2 px-3 text-sm font-mono uppercase tracking-wider rounded transition-all ${
                    isDisabled
                      ? "opacity-30 cursor-not-allowed bg-[#1a1a1a] text-[#444] border border-[#222]"
                      : isSelected
                      ? "bg-[#00ff88] text-black font-bold"
                      : "bg-[#1a1a1a] text-[#666] border border-[#333] hover:border-[#00ff88] hover:text-[#00ff88]"
                  }`}
                >
                  {method === "JPYC" ? "¥ JPYC" : "$ USDC"}
                </button>
              );
            })}
          </div>
          <p className="text-[#444] text-xs mt-2">
            JPYCはPolygonネットワーク上で決済されます
          </p>
        </div>

        {/* Solana Banner */}
        {showSolanaBanner && (
          <div className="bg-[#ff6b3520] border border-[#ff6b35] rounded p-3 mb-4 text-sm text-[#ff6b35]">
            SolanaネットワークではUSDC決済のみご利用いただけます
          </div>
        )}

        {/* Price */}
        <div className="bg-[#0a0a0a] border border-[#222] rounded p-3 mb-6 text-sm font-mono">
          <div className="flex justify-between items-center">
            <span className="text-[#666]">手数料</span>
            <span className="text-[#00ff88]">
              {paymentMethod === "JPYC"
                ? formatJpyc(jpycAmount)
                : "$0.05 USDC"}
              {" + gas"}
            </span>
          </div>
        </div>

        {/* Execute Button */}
        <button
          onClick={handleExecute}
          disabled={isExecuting}
          className="w-full py-3 bg-[#00ff88] text-black font-bold text-sm tracking-widest uppercase rounded hover:bg-[#00cc6a] transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-green"
        >
          {isExecuting ? "実行中..." : "承認して執行"}
        </button>

        {/* Disclaimer */}
        <p className="text-[#444] text-xs text-center mt-4">
          本ツールは執行補助ツールです。投資判断はご自身で行ってください。
        </p>
      </div>
    </div>
  );
}
