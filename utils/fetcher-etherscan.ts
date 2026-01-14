import { Cache } from 'memory-cache';
import {
  ETHERSCAN_API_URL,
  ETHERSCAN_CACHE_TTL,
  ETHERSCAN_REMOTE_API_URL,
} from 'constants/network';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { standardFetcher } from './standard-fetcher';

const cache = new Cache<string, unknown>();

type Args = {
  chainId: CHAINS;
  module: string;
  action: string;
  address: string;
  apiKey?: string;
  useCache?: boolean;
};

export const fetcherEtherscan = async <T>({
  chainId,
  module,
  action,
  address,
  apiKey,
  useCache = true,
}: Args) => {
  const isProxy = !apiKey;

  const queryParams = [
    `chainId=${chainId}`,
    `module=${module}`,
    `action=${action}`,
    `address=${address}`,
    !isProxy && `apikey=${apiKey}`,
  ].filter(Boolean);

  const urlBase = isProxy ? ETHERSCAN_API_URL : ETHERSCAN_REMOTE_API_URL;
  const url = `${urlBase}?${queryParams.join('&')}`;

  if (useCache) {
    const cached = cache.get(url);
    if (cached) return cached as T;
  }

  const { status, result } = await standardFetcher<{
    status: number;
    result: T;
  }>(url, {
    method: 'POST',
  });

  if (Number(status) === 0) {
    throw new Error(String(result));
  }

  if (useCache) {
    cache.put(url, result, ETHERSCAN_CACHE_TTL);
  }

  return result;
};
