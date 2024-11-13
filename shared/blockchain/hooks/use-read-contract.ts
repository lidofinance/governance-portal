import { useCallback, useMemo } from 'react';
import { Abi, Address, ContractFunctionArgs, ContractFunctionName } from 'viem';
import { ContractObject } from '../types';
import { getContractAddress } from '../get-contract-address';
import { useChainId, useConfig } from 'wagmi';
import { readContract } from '@wagmi/core';

export const useReadContractGetter = <T extends Abi>({ abi }: { abi: T }) => {
  const config = useConfig();

  return useCallback(
    (address: Address) =>
      async <
        F extends ContractFunctionName<T, 'pure' | 'view'>,
        A extends ContractFunctionArgs<T, 'pure' | 'view', F>,
      >(
        functionName: F,
        args?: A,
      ) => {
        return readContract(config as any, {
          abi,
          address,
          functionName,
          args,
        });
      },
    [abi, config],
  );
};

export const useReadContract = <T extends Abi>(contract: ContractObject<T>) => {
  const chainId = useChainId();

  const contractAddress = useMemo(
    () => getContractAddress(contract, chainId),
    [chainId, contract],
  );

  const readContractGetter = useReadContractGetter({
    abi: contract.abi,
  });

  return {
    address: contractAddress,
    readContract: readContractGetter(contractAddress),
  };
};
