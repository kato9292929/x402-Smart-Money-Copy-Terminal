import { x402ResourceServer } from "@x402/next";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";
import { registerExactSvmScheme } from "@x402/svm/exact/server";
import { createFacilitatorConfig } from "@coinbase/x402";

function buildFacilitatorClient(): HTTPFacilitatorClient {
  const keyId = process.env.CDP_API_KEY_ID;
  const keySecret = process.env.CDP_API_KEY_SECRET;

  if (keyId && keySecret) {
    const config = createFacilitatorConfig(keyId, keySecret);
    return new HTTPFacilitatorClient(config);
  }

  const url = process.env.FACILITATOR_URL;
  if (url) {
    return new HTTPFacilitatorClient({ url });
  }

  // default: x402.org public facilitator
  return new HTTPFacilitatorClient();
}

const server = new x402ResourceServer(buildFacilitatorClient());

registerExactEvmScheme(server);
registerExactSvmScheme(server);

export { server as x402Server };
