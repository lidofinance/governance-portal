import { useMemo } from 'react';
import { StETH, WstETH } from '../contracts';
import { Token } from '../types';
import { useLidoSDK } from 'providers/lido-sdk';
import { getContractAddress } from '../get-contract-address';

const TOKEN_CONTRACT_MAP = {
  [Token.stETH]: StETH,
  [Token.wstETH]: WstETH,
  [Token.unstETH]: WstETH,
};

export const useTokenContractObject = (token: Token) => {
  const { chainId } = useLidoSDK();

  return useMemo(() => {
    const contractObject = TOKEN_CONTRACT_MAP[token];
    const address = getContractAddress(contractObject, chainId);

    return { ...contractObject, address };
  }, [chainId, token]);
};
