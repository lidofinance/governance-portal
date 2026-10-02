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
} from 'utils-api';
import Metrics from 'utils-api/metrics';
import { rpcFactory } from 'utils-api/rpc-factory';
import { METRICS_PREFIX } from 'constants/metrics';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  DualGovernance,
  EmergencyGovernance,
  EmergencyProtectedTimelock,
  Voting,
  EasyTrack,
  DualGovernanceEscrow,
  StETH,
  WstETH,
  WithdrawalQueue,
} from 'shared/blockchain/contract-addresses';
import { Address } from 'viem';
import { HISTORICAL_ADDRESSES } from 'constants/historical-addresses';

const allowedLogContracts = (chainId: CHAINS) => {
  const contractAddresses = [
    DualGovernance[chainId],
    EmergencyProtectedTimelock[chainId],
    EmergencyGovernance[chainId],
    Voting[chainId],
    EasyTrack[chainId],
    DualGovernanceEscrow[chainId],
    StETH[chainId],
    WstETH[chainId],
    WithdrawalQueue[chainId],
  ];

  const hardcodedAddresses: Address[] = [];

  for (const contractAddress of contractAddresses) {
    if (!contractAddress) continue;

    if (
      contractAddress &&
      typeof contractAddress === 'object' &&
      ('actual' in contractAddress || 'test' in contractAddress)
    ) {
      if ('actual' in contractAddress && contractAddress.actual) {
        hardcodedAddresses.push(contractAddress.actual);
      }
      if ('test' in contractAddress && contractAddress.test) {
        hardcodedAddresses.push(contractAddress.test);
      }
    } else {
      hardcodedAddresses.push(contractAddress);
    }
  }

  const historicalGovernanceAddresses: Address[] =
    (HISTORICAL_ADDRESSES[chainId as keyof typeof HISTORICAL_ADDRESSES]
      ?.governanceAddresses as Address[] | undefined) || [];

  const historicalEscrowAddresses: Address[] =
    (HISTORICAL_ADDRESSES[chainId as keyof typeof HISTORICAL_ADDRESSES]
      ?.escrowAddresses as Address[] | undefined) || [];

  return [
    ...hardcodedAddresses,
    ...historicalGovernanceAddresses,
    ...historicalEscrowAddresses,
  ];
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
