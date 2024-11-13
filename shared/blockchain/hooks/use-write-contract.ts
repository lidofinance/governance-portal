import { useLidoSDK } from 'providers/lido-sdk';
import { useCallback, useMemo } from 'react';
import { Abi, Address } from 'viem';
import { ContractObject, WriteFunctionArgs, WriteFunctionName } from '../types';
import { getContractAddress } from '../get-contract-address';
import invariant from 'tiny-invariant';
import { useAccount } from 'wagmi';
import { simulateContract, writeContract } from 'viem/actions';

export const useWriteContractGetter = <T extends Abi>(abi: T) => {
  const account = useAccount();
  const { web3Provider, rpcProvider } = useLidoSDK();

  return useCallback(
    (address: Address) =>
      async <F extends WriteFunctionName<T>, A extends WriteFunctionArgs<T, F>>(
        functionName: F,
        args: A,
      ) => {
        invariant(web3Provider != null, 'Web3 provider is required');
        invariant(account.status === 'connected', 'Account is required');

        const { request } = await simulateContract(rpcProvider, {
          address,
          abi,
          functionName,
          // TODO: fix type
          args: args as any,
          account: account.address,
        });

        return writeContract(web3Provider, request as any);
      },
    [abi, account.address, account.status, rpcProvider, web3Provider],
  );
};

export const useWriteContract = <T extends Abi>(
  contract: ContractObject<T>,
) => {
  const { chainId } = useLidoSDK();

  const contractAddress = useMemo(
    () => getContractAddress(contract, chainId),
    [chainId, contract],
  );

  const writeContractGetter = useWriteContractGetter(contract.abi);

  return {
    address: contractAddress,
    writeContract: writeContractGetter(contractAddress),
  };
};
