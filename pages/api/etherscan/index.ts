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
import { etherscanQueue } from 'utils-api/etherscan-queue';

const ALLOWED_MODULES = ['contract'] as const;
const ALLOWED_ACTIONS = ['getabi'] as const;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chainId, module, action, address } = req.query;

  const chainIdNum = parseInt(chainId as string, 10);
  if (
    !chainId ||
    typeof chainId !== 'string' ||
    isNaN(chainIdNum) ||
    !config.supportedChains.includes(chainIdNum)
  ) {
    return res.status(400).json({ message: 'Invalid chainId' });
  }

  if (
    !module ||
    typeof module !== 'string' ||
    !(ALLOWED_MODULES as readonly string[]).includes(module)
  ) {
    return res.status(400).json({ message: 'Invalid module' });
  }

  if (
    !action ||
    typeof action !== 'string' ||
    !(ALLOWED_ACTIONS as readonly string[]).includes(action)
  ) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  if (
    !address ||
    typeof address !== 'string' ||
    !/^0x[0-9a-fA-F]{40}$/.test(address)
  ) {
    return res.status(400).json({ message: 'Invalid address' });
  }

  const url = `${ETHERSCAN_REMOTE_API_URL}?chainid=${chainIdNum}&module=${module}&action=${action}&address=${address}&apikey=${secretConfig.etherscanApiKey}`;

  try {
    const data = await etherscanQueue.add(async () => {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Etherscan API error: ${response.status}`);
      }
      return response.json();
    });
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ message: 'Etherscan API error' });
  }
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.ETHERSCAN),
  defaultErrorHandler,
])(handler);
