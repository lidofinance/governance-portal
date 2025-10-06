import { useMemo } from 'react';
import { getContractAddress } from '../get-contract-address';
import { useLidoSDK } from 'providers/lido-sdk';
import { ContractObject } from '../types';
import { useConfig } from '../../../config';
import { isTestnet as getIsTestnet } from '../utils/is-testnet';

export const useContractAddress = (contract: ContractObject) => {
  const { chainId } = useLidoSDK();
  const { userConfig } = useConfig();
  const isTestnet = getIsTestnet(chainId);
  const isInTestMode = userConfig.savedUserConfig.useTestContracts && isTestnet;

  return useMemo(
    () => getContractAddress(contract, chainId, isInTestMode),
    [chainId, contract, isInTestMode],
  );
};
