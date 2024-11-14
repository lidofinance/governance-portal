import { estimateContractGas } from 'viem/actions';
import { Abi, Address } from 'viem';
import { ContractObject, WriteFunctionArgs, WriteFunctionName } from '../types';
import { getContractAddress } from '../get-contract-address';
import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ESTIMATE_ACCOUNT } from 'config/groups/web3';

export const useEstimateContractGas = <
  T extends Abi,
  F extends WriteFunctionName<T>,
  A extends WriteFunctionArgs<T, F>,
>(
  contract: ContractObject<T> | { address: Address | undefined; abi: T },
  functionName: F,
  args: A,
) => {
  const { chainId, rpcProvider } = useLidoSDK();

  const address = useMemo(() => {
    if ('address' in contract) {
      return contract.address;
    }

    return getContractAddress(contract, chainId);
  }, [chainId, contract]);

  return useQuery({
    queryKey: ['estimated-gas', functionName, chainId, address],
    staleTime: 60000,
    enabled: !!address,
    queryFn: async () => {
      if (!address) return;

      return estimateContractGas(rpcProvider, {
        abi: contract.abi,
        address,
        functionName,
        // TODO: fix type
        args: args as any,
        account: ESTIMATE_ACCOUNT,
      });
    },
  });
};
