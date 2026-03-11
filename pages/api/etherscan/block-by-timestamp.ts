import { NextApiRequest, NextApiResponse } from 'next';
import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import {
  defaultErrorHandler,
  HttpMethod,
  httpMethodGuard,
  rateLimit,
  responseTimeMetric,
} from 'utils-api';
import Metrics from 'utils-api/metrics';
import { API_ROUTES } from 'constants/api';
import { ETHERSCAN_REMOTE_API_URL } from 'constants/network';
import { config, secretConfig } from 'config';

type EtherscanResponse = {
  status: string;
  message: string;
  result: string;
};

class RequestQueue {
  private queue: Array<{
    requestFn: () => Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];
  private processing = false;
  private readonly maxConcurrent = 1;
  private readonly delayBetweenRequests = 1000;
  private activeRequests = 0;

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      void this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const queueItem = this.queue.shift();
      if (queueItem) {
        this.activeRequests++;

        queueItem
          .requestFn()
          .then((result) => {
            queueItem.resolve(result);
          })
          .catch((error) => {
            queueItem.reject(error);
          })
          .finally(() => {
            this.activeRequests--;
            setTimeout(() => {
              void this.processQueue();
            }, this.delayBetweenRequests);
          });
      }
    }

    this.processing = false;
  }
}

const etherscanQueue = new RequestQueue();

const queuedEtherscanRequest = async (
  chainId: string,
  timestamp: string,
): Promise<EtherscanResponse> => {
  return etherscanQueue.add(async () => {
    const url = `${ETHERSCAN_REMOTE_API_URL}?chainid=${chainId}&module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${secretConfig.etherscanApiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }

    const data: EtherscanResponse = await response.json();

    if (data.status !== '1') {
      throw new Error(`Etherscan API error: ${data.message}`);
    }

    return data;
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { timestamp, chainId } = req.query;

  const chainIdNum = parseInt(chainId as string, 10);
  if (
    !chainId ||
    typeof chainId !== 'string' ||
    isNaN(chainIdNum) ||
    !config.supportedChains.includes(chainIdNum)
  ) {
    return res.status(400).json({ message: 'Invalid chainId' });
  }

  const timestampNum = parseInt(timestamp as string, 10);
  if (
    !timestamp ||
    typeof timestamp !== 'string' ||
    isNaN(timestampNum) ||
    timestampNum <= 0 ||
    !Number.isSafeInteger(timestampNum)
  ) {
    return res.status(400).json({ message: 'Invalid timestamp' });
  }

  try {
    const result = await queuedEtherscanRequest(
      chainIdNum.toString(),
      timestampNum.toString(),
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(502).json({
      error: 'Failed to fetch block number from Etherscan',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(
    Metrics.request.apiTimings,
    API_ROUTES.ETHERSCAN_BLOCK_BY_TIMESTAMP,
  ),
  defaultErrorHandler,
])(handler);
