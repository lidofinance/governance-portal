import { Token } from 'shared/blockchain/types';

export type SupportFormDataContextValue = SupportFormNetworkData;

export type SupportFormInput = {
  token: Token;
  amount: string | undefined;
};

export type SupportFormNetworkData = {
  etherBalance: bigint | undefined;
  stEthBalance: bigint | undefined;
  wstEthBalance: bigint | undefined;
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
