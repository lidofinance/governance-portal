import { useMemo } from 'react';
import { ContractObject, Token } from '../types';
import { useLidoSDK } from 'providers/lido-sdk';
import { getContractAddress } from '../get-contract-address';
import { Address } from 'viem';
import { TOKEN_CONTRACT_MAP } from '../constants';

type TokenContractObject = {
  address: Address;
} & ContractObject<(typeof TOKEN_CONTRACT_MAP)[Token]['abi']>;

export const useTokenContractObject = (token: Token): TokenContractObject => {
  const { chainId } = useLidoSDK();

  return useMemo(() => {
    const contractObject = TOKEN_CONTRACT_MAP[token];
    const address = getContractAddress(contractObject, chainId);

    return { ...contractObject, address };
  }, [chainId, token]);
};
