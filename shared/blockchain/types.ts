import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Abi, Address, ContractFunctionArgs, ContractFunctionName } from 'viem';
import { ABIElement as ABIElementImported } from '@lidofinance/evm-script-decoder/lib/types';
import { ContractTransaction } from 'ethers';

export const Token = {
  stETH: 'stETH',
  wstETH: 'wstETH',
  unstETH: 'Withdrawal NFT',
} as const;

export type Token = (typeof Token)[keyof typeof Token];

export type ChainAddressMap = Partial<
  Record<CHAINS, Address | { test: Address; actual: Address }>
>;

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

// This is a little hack needed because some of the local ABIs
// doesn't meet the ABIElement type requirements
export type ABIElement = Omit<ABIElementImported, 'name' | 'type'> & {
  name?: string;
  type?: string;
};

export type ABI = ABIElement[];

export type SafeTx = {
  safeTxHash: string;
};

export type ResultTx =
  | {
      type: 'safe';
      tx: SafeTx;
    }
  | {
      type: 'regular';
      tx: ContractTransaction;
    };
