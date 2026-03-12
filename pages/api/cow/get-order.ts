import {
  wrapRequest as wrapNextRequest,
  cacheControl,
} from '@lidofinance/next-api-wrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAddress } from 'viem';
import { Cache } from 'memory-cache';

import {
  HttpMethod,
  httpMethodGuard,
  rateLimit,
  responseTimeMetric,
  defaultErrorHandler,
} from 'utils-api';
import { API_ROUTES } from 'constants/api';
import Metrics from 'utils-api/metrics';
import { standardFetcher } from 'utils/standard-fetcher';
import { API } from 'types';
import { CowApiOrder } from '@stonks/types';
import { COW_API_URL } from 'shared/external-urls';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const STALENESS_TIME_MS = 10_000;

const cache = new Cache<string, CowApiOrder>();

const handler: API = async (req: NextApiRequest, res: NextApiResponse) => {
  const chainId = parseInt(req.query.chainId as string);
  if (isNaN(chainId)) {
    res.status(400).json({ message: 'Invalid chainId' });
    return;
  }

  const address = req.query.address;

  if (typeof address !== 'string' || !isAddress(address)) {
    res.status(400).json({ message: 'Invalid address' });
    return;
  }

  // There is no CoW API instance for Hoodi testnet, return mock order
  if (chainId !== CHAINS.Mainnet) {
    const mockOrder: CowApiOrder = {
      creationDate: new Date().toISOString(),
      uid: `mock-order-${address.toLowerCase()}-testnet`,
      executedSellAmount: '0',
      executedBuyAmount: '0',
      status: 'open',
    };
    res.json(mockOrder);
    return;
  }

  const cacheKey = `cow-order-${address}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  const orders = await standardFetcher<CowApiOrder[]>(
    `${COW_API_URL}/v1/account/${address}/orders`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(STALENESS_TIME_MS),
    },
  );

  const order = orders?.[0] ?? null;

  cache.put(cacheKey, order, STALENESS_TIME_MS);
  res.json(order);
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.COW_GET_ORDER),
  cacheControl({ headers: 'no-cache' }),
  defaultErrorHandler,
])(handler);
