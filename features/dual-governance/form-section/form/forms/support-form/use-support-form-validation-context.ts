import { useMemo } from 'react';
import { useDappStatus } from 'shared/hooks/use-dapp-status';
import { useAwaiter } from 'shared/hooks/use-awaiter';

import type {
  SupportFormNetworkData,
  SupportFormAsyncValidationContext,
  SupportFormValidationContext,
} from './support-form-context';

type UseSupportFormValidationContextArgs = {
  networkData: SupportFormNetworkData;
};

export const useSupportFormValidationContext = ({
  networkData,
}: UseSupportFormValidationContextArgs): SupportFormValidationContext => {
  const { isDappActive } = useDappStatus();
  const { etherBalance, stEthBalance, wstEthBalance } = networkData;

  const isDataLoaded =
    etherBalance !== undefined &&
    stEthBalance !== undefined &&
    wstEthBalance !== undefined;

  const isDataReady = isDappActive ? isDataLoaded : false;

  const asyncContextValue: SupportFormAsyncValidationContext | undefined =
    useMemo(() => {
      return isDataReady
        ? ({
            isWalletActive: isDappActive,
            stEthBalance,
            wstEthBalance,
          } as SupportFormAsyncValidationContext)
        : undefined;
    }, [isDataReady, isDappActive, stEthBalance, wstEthBalance]);

  const asyncContext = useAwaiter(asyncContextValue).awaiter;
  return {
    asyncContext,
  };
};
