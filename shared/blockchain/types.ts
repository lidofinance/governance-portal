import { CHAINS } from '@lido-sdk/constants';
import { Abi, Address } from 'viem';
import { getContractInstance } from './get-contract-instance';

export const Token = {
  stETH: 'stETH',
  wstETH: 'wstETH',
  unstETH: 'unstETH',
} as const;

export type Token = (typeof Token)[keyof typeof Token];

export type ChainAddressMap = Partial<Record<CHAINS, Address>>;

// TODO: maybe a better name?
export type ContractObject<T = Abi> = {
  name: string;
  abi: T;
  chainAddressMap: ChainAddressMap;
};

export type ContractInstance<T extends Abi> = ReturnType<
  typeof getContractInstance<T>
>;
