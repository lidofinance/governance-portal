import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAddress } from 'viem';

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

const ALLOWED_KIND = 'sell';
const ALLOWED_SIGNING_SCHEME = 'eip1271';
const ALLOWED_TOKEN_BALANCE = 'erc20';

let handler: API;

if (!secretConfig.cowApiUrl) {
  console.info(
    '[api/cow/place-order] Skipped setup: secretConfig.cowApiUrl is null',
  );
  handler = async (_, res) => {
    res.status(404).end();
  };
} else {
  const cowApiUrl = secretConfig.cowApiUrl;

  handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      from,
      sellToken,
      buyToken,
      receiver,
      sellAmount,
      buyAmount,
      validTo,
      appData,
      feeAmount,
      kind,
      partiallyFillable,
      signingScheme,
      sellTokenBalance,
      buyTokenBalance,
      signature,
    } = req.body;

    if (
      !isAddress(from) ||
      !isAddress(sellToken) ||
      !isAddress(buyToken) ||
      !isAddress(receiver)
    ) {
      res.status(400).json({ message: 'Invalid address in payload' });
      return;
    }

    if (kind !== ALLOWED_KIND || signingScheme !== ALLOWED_SIGNING_SCHEME) {
      res.status(400).json({ message: 'Invalid order parameters' });
      return;
    }

    if (
      sellTokenBalance !== ALLOWED_TOKEN_BALANCE ||
      buyTokenBalance !== ALLOWED_TOKEN_BALANCE
    ) {
      res.status(400).json({ message: 'Invalid token balance type' });
      return;
    }

    if (
      typeof validTo !== 'number' ||
      typeof sellAmount !== 'string' ||
      typeof buyAmount !== 'string'
    ) {
      res.status(400).json({ message: 'Invalid amount or validTo' });
      return;
    }

    const uid = await standardFetcher<string>(`${cowApiUrl}/orders`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        sellToken,
        buyToken,
        receiver,
        sellAmount,
        buyAmount,
        validTo,
        appData,
        feeAmount,
        kind,
        partiallyFillable,
        signingScheme,
        sellTokenBalance,
        buyTokenBalance,
        signature,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    res.status(201).json(uid);
  };
}

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.COW_PLACE_ORDER),
  defaultErrorHandler,
])(handler);
