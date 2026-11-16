import {
  wrapRequest as wrapNextRequest,
  cacheControl,
} from '@lidofinance/next-api-wrapper';
import { NextApiRequest, NextApiResponse } from 'next';
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
import { standardFetcherExternal } from 'utils-api/fetch-external';
import { API } from 'types';
import { COW_API_URL } from 'shared/external-urls';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { CowApiTrade } from '@stonks/types';

const STALENESS_TIME_MS = 10_000;

const cache = new Cache<string, CowApiTrade[]>();

const handler: API = async (req: NextApiRequest, res: NextApiResponse) => {
  const chainId = parseInt(req.query.chainId as string);
  if (isNaN(chainId)) {
    res.status(400).json({ message: 'Invalid chainId' });
    return;
  }

  // There is no CoW API instance for Hoodi testnet
  if (chainId !== CHAINS.Mainnet) {
    res.json([]);
    return;
  }

  const orderUid = req.query.orderUid;
  if (typeof orderUid !== 'string' || !orderUid) {
    res.status(400).json({ message: 'Invalid orderUid' });
    return;
  }

  const cacheKey = `cow-trades-${orderUid}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  const data = await standardFetcherExternal<CowApiTrade[]>(
    `${COW_API_URL}/v2/trades?orderUid=${encodeURIComponent(orderUid)}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(STALENESS_TIME_MS),
    },
  );

  cache.put(cacheKey, data, STALENESS_TIME_MS);
  res.json(data);
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.COW_GET_TRADES),
  cacheControl({ headers: 'no-cache' }),
  defaultErrorHandler,
])(handler);
