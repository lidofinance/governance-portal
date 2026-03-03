import { useCallback, useMemo } from 'react';
import {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
  ReadContractReturnType,
  zeroAddress,
} from 'viem';
import { ContractObject } from '../types';
import { getContractAddress } from '../get-contract-address';
import { readContract } from 'viem/actions';
import { useLidoSDK } from 'providers/lido-sdk';
import { useConfig } from 'config';
import { isTestnet as getIsTestnet } from '../utils/is-testnet';

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
          if (address === zeroAddress) {
            throw new Error('Contract address is zero address');
          }
          return await readContract(rpcProvider, {
            abi,
            address,
            functionName,
            args,
          });
        } catch (error) {
          console.error(error);
          console.debug(
            `Error reading contract ${address}.${String(functionName)}, args: ${args}`,
          );
          return null as any;
        }
      },
    [abi, rpcProvider],
  );
};

type ReadContractFunction<T extends Abi> = <
  F extends ContractFunctionName<T, 'pure' | 'view'>,
  A extends ContractFunctionArgs<T, 'pure' | 'view', F>,
>(
  functionName: F,
  args?: A,
) => Promise<ReadContractReturnType<T, F>>;

export const useReadContract = <T extends Abi>(
  contract: ContractObject<T>,
): {
  address: Address;
  readContract: ReadContractFunction<T>;
} => {
  const { chainId } = useLidoSDK();
  const { userConfig } = useConfig();

  const contractAddress = useMemo(() => {
    const isTestnet = getIsTestnet(chainId);

    const isInTestMode =
      userConfig.savedUserConfig.useTestContracts && isTestnet;

    return getContractAddress(contract, chainId, isInTestMode);
  }, [chainId, contract, userConfig.savedUserConfig.useTestContracts]);

  const readContractGetter = useReadContractGetter(contract.abi);

  return {
    address: contractAddress,
    readContract: readContractGetter(contractAddress),
  };
};
