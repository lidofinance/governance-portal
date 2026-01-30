import { wrapRequest } from '@lidofinance/next-api-wrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { ETHERSCAN_REMOTE_API_URL } from 'constants/network';
import {
  defaultErrorHandler,
  httpMethodGuard,
  HttpMethod,
  rateLimit,
  responseTimeMetric,
} from 'utils-api';
import Metrics from 'utils-api/metrics';
import { API_ROUTES } from 'constants/api';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const queryParams = new URLSearchParams();

  // Copy query params
  Object.entries(req.query).forEach(([key, value]) => {
    if (typeof value === 'string') {
      queryParams.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v));
    }
  });

  // Add API key if available in env
  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (apiKey) {
    queryParams.set('apikey', apiKey);
  }

  const url = `${ETHERSCAN_REMOTE_API_URL}?${queryParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Etherscan API responded with status ${response.status}`);
  }

  const data = await response.json();
  res.status(response.status).json(data);
};

export default wrapRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(
    Metrics.request.apiTimings,
    API_ROUTES.REGISTER_DYNAMIC_ADDRESS || '/api/etherscan',
  ),
  defaultErrorHandler,
])(handler);
