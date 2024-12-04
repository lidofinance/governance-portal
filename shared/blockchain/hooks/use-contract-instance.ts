import { useLidoSDK } from 'providers/lido-sdk';
import { useGlobalMemo } from 'shared/hooks';
import { ContractObject } from '../types';
import { Abi, getContract } from 'viem';

export const useContractInstance = <T extends Abi>(
  contract: ContractObject<T>,
) => {
  const { rpcProvider, web3Provider, chainId } = useLidoSDK();

  return useGlobalMemo(() => {
    const address = contract.chainAddressMap[chainId];

    if (!address) {
      throw new Error(
        `Contract ${contract.name} address is not defined for chain ${chainId}`,
      );
    }

    return getContract({
      abi: contract.abi,
      address,
      client: {
        public: rpcProvider,
        wallet: web3Provider,
      },
    });
  }, `${chainId}-contract-${contract.name}-instance`);
};
