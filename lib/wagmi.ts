"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, polygon } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "x402 Smart Money Copy Terminal",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [base, polygon],
  ssr: true,
});
