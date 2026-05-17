import { paymentMiddleware } from "x402-next";
import type { Address } from "viem";

export const middleware = paymentMiddleware(
  (process.env.WALLET_ADDRESS ?? "0x0000000000000000000000000000000000000000") as Address,
  {
    "/api/signals": {
      price: "$0.05",
      network: "base",
      config: {
        description: "Smart Money Signal - 1 query",
      },
    },
    "/api/execute": {
      price: "$0.10",
      network: "base",
      config: {
        description: "Copy Trade Execution",
      },
    },
  }
);

export const config = {
  matcher: ["/api/signals", "/api/execute"],
};
