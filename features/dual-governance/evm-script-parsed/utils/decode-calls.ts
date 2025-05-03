import * as ADDR from 'shared/blockchain/contract-addresses';
import * as abis from 'generated';
import { Address, decodeFunctionData, Hex } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

type ContractName = keyof typeof ADDR;
type ExceptionContractName = keyof typeof ABI_EXCEPTIONS;

const ABI_EXCEPTIONS = {
  StETH: abis.StethAbi__factory.abi,
} as const;

export type DecodedCall = {
  contractName: string | undefined;
  contractAddress: Address;
  decoded: {
    functionName: string;
    args: readonly unknown[] | undefined;
  } | null;
  id: number;
};

type BaseCall = {
  target: Address;
  payload: Hex;
};

type Props<TCall extends BaseCall> = {
  calls: TCall[];
  chainId: CHAINS;
};

export const decodeCalls = <TCall extends BaseCall>({
  calls,
  chainId,
}: Props<TCall>): DecodedCall[] => {
  if (calls.length === 0) return [];

  return calls.map((call: TCall, index) => {
    const localId = index + 1;
    const contractAddress = call.target;
    const contractName = Object.keys(ADDR).find(
      (contractName: string) =>
        ADDR[contractName as ContractName][chainId]?.toLowerCase() ===
        contractAddress.toLowerCase(),
    );
    let abi;

    if (contractName && contractName in ABI_EXCEPTIONS) {
      abi = ABI_EXCEPTIONS[contractName as ExceptionContractName];
    } else {
      try {
        const abiFactoryKey =
          `${contractName as ContractName}Abi__factory` as keyof typeof abis;
        abi = abis[abiFactoryKey]?.abi;
      } catch (e) {
        throw new Error(`contractName: ${contractName}, error: ${e}`);
      }
    }

    const decoded = abi
      ? decodeFunctionData({
          abi: abi,
          data: call.payload,
        })
      : null;

    return { contractAddress, contractName, decoded, id: localId };
  });
};
