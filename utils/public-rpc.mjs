import { createPublicClient, fallback, http } from 'viem';

const PUBLIC_RPC_TIMEOUT_MS = 15_000;

export const PUBLIC_RPC_URLS = {
  1: [
    'https://ethereum-rpc.publicnode.com',
    'https://eth.drpc.org',
    'https://cloudflare-eth.com',
  ],
  560048: [
    'https://ethereum-hoodi-rpc.publicnode.com',
    'https://rpc.hoodi.ethpandaops.io',
    'https://hoodi.drpc.org',
  ],
};

export const getPublicClient = (chainId) => {
  const urls = PUBLIC_RPC_URLS[chainId];
  if (!urls || urls.length === 0) {
    return null;
  }
  return createPublicClient({
    transport: fallback(
      urls.map((url) =>
        http(url, { retryCount: 2, timeout: PUBLIC_RPC_TIMEOUT_MS }),
      ),
    ),
  });
};
