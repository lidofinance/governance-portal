import { useMemo } from 'react';
import { useDappStatus } from 'shared/hooks/use-dapp-status';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import {
  DelegationFormAsyncValidationContext,
  DelegationFormMode,
  DelegationFormNetworkData,
  DelegationFormValidationContext,
} from '../types';
import { useAccount } from 'wagmi';

type Args = {
  networkData: DelegationFormNetworkData;
  mode: DelegationFormMode;
};

export const useDelegationFormValidationContext = ({
  networkData,
  mode,
}: Args): DelegationFormValidationContext => {
  const { address: walletAddress } = useAccount();
  const { isDappActive } = useDappStatus();
  const { aragonDelegateAddress, snapshotDelegateAddress, loading } =
    networkData;

  const asyncContextValue: DelegationFormAsyncValidationContext | undefined =
    useMemo(() => {
      return isDappActive && !!walletAddress && !loading.isDelegationInfoLoading
        ? {
            isWalletActive: isDappActive,
            aragonDelegateAddress,
            snapshotDelegateAddress,
            walletAddress,
            mode,
          }
        : undefined;
    }, [
      isDappActive,
      walletAddress,
      loading.isDelegationInfoLoading,
      aragonDelegateAddress,
      snapshotDelegateAddress,
      mode,
    ]);

  const asyncContext = useAwaiter(asyncContextValue).awaiter;
  return {
    asyncContext,
  };
};
