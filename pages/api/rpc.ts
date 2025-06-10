import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import { trackedFetchRpcFactory } from '@lidofinance/api-rpc';

import { config, secretConfig } from 'config';
import { API_ROUTES } from 'constants/api';
import {
  rateLimit,
  responseTimeMetric,
  defaultErrorHandler,
  httpMethodGuard,
  HttpMethod,
} from 'utilsApi';
import Metrics from 'utilsApi/metrics';
import { rpcFactory } from 'utilsApi/rpcFactory';
import { METRICS_PREFIX } from 'constants/metrics';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  DualGovernance,
  EmergencyGovernance,
  EmergencyProtectedTimelock,
  Voting,
} from 'shared/blockchain/contract-addresses';
import { Address } from 'viem';
import { getDynamicGovernanceAddresses } from './register-governance-address';

const allowedLogContracts = (chainId: CHAINS) => {
  const hardcodedAddresses = [
    DualGovernance[chainId],
    EmergencyProtectedTimelock[chainId],
    EmergencyGovernance[chainId],
    Voting[chainId],
  ].filter((address): address is Address => address !== undefined);

  // Add dynamic governance addresses
  const dynamicAddresses = getDynamicGovernanceAddresses(chainId);

  return [...hardcodedAddresses, ...dynamicAddresses];
};

const allowedLogsAddresses = config.supportedChains.reduce(
  (allowedAddresses, chainId: CHAINS) => {
    allowedAddresses[chainId] = allowedLogContracts(chainId) || [];
    return allowedAddresses;
  },
  {} as Record<CHAINS, Address[]>,
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
    [CHAINS.Hoodi]: secretConfig.rpcUrls_560048,
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
  allowedLogsAddresses,
  maxBatchCount: config.PROVIDER_MAX_BATCH,
  disallowEmptyAddressGetLogs: true,
});

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.RPC),
  defaultErrorHandler,
])(rpc);
