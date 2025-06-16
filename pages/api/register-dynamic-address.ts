import { NextApiRequest, NextApiResponse } from 'next';
import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import { addDynamicAllowedLogsAddress } from 'utils-api/rpc-factory';
import { API_ROUTES } from 'constants/api';
import {
  rateLimit,
  responseTimeMetric,
  defaultErrorHandler,
  httpMethodGuard,
  HttpMethod,
} from 'utils-api';
import Metrics from 'utils-api/metrics';

type AddressType = 'governance' | 'escrow' | 'other';
const dynamicAddressesCache: Record<
  number,
  Record<AddressType, Set<string>>
> = {};

/**
 * Initialize cache for a chain and address type
 */
const initializeCache = (chainId: number): void => {
  if (!dynamicAddressesCache[chainId]) {
    dynamicAddressesCache[chainId] = {
      governance: new Set(),
      escrow: new Set(),
      other: new Set(),
    };
  }
};

/**
 * API endpoint to register dynamic addresses for RPC validation
 */
export const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { chainId, address, type = 'other' } = req.body;

    if (!chainId || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: chainId and address',
      });
    }

    if (!['governance', 'escrow', 'other'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address type',
      });
    }

    initializeCache(Number(chainId));

    dynamicAddressesCache[Number(chainId)][type as AddressType].add(
      address as string,
    );

    addDynamicAllowedLogsAddress(Number(chainId), address as string);

    const allAddresses = new Set<string>();
    Object.values(dynamicAddressesCache[Number(chainId)]).forEach(
      (addressSet) => {
        addressSet.forEach((addr) => allAddresses.add(addr));
      },
    );

    return res.status(200).json({
      success: true,
      message: `Successfully registered ${type} address ${address} for chain ${chainId}`,
      addresses: Array.from(allAddresses),
    });
  } catch (error) {
    console.error('Error registering dynamic address:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: String(error),
    });
  }
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(
    Metrics.request.apiTimings,
    API_ROUTES.REGISTER_DYNAMIC_ADDRESS || '/api/register-dynamic-address',
  ),
  defaultErrorHandler,
])(handler);
