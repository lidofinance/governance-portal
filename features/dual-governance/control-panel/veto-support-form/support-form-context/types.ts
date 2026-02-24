import { WithdrawalsMap } from 'features/dual-governance/types';
import { Address } from 'viem';

export type SupportFormNetworkData = {
  etherBalance: bigint | undefined;
  stEthBalance: bigint | undefined;
  wstEthBalance: bigint | undefined;
  unstEthBalance: bigint | undefined;
  withdrawalRequests: WithdrawalsMap | undefined;
  vetoSignallingAddress?: Address | undefined;
  isAssetManagementLocked: boolean | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export type SupportFormAsyncValidationContext = {
  gasCost: bigint;
} & (
  | {
      isWalletActive: true;
      stEthBalance: bigint;
      wstEthBalance: bigint;
      etherBalance: bigint;
      isMultisig: boolean;
    }
  | {
      isWalletActive: false;
    }
);

export type SupportFormValidationContext = {
  asyncContext: Promise<SupportFormAsyncValidationContext>;
};
