import { useLidoSDK } from 'providers/lido-sdk';
import { useCallback } from 'react';
import { Abi, Address } from 'viem';
import { WriteFunctionArgs, WriteFunctionName } from '../types';
import { useAccount } from 'wagmi';
import { estimateGasFallback } from 'utils/estimate-gas-fallback';
import {
  simulateContract,
  writeContract,
  estimateContractGas,
} from 'viem/actions';

type Args<
  T extends Abi,
  F extends WriteFunctionName<T>,
  A extends WriteFunctionArgs<T, F>,
> = {
  address: Address;
  functionName: F;
  args: A;
};

export const useWriteContract = <T extends Abi>(abi: T) => {
  const { web3Provider, rpcProvider } = useLidoSDK();
  const account = useAccount();

  return useCallback(
    async <F extends WriteFunctionName<T>, A extends WriteFunctionArgs<T, F>>({
      address,
      functionName,
      args,
    }: Args<T, F, A>) => {
      const gasLimit = await estimateGasFallback(
        estimateContractGas(rpcProvider, {
          address,
          abi,
          functionName,
          args: args as any,
          account: account.address,
        }),
      );

      const { request } = await simulateContract(rpcProvider, {
        address,
        abi,
        functionName,
        args: args as any,
        account: account.address,
        gas: BigInt(gasLimit),
      });

      return writeContract(web3Provider, request as any);
    },
    [abi, account.address, rpcProvider, web3Provider],
  );
};
