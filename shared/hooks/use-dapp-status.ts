import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { useIsSupportedChain } from './use-is-supported-chain';

export const useDappStatus = () => {
  const { chainId, isConnected: isWalletConnected } = useAccount();
  const isSupportedChain = useIsSupportedChain();

  const isDappActive = useMemo(() => {
    if (!chainId) return false;

    return isWalletConnected && isSupportedChain;
  }, [chainId, isWalletConnected, isSupportedChain]);

  return {
    isSupportedChain,
    isDappActive,
  };
};
