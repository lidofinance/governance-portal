import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { Readable } from 'stream';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { clone } from 'lodash';

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
  const parsedBody = req.body && JSON.parse(req.body);
  const requestInfo = {
    type: 'API request',
    path: 'subgraph',
    body: clone(parsedBody),
    query: clone(req.query),
    method: req.method,
    stage: 'INCOMING',
  };

  if (!parsedBody.query) {
    const status = 'Error: query is empty';
    console.error(status, requestInfo);
    res.status(400).json({ status });
    return;
  }

  const chainId = parseChainId(String(req.query.chainId));
  const url = SUBGRAPH_URL[chainId];

  if (!url) {
    const status = 'Error: subgraph chain is not supported';
    console.error(status, requestInfo);
    res.status(400).json({ status });
    return;
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: req.body,
    });

    if (!upstream.ok) {
      const errorMessage = await upstream.text();
      console.error('Error: subgraph request failed', {
        ...requestInfo,
        stage: 'ERROR',
        error: errorMessage,
      });
      res.status(upstream.status).send(errorMessage);
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

    console.info('Request to api/subgraph successfully fulfilled', {
      ...requestInfo,
      stage: 'FULFILLED',
    });
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Something went wrong',
      {
        error,
        ...requestInfo,
      },
    );
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

export default subgraph;
