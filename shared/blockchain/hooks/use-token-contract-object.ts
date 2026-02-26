import { useMemo } from 'react';
import { ContractObject, Token } from '../types';
import { useLidoSDK } from 'providers/lido-sdk';
import { getContractAddress } from '../get-contract-address';
import { Address } from 'viem';
import { TOKEN_CONTRACT_MAP } from '../constants';
import { useConfig } from 'config';

type TokenContractObject = {
  address: Address;
} & ContractObject<(typeof TOKEN_CONTRACT_MAP)[Token]['abi']>;

export const useTokenContractObject = (token: Token): TokenContractObject => {
  const { chainId } = useLidoSDK();
  const { userConfig } = useConfig();

  return useMemo(() => {
    const contractObject = TOKEN_CONTRACT_MAP[token];
    const address = getContractAddress(
      contractObject,
      chainId,
      userConfig.savedUserConfig.useTestContracts,
    );

    return { ...contractObject, address };
  }, [chainId, token, userConfig.savedUserConfig.useTestContracts]);
};
