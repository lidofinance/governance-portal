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
