import { useMemo } from 'react';
import { getContractAddress } from '../get-contract-address';
import { useLidoSDK } from 'providers/lido-sdk';
import { ContractObject } from '../types';

export const useContractAddress = (contract: ContractObject) => {
  const { chainId } = useLidoSDK();
  return useMemo(
    () => getContractAddress(contract, chainId),
    [chainId, contract],
  );
};
