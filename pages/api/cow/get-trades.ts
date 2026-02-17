import {
  wrapRequest as wrapNextRequest,
  cacheControl,
} from '@lidofinance/next-api-wrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { Cache } from 'memory-cache';

import { secretConfig } from 'config';
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

const STALENESS_TIME_MS = 10_000;

let handler: API;

if (!secretConfig.cowApiUrl) {
  console.info(
    '[api/cow/get-trades] Skipped setup: secretConfig.cowApiUrl is null',
  );
  handler = async (_: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end();
  };
} else {
  const cowApiUrl = secretConfig.cowApiUrl;
  const cache = new Cache<string, unknown>();

  handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

    const data = await standardFetcher(
      `${cowApiUrl}/trades?orderUid=${encodeURIComponent(orderUid)}`,
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
}

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.COW_GET_TRADES),
  cacheControl({ headers: 'no-cache' }),
  defaultErrorHandler,
])(handler);
