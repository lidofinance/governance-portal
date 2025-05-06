import { useMemo } from 'react';
import { getStaticRpcBatchProvider } from 'utils/providersRPC';
import { StaticJsonRpcBatchProvider } from '@lidofinance/eth-providers';

import { useGetRpcUrlByChainId } from 'config/rpc';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config } from 'config';

export const useMainnetStaticRpcProvider = (): StaticJsonRpcBatchProvider => {
  const getRpcUrl = useGetRpcUrlByChainId();
  return useMemo(() => {
    return getStaticRpcBatchProvider(
      CHAINS.Mainnet,
      getRpcUrl(CHAINS.Mainnet),
      config.PROVIDER_POLLING_INTERVAL,
    );
  }, [getRpcUrl]);
};
