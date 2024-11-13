import { stEthAbi } from 'abi/ts';
import { useChainId, useReadContract } from 'wagmi';
import { getTokenAddress } from '../get-contract-address';
import { Token } from '../types';

type SelectFn = (data: bigint) => unknown;

export const useTokenTotalSupply = (token: Token, selectFn?: SelectFn) => {
  const chainId = useChainId();

  return useReadContract({
    abi: stEthAbi,
    address: getTokenAddress(token, chainId),
    functionName: 'totalSupply',
    query: {
      select: selectFn,
    },
  });
};
