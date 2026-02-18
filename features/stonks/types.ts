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

export type OrderData = {
  address: Address;
  receiverAddress: string;
  stonksMetadata: StonksMetadata;
  validTo: number;
  sellAmount: bigint;
  buyAmount: bigint;
  isRecoverable: boolean;
  recoverableAmount: bigint;
  isExpired: boolean;
  hasBalance: boolean;
};

export type OffChainOrderStatus =
  | 'presignaturePending'
  | 'open'
  | 'fulfilled'
  | 'cancelled'
  | 'expired';

export type OrderStatus = 'not-created' | OffChainOrderStatus;

export type CowOrder = {
  uid: string;
  creationDate: string;
  status: OffChainOrderStatus;
  sellAmountFulfillmentPct: bigint;
  buyAmountFulfillmentPct: bigint;
  executedSellAmount: bigint;
  executedBuyAmount: bigint;
  transactions: {
    txHash: string;
  }[];
};

export type CowApiOrder = {
  creationDate: string;
  uid: string;
  executedSellAmount: string;
  executedBuyAmount: string;
  status: OffChainOrderStatus;
};

export type CowApiTrade = {
  txHash: string;
};
