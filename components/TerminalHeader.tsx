"use client";

import { useEffect, useState } from "react";

export function TerminalHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      setTime(new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC");
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-[#222] bg-[#0a0a0a] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[#666] text-xs font-mono ml-2">
          x402-smart-money-terminal v1.0.0
        </span>
      </div>
      <div className="text-[#444] text-xs font-mono">{time}</div>
    </div>
  );
}
