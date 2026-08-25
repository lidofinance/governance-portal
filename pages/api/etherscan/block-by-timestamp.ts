import { NextApiRequest, NextApiResponse } from 'next';
import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import {
  errorAndCacheDefaultWrappers,
  HttpMethod,
  httpMethodGuard,
  rateLimit,
  responseTimeMetric,
} from 'utils-api';
import Metrics from 'utils-api/metrics';
import { API_ROUTES } from 'constants/api';
import { ETHERSCAN_REMOTE_API_URL } from 'constants/network';
import { config, secretConfig } from 'config';
import { etherscanQueue } from 'utils-api/etherscan-queue';
import { fetchExternal } from 'utils-api/fetch-external';

type EtherscanResponse = {
  status: string;
  message: string;
  result: string;
};

const queuedEtherscanRequest = async (
  chainId: string,
  timestamp: string,
): Promise<EtherscanResponse> => {
  return etherscanQueue.add(async () => {
    const url = `${ETHERSCAN_REMOTE_API_URL}?chainid=${chainId}&module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${secretConfig.etherscanApiKey}`;

    const response = await fetchExternal(url);

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
    console.error(
      'Etherscan block-by-timestamp error:',
      error instanceof Error ? error.message : error,
    );
    res.status(502);
    throw new Error('Failed to fetch block number from Etherscan');
  }
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(
    Metrics.request.apiTimings,
    API_ROUTES.ETHERSCAN_BLOCK_BY_TIMESTAMP,
  ),
  ...errorAndCacheDefaultWrappers,
])(handler);
