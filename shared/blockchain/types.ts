import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Abi, Address, ContractFunctionArgs, ContractFunctionName } from 'viem';

export const Token = {
  stETH: 'stETH',
  wstETH: 'wstETH',
  unstETH: 'Withdrawal NFT',
} as const;

export type Token = (typeof Token)[keyof typeof Token];

export type ChainAddressMap = Partial<Record<CHAINS, Address>>;

// TODO: maybe a better name?
export type ContractObject<T = Abi> = {
  name: string;
  abi: T;
  chainAddressMap: ChainAddressMap;
};

export type WriteFunctionName<T extends Abi | readonly unknown[]> =
  ContractFunctionName<T, 'nonpayable' | 'payable'>;

export type WriteFunctionArgs<
  T extends Abi | readonly unknown[],
  F extends WriteFunctionName<T>,
> = ContractFunctionArgs<T, 'nonpayable' | 'payable', F>;
