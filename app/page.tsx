import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SignalTable } from "@/components/SignalTable";
import { TerminalHeader } from "@/components/TerminalHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] scanline-bg">
      <TerminalHeader />

      {/* Hero Section */}
      <section className="relative grid-bg border-b border-[#222] py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Status indicator */}
          <div className="inline-flex items-center gap-2 bg-[#111] border border-[#00ff88] rounded-full px-4 py-1.5 mb-8 text-xs font-mono text-[#00ff88]">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] inline-block animate-pulse" />
            LIVE — 3 signals active
          </div>

          {/* Main heading */}
          <h1
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-[#00ff88] glow-green-text"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            SMART MONEY<br />COPY TERMINAL
          </h1>
          <span className="blink text-[#00ff88] text-4xl md:text-6xl font-bold">_</span>

          <p className="text-[#666] text-base md:text-lg font-mono mt-6 mb-10">
            スマートマネーのシグナルを検知し、自動執行する
          </p>

          {/* CTA */}
          <a
            href="#signals"
            className="inline-block bg-[#00ff88] text-black font-bold px-8 py-3 rounded text-sm tracking-widest uppercase hover:bg-[#00cc6a] transition-all glow-green"
          >
            シグナルを見る → $0.05 USDC / JPYC
          </a>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
            {[
              { label: "対応チェーン", value: "Solana・Base・Polygon" },
              { label: "最小検知", value: "5 wallets" },
              { label: "決済", value: "USDC・JPYC" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#111] border border-[#222] rounded p-4 font-mono"
              >
                <div className="text-[#666] text-xs uppercase tracking-wider mb-1">
                  {stat.label}
                </div>
                <div className="text-[#00ff88] text-sm">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signal Dashboard */}
      <section id="signals" className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-xl font-bold text-[#e0e0e0] tracking-wider"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              SIGNAL DASHBOARD
            </h2>
            <p className="text-[#666] text-xs font-mono mt-1">
              リアルタイム・スマートマネーフロー分析
            </p>
          </div>
          <ConnectButton />
        </div>

        <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden terminal-border">
          {/* Table header bar */}
          <div className="px-4 py-2 bg-[#0a0a0a] border-b border-[#222] flex items-center gap-2">
            <span className="text-[#00ff88] text-xs font-mono">●</span>
            <span className="text-[#666] text-xs font-mono">LIVE DATA FEED</span>
            <span className="text-[#333] text-xs font-mono ml-auto">
              Updated: {new Date().toISOString().slice(11, 19)} UTC
            </span>
          </div>
          <SignalTable />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222] px-6 py-6 text-center">
        <p className="text-[#333] text-xs font-mono">
          x402 Smart Money Copy Terminal — Powered by Nansen · x402 · Coinbase AgentKit
        </p>
        <p className="text-[#222] text-xs font-mono mt-1">
          本ツールは執行補助ツールです。投資判断はご自身で行ってください。
        </p>
      </footer>
    </div>
  );
}
