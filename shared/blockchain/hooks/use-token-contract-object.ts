import { useMemo } from 'react';
import { StETH, WstETH } from '../contracts';
import { ContractObject, Token } from '../types';
import { useLidoSDK } from 'providers/lido-sdk';
import { getContractAddress } from '../get-contract-address';
import { Address } from 'viem';

const TOKEN_CONTRACT_MAP = {
  [Token.stETH]: StETH,
  [Token.wstETH]: WstETH,
  [Token.unstETH]: WstETH,
};

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
