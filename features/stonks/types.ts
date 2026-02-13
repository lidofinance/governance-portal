import { KnownToken } from 'shared/blockchain/tokens';
import { Address } from 'viem';

export type StonksMetadata = {
  address: Address;
  tokenFrom: KnownToken;
  tokenTo: KnownToken;
  version: 1 | 2;
  orderDuration: number; // in seconds
  marginBp: number;
  priceToleranceBp: number;
};

export type PlaceOrderFormInput = {
  sellAmount: bigint;
  minBuyAmount: bigint;
};

export type PlaceOrderFormNetworkData = {
  balance: bigint | undefined;
  estimatedOutputFromBalance: bigint | undefined;
  isLoading: boolean;
  isFetched: boolean;
  refetch: () => Promise<void>;
  fetchEstimatedOutput: (value: bigint | undefined) => Promise<bigint>;
};

export type PlaceOrderFormContextValue = PlaceOrderFormNetworkData & {
  stonksMetadata: StonksMetadata;
};
