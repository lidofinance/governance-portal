import { useMemo } from 'react';
import { useDappStatus } from 'shared/hooks/use-dapp-status';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import {
  DelegationFormAsyncValidationContext,
  DelegationFormNetworkData,
  DelegationFormValidationContext,
} from '../types';
import { useAccount } from 'wagmi';

type Args = {
  networkData: DelegationFormNetworkData;
};

export const useDelegationFormValidationContext = ({
  networkData,
}: Args): DelegationFormValidationContext => {
  const { address: walletAddress } = useAccount();
  const { isDappActive } = useDappStatus();
  const { aragonDelegateAddress, loading } = networkData;

  const asyncContextValue: DelegationFormAsyncValidationContext | undefined =
    useMemo(() => {
      return isDappActive && !!walletAddress && !loading.isDelegationInfoLoading
        ? {
            isWalletActive: isDappActive,
            aragonDelegateAddress,
            walletAddress,
          }
        : undefined;
    }, [
      isDappActive,
      walletAddress,
      loading.isDelegationInfoLoading,
      aragonDelegateAddress,
    ]);

  const asyncContext = useAwaiter(asyncContextValue).awaiter;
  return {
    asyncContext,
  };
};
