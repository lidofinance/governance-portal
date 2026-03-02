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
import { secretConfig } from 'config';

type EtherscanResponse = {
  status: string;
  message: string;
  result: string;
};

class RequestQueue {
  private queue: Array<{
    requestFn: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private processing = false;
  private readonly maxConcurrent = 1; // Max 1 concurrent Etherscan request
  private readonly delayBetweenRequests = 1000; // 1000ms delay between requests
  private activeRequests = 0;

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
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
): Promise<any> => {
  const requestPromise = etherscanQueue.add(async () => {
    const url = `https://api.etherscan.io/v2/api?chainid=${chainId}&module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${secretConfig.etherscanApiKey}`;

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

  return await requestPromise;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { timestamp, chainId } = req.query;

  if (!timestamp || timestamp === '0' || !chainId) {
    return res.status(200).json({
      message: 'Missing required parameters: timestamp and chainId',
    });
  }

  try {
    const result = await queuedEtherscanRequest(
      chainId as string,
      timestamp as string,
    );
    res.status(200).json(result);
  } catch (error) {
    console.debug('Error fetching block by timestamp:', error);
    res.status(200).json({
      error: 'Failed to fetch block number from Etherscan',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.ETHERSCAN),
  defaultErrorHandler,
])(handler);
