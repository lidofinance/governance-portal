import { estimateContractGas } from 'viem/actions';
import { useCallback } from 'react';
import { Abi } from 'viem';
import { ContractObject, WriteFunctionArgs, WriteFunctionName } from '../types';
import { getContractAddress } from '../get-contract-address';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import invariant from 'tiny-invariant';

export const useEstimateContractGas = <T extends Abi>(
  contract: ContractObject<T>,
) => {
  const account = useAccount();
  const { chainId, rpcProvider } = useLidoSDK();

  return useCallback(
    async <F extends WriteFunctionName<T>, A extends WriteFunctionArgs<T, F>>(
      functionName: F,
      args: A,
    ) => {
      invariant(account.status === 'connected', 'Account is required');

      return estimateContractGas(rpcProvider, {
        abi: contract.abi,
        address: getContractAddress(contract, chainId),
        functionName,
        // TODO: fix type
        args: args as any,
        account: account.address,
      });
    },
    [account.address, account.status, chainId, contract, rpcProvider],
  );
};
