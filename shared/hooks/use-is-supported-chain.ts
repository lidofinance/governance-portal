import { useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useUserConfig } from 'config/user-config';

export const useIsSupportedChain = () => {
  const { chainId: walletChainId } = useAccount();
  const chainId = useChainId();
  const { supportedChainIds } = useUserConfig();

  return useMemo(() => {
    if (walletChainId) {
      return supportedChainIds.indexOf(walletChainId) > -1;
    }

    return supportedChainIds.indexOf(chainId) > -1;
  }, [walletChainId, chainId, supportedChainIds]);
};
