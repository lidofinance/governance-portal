import { useCallback } from 'react';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { useUserConfig } from '../user-config';

const getBackendRPCPath = (chainId: string | number): string => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  return `${BASE_URL}/api/rpc?chainId=${chainId}`;
};

export const useGetRpcUrlByChainId = () => {
  const userConfig = useUserConfig();
  const savedRpcUrls = userConfig.savedUserConfig.rpcUrls;

  return useCallback(
    (chainId: CHAINS) => {
      return savedRpcUrls[chainId] || getBackendRPCPath(chainId);
    },
    [savedRpcUrls],
  );
};
