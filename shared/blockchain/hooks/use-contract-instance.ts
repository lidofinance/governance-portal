import { useLidoSDK } from 'providers/lido-sdk';
import { useGlobalMemo } from 'shared/hooks';
import { ContractObject } from '../types';
import { Abi } from 'viem';
import { getContractInstance } from '../get-contract-instance';

export const useContractInstance = <T extends Abi>(
  contract: ContractObject<T>,
) => {
  const { core, chainId } = useLidoSDK();

  return useGlobalMemo(() => {
    const address = contract.chainAddressMap[chainId];

    if (!address) {
      throw new Error(
        `Contract ${contract.name} address is not defined for chain ${chainId}`,
      );
    }

    return getContractInstance(address, contract.abi, core);
  }, `${chainId}-contract-${contract.name}-instance`);
};
