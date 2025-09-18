import { useCallback, useMemo } from 'react';
import {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
  ReadContractReturnType,
} from 'viem';
import { ContractObject } from '../types';
import { getContractAddress } from '../get-contract-address';
import { readContract } from 'viem/actions';
import { useLidoSDK } from 'providers/lido-sdk';

export const useReadContractGetter = <T extends Abi>(abi: T) => {
  const { rpcProvider } = useLidoSDK();

  return useCallback(
    (address: Address) =>
      async <
        F extends ContractFunctionName<T, 'pure' | 'view'>,
        A extends ContractFunctionArgs<T, 'pure' | 'view', F>,
      >(
        functionName: F,
        args?: A,
      ): Promise<ReadContractReturnType<T, F>> => {
        try {
          return await readContract(rpcProvider, {
            abi,
            address,
            functionName,
            args,
          });
        } catch (error) {
          console.debug(
            `Error reading contract ${address}.${String(functionName)}`,
          );
          return null as any;
        }
      },
    [abi, rpcProvider],
  );
};

export const useReadContract = <T extends Abi>(contract: ContractObject<T>) => {
  const { chainId } = useLidoSDK();
  const contractAddress = useMemo(
    () => getContractAddress(contract, chainId),
    [chainId, contract],
  );

  const readContractGetter = useReadContractGetter(contract.abi);

  return {
    address: contractAddress,
    readContract: readContractGetter(contractAddress),
  };
};
