import { useMemo } from 'react';
import { getContractAddress } from '../get-contract-address';
import { useLidoSDK } from 'providers/lido-sdk';
import { ContractObject } from '../types';
import { CHAINS } from '@lido-sdk/constants';

export const useContractAddress = (contract: ContractObject) => {
  const { chainId } = useLidoSDK();
  return useMemo(
    () => getContractAddress(contract, chainId as unknown as CHAINS),
    [chainId, contract],
  );
};
