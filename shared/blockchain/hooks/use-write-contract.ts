import { useLidoSDK } from 'providers/lido-sdk';
import { useCallback } from 'react';
import { Abi, Address, encodeFunctionData, Hex } from 'viem';
import { WriteFunctionArgs, WriteFunctionName } from '../types';
import { useAccount } from 'wagmi';
import { estimateGasFallback } from 'utils/estimate-gas-fallback';
import {
  estimateContractGas,
  simulateContract,
  writeContract,
} from 'viem/actions';
import { useIsContract } from './use-is-contract';

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
  const { data: isMultisig } = useIsContract();

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

      // Gnosis Safe workaround: regular writeContract (sendRawTransaction) causes
      // the call to either hang endlessly or fall back to the RPC transport.
      // Using eth_sendTransaction directly hands the tx to Safe without these issues.
      if (isMultisig) {
        const data = encodeFunctionData({
          abi: abi as Abi,
          functionName: functionName as string,
          args: args as readonly unknown[],
        });
        const txHash = await (web3Provider as any).request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: account.address,
              to: address,
              data,
              gas: '0x' + BigInt(gasLimit).toString(16),
            },
          ],
        });
        return txHash as Hex;
      }

      return await writeContract(web3Provider, request as any);
    },
    [abi, account.address, isMultisig, rpcProvider, web3Provider],
  );
};
