import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { Readable } from 'stream';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import {
  rateLimit,
  defaultErrorHandler,
  httpMethodGuard,
  HttpMethod,
} from 'utils-api';

export const ChainNames = {
  [CHAINS.Mainnet]: 'Mainnet',
  [CHAINS.Hoodi]: 'Hoodi',
} as const;

export const parseChainId = (chainId: number | string) => {
  return Number(chainId) as keyof typeof ChainNames;
};

// Limit request body size to 100kb
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb',
    },
  },
};

const { serverRuntimeConfig } = getConfig();
export const SUBGRAPH_URL: Partial<Record<CHAINS, string>> = {
  [CHAINS.Mainnet]: serverRuntimeConfig.subgraphMainnet,
  [CHAINS.Hoodi]: serverRuntimeConfig.subgraphHoodi,
} as const;

/**
 * Convert a WHATWG ReadableStream<Uint8Array> into a Node.js Readable
 */
const webStreamToNodeStream = (
  webStream: ReadableStream<Uint8Array>,
): Readable => {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (err) {
        this.destroy(err as Error);
      }
    },
  });
};

const subgraph = async (req: NextApiRequest, res: NextApiResponse) => {
  let parsedBody: { query?: string } | undefined;
  try {
    parsedBody = req.body && JSON.parse(req.body);
  } catch {
    res.status(400).json({ status: 'Error: invalid request body' });
    return;
  }

  if (!parsedBody?.query) {
    console.error('Subgraph API: query is empty');
    res.status(400).json({ status: 'Error: query is empty' });
    return;
  }

  const chainId = parseChainId(String(req.query.chainId));
  const url = SUBGRAPH_URL[chainId];

  if (!url) {
    console.error('Subgraph API: unsupported chain', { chainId });
    res.status(400).json({ status: 'Error: subgraph chain is not supported' });
    return;
  }

  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: req.body,
  });

  if (!upstream.ok) {
    console.error('Subgraph API: upstream request failed', {
      chainId,
      status: upstream.status,
    });
    res.status(502).json({ status: 'Error: upstream request failed' });
    return;
  }

  // Forward the status code
  res.status(upstream.status);

  // Copy headers except content-encoding and content-length
  upstream.headers.forEach((value, key) => {
    const name = key.toLowerCase();
    if (name === 'content-encoding' || name === 'content-length') return;
    res.setHeader(key, value);
  });

  // Stream the response body
  if (upstream.body) {
    if (typeof (upstream.body as any).getReader === 'function') {
      webStreamToNodeStream(upstream.body).pipe(res);
    } else {
      // Node.js Readable
      (upstream.body as unknown as Readable).pipe(res);
    }
  } else {
    res.end();
  }

  console.info('Subgraph API: request fulfilled', { chainId });
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  defaultErrorHandler,
])(subgraph);
