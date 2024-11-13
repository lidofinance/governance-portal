import { useLidoSDK } from 'providers/lido-sdk';
import { useCallback, useMemo } from 'react';
import { Abi, Address, ContractFunctionArgs, ContractFunctionName } from 'viem';
import { ContractObject } from '../types';
import { getContractAddress } from '../get-contract-address';
import invariant from 'tiny-invariant';
import { useAccount } from 'wagmi';

export const useWriteContractGetter = <T extends Abi>({ abi }: { abi: T }) => {
  const account = useAccount();
  const {
    core: { web3Provider, rpcProvider },
  } = useLidoSDK();

  return useCallback(
    (address: Address) =>
      async <
        F extends ContractFunctionName<T, 'nonpayable' | 'payable'>,
        A extends ContractFunctionArgs<T, 'nonpayable' | 'payable', F>,
      >(
        functionName: F,
        args: A,
      ) => {
        invariant(web3Provider != null, 'Web3 provider is required');
        invariant(account.status === 'connected', 'Account is required');

        const { request } = await rpcProvider.simulateContract({
          address,
          abi,
          functionName,
          // TODO: fix type
          args: args as any,
          account: account.address,
        });

        return web3Provider.writeContract(request as any);
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

  const writeContractGetter = useWriteContractGetter({
    abi: contract.abi,
  });

  return {
    address: contractAddress,
    writeContract: writeContractGetter(contractAddress),
  };
};
