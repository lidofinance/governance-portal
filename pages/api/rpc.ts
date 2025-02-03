import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import { trackedFetchRpcFactory } from '@lidofinance/api-rpc';

import { config, secretConfig } from 'config';
import { API_ROUTES } from 'constants/api';
import {
  rateLimit,
  responseTimeMetric,
  defaultErrorHandler,
  requestAddressMetric,
  httpMethodGuard,
  HttpMethod,
} from 'utilsApi';
import Metrics from 'utilsApi/metrics';
import { rpcFactory } from 'utilsApi/rpcFactory';
import {
  // METRIC_CONTRACT_ADDRESSES,
  METRIC_CONTRACT_EVENT_ADDRESSES,
} from 'utilsApi/contractAddressesMetricsMap';
import { METRICS_PREFIX } from 'constants/metrics';
import { CHAINS } from '@lido-sdk/constants';

// const allowedCallAddresses: Record<string, string[]> = Object.entries(
//   METRIC_CONTRACT_ADDRESSES,
// ).reduce(
//   (acc, [chainId, addresses]) => {
//     acc[chainId] = Object.keys(addresses);
//     return acc;
//   },
//   {} as Record<string, string[]>,
// );

const allowedLogsAddresses: Record<string, string[]> = Object.entries(
  METRIC_CONTRACT_EVENT_ADDRESSES,
).reduce(
  (acc, [chainId, addresses]) => {
    acc[chainId] = [
      ...Object.keys(addresses),
      '0xd70D836D60622D48648AA1dE759361D6B9a4Baa0', //TODO: move addresses to a proper list
      '0xdA7d2573Df555002503F29aA4003e398d28cc00f', // Voting
      '0x5A2958dC9532bAaCdF8481C8278735B1b05FB199', // DG
    ];
    return acc;
  },
  {} as Record<string, string[]>,
);

const rpc = rpcFactory({
  fetchRPC: trackedFetchRpcFactory({
    registry: Metrics.registry,
    prefix: METRICS_PREFIX,
  }),
  metrics: {
    prefix: METRICS_PREFIX,
    registry: Metrics.registry,
  },
  defaultChain: `${config.defaultChain}`,
  providers: {
    [CHAINS.Mainnet]: secretConfig.rpcUrls_1,
    [CHAINS.Holesky]: secretConfig.rpcUrls_17000,
  },
  allowedRPCMethods: [
    'test',
    'eth_call',
    'eth_gasPrice',
    'eth_getCode',
    'eth_estimateGas',
    'eth_getBlockByNumber',
    'eth_feeHistory',
    'eth_getBalance',
    'eth_blockNumber',
    'eth_getTransactionByHash',
    'eth_getTransactionReceipt',
    'eth_getTransactionCount',
    'eth_sendRawTransaction',
    'eth_getLogs',
    'eth_chainId',
    'net_version',
  ],
  // allowedCallAddresses,
  allowedLogsAddresses,
  maxBatchCount: config.PROVIDER_MAX_BATCH,
  disallowEmptyAddressGetLogs: true,
});

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.RPC),
  requestAddressMetric(Metrics.request.ethCallToAddress),
  defaultErrorHandler,
])(rpc);
